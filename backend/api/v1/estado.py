from fastapi import APIRouter, HTTPException,Query, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import Estado
from schemas.estado import EstadoCreate, EstadoUpdate, EstadoOut
from auth import get_current_user
router = APIRouter(prefix="/estados", tags=["Estados"])

@router.post("/crear", response_model=EstadoOut, status_code=status.HTTP_201_CREATED)
def create_estado(estado: EstadoCreate, db: Session = Depends(get_db),_user = Depends(get_current_user)):
    nombre_exist = db.query(Estado).filter(func.lower(Estado.nombre) == estado.nombre.lower()).first()
    if nombre_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre del estado ya existe")
    
    new_estado = Estado(nombre=estado.nombre.strip())
    db.add(new_estado)
    db.commit()
    db.refresh(new_estado)
    return new_estado
@router.get("/list", response_model=list[EstadoOut])
def listar_estados(_user = Depends(get_current_user),db: Session = Depends(get_db), q: str | None = Query(None, description="Buscar estados por nombre")):
    query = db.query(Estado)
    if q:
        query = query.filter(func.lower(Estado.nombre).like(f"%{q.lower()}%"))
    return query.order_by(Estado.id_estado.asc()).all()

@router.put("/actualizar/{id_estado}", response_model=EstadoOut)
def update_estado(id_estado: int, estado: EstadoUpdate, db: Session = Depends(get_db),_user = Depends(get_current_user)):
    existing_estado = db.query(Estado).filter(Estado.id_estado == id_estado).first()
    if not existing_estado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estado no encontrado")
    
    nombre_exist = db.query(Estado).filter(
        and_(
            func.lower(Estado.nombre) == estado.nombre.lower(),
            Estado.id_estado != id_estado
        )
    ).first()
    if nombre_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre del estado ya existe")
    
    existing_estado.nombre = estado.nombre.strip()
    
    db.commit()
    db.refresh(existing_estado)
    return existing_estado
@router.delete("/eliminar/{id_estado}", status_code=status.HTTP_204_NO_CONTENT) 
def delete_estado(id_estado: int, db: Session = Depends(get_db),_user = Depends(get_current_user)):
    existing_estado = db.query(Estado).filter(Estado.id_estado == id_estado).first()
    if not existing_estado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estado no encontrado")
    
    db.delete(existing_estado)
    db.commit()
    return