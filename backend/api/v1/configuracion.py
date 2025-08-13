from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.sesion import get_db
from db.models import Configuracion
from schemas.configuracion import ConfiguracionCreate, ConfiguracionOut
from auth import get_password_hash, verify_password,create_access_token,get_current_user

router = APIRouter(prefix ="/user", tags = ["Configuración"])

@router.post("/new", response_model = ConfiguracionOut, status_code = status.HTTP_201_CREATED)
def create_user(configuracion: ConfiguracionCreate, db: Session = Depends(get_db)):
    
    exist = db.query(Configuracion).filter(func.lower(Configuracion.nombre) == configuracion.nombre.lower()).first()
    if exist:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "El usuario ya existe")
    hashed_password = get_password_hash(configuracion.password)
    new_configuracion = Configuracion(
        nombre = configuracion.nombre.strip(),
        password = hashed_password.strip(),
        apikey = configuracion.apikey,
        modo = configuracion.modo
    )
    db.add(new_configuracion)
    db.commit()
    db.refresh(new_configuracion)
    return new_configuracion

@router.get("/login")
def login(nombre: str, password: str, db: Session = Depends(get_db)):
    user = db.query(Configuracion).filter(func.lower(Configuracion.nombre) == nombre.lower()).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Credenciales no válidas")
    
    access_token = create_access_token(data={"sub": user.nombre})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model = ConfiguracionOut)
def read_current_user(current_user: Configuracion = Depends(get_current_user)):
    return current_user