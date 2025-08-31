from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import IdentidadAficiones
from schemas.identidad_aficiones import IdentidadAficionesCreate,IdentidadAficionesOut
from auth import get_current_user
router = APIRouter(prefix = "/identidad_aficiones",tags=["Identidad_Aficiones"])

@router.post('/crear',response_model = IdentidadAficionesOut, status_code = status.HTTP_201_CREATED)

def add_aficion(identidad_aficion: IdentidadAficionesCreate,db: Session = Depends(get_db), _user= Depends(get_current_user)):
    exist = db.query(IdentidadAficiones).filter(
        IdentidadAficiones.id_aficion == identidad_aficion.id_aficion,
        IdentidadAficiones.id_identidad == identidad_aficion.id_identidad
    ).first()

    if exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Esta afición ya ha sido vunculada a esta identidad")
    new_record = IdentidadAficiones(
        id_aficion = identidad_aficion.id_aficion,
        id_identidad = identidad_aficion.id_identidad
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@router.get('/listar/{id_identidad}', response_model=list[IdentidadAficionesOut])
def list_aficionesByIdentidad(
    id_identidad: int,
    db: Session = Depends(get_db),
    _user = Depends(get_current_user)
):
    records = (
        db.query(IdentidadAficiones)
        .options(
            joinedload(IdentidadAficiones.aficion),
            joinedload(IdentidadAficiones.identidad)
        )
        .filter(IdentidadAficiones.id_identidad == id_identidad)
        .all()
    )
    
    if not records:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Identidad no encontrada"
        )

    return [
        IdentidadAficionesOut(
            **i.__dict__,
            aficion_nombre=i.aficion.nombre,
            identidad_nombre=i.identidad.nombre
        )
        for i in records
    ]
@router.delete('/eliminar/{id_identidad}/{id_aficion}', status_code=status.HTTP_204_NO_CONTENT)
def remove_aficion(
    id_identidad: int,
    id_aficion: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user)
):
    record = db.query(IdentidadAficiones).filter_by(
        id_identidad=id_identidad,
        id_aficion=id_aficion
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Vínculo no encontrado")
    db.delete(record)
    db.commit()
    return

