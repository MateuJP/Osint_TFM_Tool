from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import Nacionalidad
from schemas.nacionalidad import NacionalidadCreate,NacionalidadOut
from auth import get_current_user

router = APIRouter(prefix="/nacionalidad",tags=["Nacionalidades"])

@router.post("/crear",response_model = NacionalidadOut, status_code = status.HTTP_201_CREATED)
def create_nacionalidad(nacionalidad: NacionalidadCreate, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    nombre_exist = db.query(Nacionalidad).filter(func.lower(Nacionalidad.nombre) == nacionalidad.nombre.lower()).first()
    if nombre_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de la nacionalidad ya existe")
    
    codigo_exist = db.query(Nacionalidad).filter(func.lower(Nacionalidad.codigo) == nacionalidad.codigo.lower()).first()
    if codigo_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El código de la nacionalidad ya existe")
    
    new_nacionalidad = Nacionalidad(nombre=nacionalidad.nombre.strip(), codigo=nacionalidad.codigo.strip())
    db.add(new_nacionalidad)
    db.commit()
    db.refresh(new_nacionalidad)
    return new_nacionalidad

@router.get("/list",response_model=list[NacionalidadOut])
def listar_nacionalidades(_user = Depends(get_current_user),db: Session = Depends(get_db), q: str | None = None):
    query = db.query(Nacionalidad)
    if q:
        query = query.filter(or_(
            func.lower(Nacionalidad.nombre).like(f"%{q.lower()}%"),
            func.lower(Nacionalidad.codigo).like(f"%{q.lower()}%")
        ))
    return query.order_by(Nacionalidad.id_nacionalidad.asc()).all()