from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import Identidad
from schemas.identidad import IdentidadCreate, IdentidadOut,IdentidadUpdate

router = APIRouter(prefix="/identidad", tags=["Identidad"])

@router.post("/crear", response_model=IdentidadOut, status_code=status.HTTP_201_CREATED)
def create_identidad(identidad: IdentidadCreate, db: Session = Depends(get_db)):
    exist = db.query(Identidad).filter(
    func.lower(Identidad.nombre) == identidad.nombre.lower(),
    func.lower(Identidad.apellido) == identidad.apellido.lower()
    ).first()

    if exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La identidad ya existe")
    
    new_identity = Identidad(
        nombre=identidad.nombre.strip(),
        apellido=identidad.apellido.strip(),
        edad = identidad.edad,
        fecha_nacimiento = identidad.fecha_nacimiento,
        profesion = identidad.profesion,
        nivel_educativo = identidad.nivel_educativo,
        nombre_padre = identidad.nombre_padre,
        nombre_madre = identidad.nombre_madre,
        numero_hermanos = identidad.numero_hermanos,
        bibliografia = identidad.bibliografia,
        observaciones = identidad.observaciones,
        avatar = identidad.avatar,
        id_estado = identidad.id_estado,
        id_genero = identidad.id_genero,
        id_situacion_sentimental = identidad.id_situacion_sentimental,
        id_orientacion_sexual = identidad.id_orientacion_sexual,
        id_orientacion_politica = identidad.id_orientacion_politica,
        id_nacionalidad = identidad.id_nacionalidad,
        id_pais_residencia = identidad.id_pais_residencia
    )
    db.add(new_identity)
    db.commit()
    db.refresh(new_identity)
    return new_identity

@router.get("/list", response_model=list[IdentidadOut])
def get_all_identities(db: Session = Depends(get_db)):
    identidades = db.query(Identidad).options(
        joinedload(Identidad.estado),
        joinedload(Identidad.genero),
        joinedload(Identidad.situacion_sentimental),
        joinedload(Identidad.orientacion_sexual),
        joinedload(Identidad.orientacion_politica),
        joinedload(Identidad.nacionalidad),
        joinedload(Identidad.pais)
    ).order_by(Identidad.id_identidad).all()
    if not identidades:
        # Opcional: puedes devolver simplemente [] en vez de error
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontraron identidades"
        )
    return [
        IdentidadOut(
            **i.__dict__,
            estado_nombre=i.estado.nombre if i.estado else None,
            genero_nombre=i.genero.nombre if i.genero else None,
            situacion_sentimental_nombre=i.situacion_sentimental.nombre if i.situacion_sentimental else None,
            orientacion_sexual_nombre=i.orientacion_sexual.nombre if i.orientacion_sexual else None,
            orientacion_politica_nombre=i.orientacion_politica.nombre if i.orientacion_politica else None,
            nacionalidad_nombre=i.nacionalidad.nombre if i.nacionalidad else None,
            pais_residencia_nombre=i.pais.nombre if i.pais else None,
        )
        for i in identidades
    ]


@router.get("/{id_identidad}",response_model=IdentidadOut)
def get_identidad(id_identidad: int, db: Session = Depends(get_db)):
    identidad = db.query(Identidad).options(
        joinedload(Identidad.estado),
        joinedload(Identidad.genero),
        joinedload(Identidad.situacion_sentimental),
        joinedload(Identidad.orientacion_sexual),
        joinedload(Identidad.orientacion_politica),
        joinedload(Identidad.nacionalidad),
        joinedload(Identidad.pais)
    ).filter(Identidad.id_identidad == id_identidad).first()
    if not identidad:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Identidad no encontrada")
    return IdentidadOut(
        **identidad.__dict__,
        estado_nombre=identidad.estado.nombre if identidad.estado else None,
        genero_nombre=identidad.genero.nombre if identidad.genero else None,
        situacion_sentimental_nombre=identidad.situacion_sentimental.nombre if identidad.situacion_sentimental else None,
        orientacion_sexual_nombre=identidad.orientacion_sexual.nombre if identidad.orientacion_sexual else None,
        orientacion_politica_nombre=identidad.orientacion_politica.nombre if identidad.orientacion_politica else None,
        nacionalidad_nombre=identidad.nacionalidad.nombre if identidad.nacionalidad else None,
        pais_residencia_nombre=identidad.pais.nombre if identidad.pais else None,
    )

@router.post("/actualizar/{id_identidad}", response_model=IdentidadOut)
def update_identidad(id_identidad: int, identidad:IdentidadUpdate, db : Session = Depends(get_db)):
    exisiting_identity = db.query(Identidad).options(
        joinedload(Identidad.estado),
        joinedload(Identidad.genero),
        joinedload(Identidad.situacion_sentimental),
        joinedload(Identidad.orientacion_sexual),
        joinedload(Identidad.orientacion_politica),
        joinedload(Identidad.nacionalidad),
        joinedload(Identidad.pais)
    ).filter(Identidad.id_identidad == id_identidad).first()
    if not exisiting_identity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Identidad no encontrada")
    for key, value in identidad.dict(exclude_unset=True).items():
        setattr(exisiting_identity, key, value)
    
    db.commit()
    db.refresh(exisiting_identity)
    return IdentidadOut(
        **exisiting_identity.__dict__,
        estado_nombre=exisiting_identity.estado.nombre if exisiting_identity.estado else None,
        genero_nombre=exisiting_identity.genero.nombre if exisiting_identity.genero else None,
        situacion_sentimental_nombre=exisiting_identity.situacion_sentimental.nombre if exisiting_identity.situacion_sentimental else None,
        orientacion_sexual_nombre=exisiting_identity.orientacion_sexual.nombre if exisiting_identity.orientacion_sexual else None,
        orientacion_politica_nombre=exisiting_identity.orientacion_politica.nombre if exisiting_identity.orientacion_politica else None,
        nacionalidad_nombre=exisiting_identity.nacionalidad.nombre if exisiting_identity.nacionalidad else None,
        pais_residencia_nombre=exisiting_identity.pais.nombre if exisiting_identity.pais else None,
    )

@router.delete("/eliminar/{id_identidad}", status_code=status.HTTP_204_NO_CONTENT)
def delete_identidad(id_identidad: int, db: Session = Depends(get_db)):
    identidad = db.query(Identidad).filter(Identidad.id_identidad == id_identidad).first()
    if not identidad:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Identidad no encontrada")
    db.delete(identidad)
    db.commit()
    return None