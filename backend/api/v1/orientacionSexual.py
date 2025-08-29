from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import OrientacionSexual
from schemas.orientacionSexual import OrientacionSexualCreate, OrientacionSexualOut
from auth import get_current_user

router = APIRouter(prefix="/orientacion_sexual", tags=["Orientaciones Sexuales"])

@router.post("/crear", response_model=OrientacionSexualOut, status_code=status.HTTP_201_CREATED)
def create_orientacion_sexual(orientacion: OrientacionSexualCreate, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    nombre_exist = db.query(OrientacionSexual).filter(func.lower(OrientacionSexual.nombre) == orientacion.nombre.lower()).first()
    if nombre_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de la orientación sexual ya existe")
    
    new_orientacion = OrientacionSexual(nombre=orientacion.nombre.strip())
    db.add(new_orientacion)
    db.commit()
    db.refresh(new_orientacion)
    return new_orientacion

@router.get("/list", response_model=list[OrientacionSexualOut])
def listar_orientaciones_sexuales(_user = Depends(get_current_user), db: Session= Depends(get_db), q: str | None = None):
    query = db.query(OrientacionSexual)
    if q:
        query = query.filter(func.lower(OrientacionSexual.nombre).like(f"%{q.lower()}%"))
    return query.order_by(OrientacionSexual.id_orientacion.asc()).all()