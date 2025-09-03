from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from db.sesion import get_db
from db.models import Configuracion, Identidad
from schemas.identidad import IdentidadCreate, IdentidadOut
from schemas.asistente import AsistenteQuery
from auth import get_current_user
from services.gemini import AIGenerator

router = APIRouter(prefix="/asistente", tags=["Asistente"])


@router.post("/generar-identidad", response_model=IdentidadOut)
def generar_identidad_asistente(
    objetivo: AsistenteQuery,
    db: Session = Depends(get_db),
    user: Configuracion = Depends(get_current_user)
):
    current_user = db.query(Configuracion).filter(
        func.lower(Configuracion.nombre) == user.nombre.lower()
    ).first()

    if not current_user or not current_user.apikey:
        raise HTTPException(status_code=401, detail="No tiene una api key configurada")
   
    ai_generator = AIGenerator(provider="gemini", api_key=current_user.apikey)

    try:
        identidad_data = ai_generator.generar_identidad(objetivo)

        identidad_validada = IdentidadCreate(**identidad_data)

        nueva_identidad = Identidad(**identidad_validada.dict())
        db.add(nueva_identidad)
        db.commit()
        db.refresh(nueva_identidad)

        return nueva_identidad

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
