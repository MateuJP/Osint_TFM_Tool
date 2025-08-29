from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import OrientacionPolitica
from schemas.orientacionPolitica import OrientacionPoliticaBase,OrientacionPoliticaCreate,OrientacionPoliticaOut
from auth import get_current_user

router = APIRouter(prefix="/orientacion_politica", tags=["Orientaciones Políticas"])

@router.post("/crear", response_model=OrientacionPoliticaOut, status_code=status.HTTP_201_CREATED)
def create_orientacion_politica(orientacion: OrientacionPoliticaCreate, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    nombre_exist = db.query(OrientacionPolitica).filter(func.lower(OrientacionPolitica.nombre) == orientacion.nombre.lower()).first()
    if nombre_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de la orientación política ya existe")
    
    new_orientacion = OrientacionPolitica(nombre=orientacion.nombre.strip())
    db.add(new_orientacion)
    db.commit()
    db.refresh(new_orientacion)
    return new_orientacion

@router.get("/list", response_model=list[OrientacionPoliticaOut])
def listar_orientaciones_politicas(_user = Depends(get_current_user), db: Session= Depends(get_db), q: str | None = None):
    query = db.query(OrientacionPolitica)
    if q:
        query = query.filter(func.lower(OrientacionPolitica.nombre).like(f"%{q.lower()}%"))
    return query.order_by(OrientacionPolitica.id_orientacion_politica.asc()).all()

