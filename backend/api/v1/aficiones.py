from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.sesion import get_db
from db.models import Aficiones
from schemas.aficiones import AficionCreate, AficionOut

router = APIRouter(prefix = "/aficiones",tags=["Aficiones"])

@router.post("/crear",response_model=AficionOut, status_code=status.HTTP_201_CREATED)
def create_aficion(aficion: AficionCreate, db: Session = Depends(get_db)):
    exist = db.query(Aficiones).filter(func.lower(Aficiones.nombre)== aficion.nombre.lower()).first()
    if exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La afición ya existe")
    
    new_aficion = Aficiones(nombre=aficion.nombre.strip())
    db.add(new_aficion)
    db.commit()
    db.refresh(new_aficion)
    return new_aficion

@router.get("/list", response_model = list[AficionOut])
def listar_aficiones (db: Session = Depends(get_db), q : str | None = Query(None, description="Buscar aficiones por nombre")):
    query = db.query(Aficiones)
    if q:
        query = db.query(Aficiones).filter(func.lower(Aficiones.nombre).like(f"%{q.lower()}%"))
    return query.order_by(Aficiones.id_aficion.asc()).all()