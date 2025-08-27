from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.sesion import get_db
from db.models import Accion
from schemas.accion import AccionCreate, AccionOut, AccionUpdate
from auth import get_current_user

router = APIRouter(prefix="/acciones", tags=["Acciones"])

@router.post("/crear", response_model=AccionOut, status_code=status.HTTP_201_CREATED)
def create_accion(accion: AccionCreate, db: Session = Depends(get_db), _user = Depends(get_current_user)):

    new_accion = Accion(
        notas=accion.notas,
        observaciones=accion.observaciones,
        url=accion.url,
        resumen=accion.resumen,
        fecha=accion.fecha,
        id_identidad=accion.id_identidad,
        id_cuenta=accion.id_cuenta
    )
    db.add(new_accion)
    db.commit()
    db.refresh(new_accion)
    return new_accion

@router.get("/listar/{id_cuenta}", response_model=list[AccionOut])
def listar_acciones_de_cuenta(id_cuenta: int, db: Session = Depends(get_db), _user = Depends(get_current_user), q: str | None = Query(None, description="Buscar acciones por nombre")):
    query = db.query(Accion).filter(Accion.id_cuenta == id_cuenta)
    if q:
        query = query.filter(func.lower(Accion.nombre).like(f"%{q.lower()}%"))
    return query.order_by(Accion.id_accion.asc()).all()

@router.put("/actualizar/{id_accion}", response_model=AccionOut)
def update_accion(id_accion: int, accion: AccionUpdate, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    existing_accion = db.query(Accion).filter(Accion.id_accion == id_accion).first()
    if not existing_accion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Acción no encontrada")
    
    existing_accion.nombre = accion.nombre.strip()
    
    db.commit()
    db.refresh(existing_accion)
    return existing_accion

@router.delete("/eliminar/{id_accion}", status_code=status.HTTP_204_NO_CONTENT) 
def delete_accion(id_accion: int, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    existing_accion = db.query(Accion).filter(Accion.id_accion == id_accion).first()
    if not existing_accion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Acción no encontrada")
    
    db.delete(existing_accion)
    db.commit()
    return