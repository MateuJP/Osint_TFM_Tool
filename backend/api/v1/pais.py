from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import Pais
from schemas.pais import PaisBase, PaisCreate, PaisOut
from auth import get_current_user

router = APIRouter(prefix="/pais", tags=["Nacionalidades"])

@router.post("/crear", response_model=PaisOut, status_code=status.HTTP_201_CREATED)
def create_pais(pais: PaisCreate, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    nombre_exist = db.query(Pais).filter(func.lower(Pais.nombre) == pais.nombre.lower()).first()
    if nombre_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre del país ya existe")
    
    codigo_exist = db.query(Pais).filter(func.lower(Pais.codigo) == pais.codigo.lower()).first()
    if codigo_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El código del país ya existe")
    
    new_pais = Pais(nombre=pais.nombre.strip(), codigo=pais.codigo.strip())
    db.add(new_pais)
    db.commit()
    db.refresh(new_pais)
    return new_pais
@router.get("/list", response_model=list[PaisOut])
def listar_paises(_user = Depends(get_current_user), db: Session= Depends(get_db), q: str | None = None):
    query = db.query(Pais)
    if q:
        query = query.filter(or_(
            func.lower(Pais.nombre).like(f"%{q.lower()}%"),
            func.lower(Pais.codigo).like(f"%{q.lower()}%")
        ))
    return query.order_by(Pais.id_pais.asc()).all()