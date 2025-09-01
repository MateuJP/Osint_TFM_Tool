from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.sesion import get_db
from db.models import Configuracion
from schemas.configuracion import ConfiguracionCreate, ConfiguracionOut, ConfiguracionLogin,ConfiguracionUpdate
from auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/user", tags=["Auth"])

@router.post("/new", response_model=ConfiguracionOut, status_code=status.HTTP_201_CREATED)
def create_user(body: ConfiguracionCreate, db: Session = Depends(get_db)):
    exists = db.query(Configuracion).filter().first()
    if exists:
        raise HTTPException(status_code=400, detail="Ya existe un usuario en el sistema")

    hashed = get_password_hash(body.password)
    user = Configuracion(
        nombre=body.nombre.strip(),
        password=hashed,
        apikey=body.apikey,
        modo=body.modo
    )
    db.add(user); db.commit(); db.refresh(user)
    return user

# Login por JSON 
@router.post("/login")
def login_json(body: ConfiguracionLogin, db: Session = Depends(get_db)):
    user = db.query(Configuracion).filter(
        func.lower(Configuracion.nombre) == body.username.lower()
    ).first()
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales no válidas")

    token = create_access_token({"sub": user.nombre})
    return {"access_token": token, "token_type": "bearer"}

# Login para el modal de Swagger (form-urlencoded)
@router.post("/login_form")
def login_form(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Configuracion).filter(
        Configuracion.nombre == form.username
    ).first()
    if not user or not verify_password(form.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales no válidas")

    token = create_access_token({"sub": user.nombre})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=ConfiguracionOut)
def read_current_user(current_user: Configuracion = Depends(get_current_user)):
    return current_user

@router.put("/update", response_model=ConfiguracionOut)
def update_user(
    user: ConfiguracionUpdate,
    db: Session = Depends(get_db),
    current_user: Configuracion = Depends(get_current_user)
):
    existing_user = db.query(Configuracion).filter(
        func.lower(Configuracion.nombre) == current_user.nombre.lower()
    ).first()

    if not existing_user:
        raise HTTPException(status_code=404, detail="Usuario no existe")

    update_data = user.dict(exclude_unset=True)

    if "password" in update_data and update_data["password"]:
        update_data["password"] = get_password_hash(update_data["password"])

    for key, value in update_data.items():
        setattr(existing_user, key, value)

    db.commit()
    db.refresh(existing_user)
    return existing_user
