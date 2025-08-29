from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import SituacionSentimental
from schemas.situacion_sentimental import SituacionSentimentalCreate, SituacionSentimentalUpdate, SituacionSentimentalOut
from auth import get_current_user

router = APIRouter(prefix="/situaciones_sentimentales", tags=["Situaciones Sentimentales"])

@router.post("/crear", response_model=SituacionSentimentalOut, status_code=status.HTTP_201_CREATED)
def create_situacion_sentimental(situacion: SituacionSentimentalCreate, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    nombre_exist = db.query(SituacionSentimental).filter(func.lower(SituacionSentimental.nombre) == situacion.nombre.lower()).first()
    if nombre_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de la situación sentimental ya existe")
    
    new_situacion = SituacionSentimental(nombre=situacion.nombre.strip())
    db.add(new_situacion)
    db.commit()
    db.refresh(new_situacion)
    return new_situacion

@router.get("/list", response_model=list[SituacionSentimentalOut])
def listar_situaciones_sentimentales(_user = Depends(get_current_user), db: Session = Depends(get_db), q: str | None = None):
    query = db.query(SituacionSentimental)
    if q:
        query = query.filter(func.lower(SituacionSentimental.nombre).like(f"%{q.lower()}%"))
    return query.order_by(SituacionSentimental.id_situacion_sentimental.asc()).all()


