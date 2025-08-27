from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import Cuenta
from schemas.cuenta import CuentaCreate, CuentaUpdate, CuentaOut

router = APIRouter(prefix="/cuentas", tags=["Cuentas"])

@router.post("/crear", response_model=CuentaOut, status_code=status.HTTP_201_CREATED)
def create_cuenta(cuenta: CuentaCreate, db: Session = Depends(get_db)):
   
    email_exist = db.query(Cuenta).filter(
        and_(
            func.lower(Cuenta.correo) == cuenta.correo.lower(),
            Cuenta.id_identidad != None,
            Cuenta.id_identidad != cuenta.id_identidad
        )
    ).first()
       
    if email_exist:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail="El correo ya está asociado a otra cuenta de otra identidad")

    new_cuenta = Cuenta(
        nombre=cuenta.nombre.strip(),
        correo=cuenta.correo.strip(),
        credenciales=cuenta.credenciales.strip(),
        url=cuenta.url.strip() if cuenta.url else None,
        id_identidad=cuenta.id_identidad,
        id_red_social=cuenta.id_red_social if cuenta.id_red_social else None
    )
    db.add(new_cuenta)
    db.commit()
    db.refresh(new_cuenta)
    return new_cuenta

@router.get("/list/{id_identidad}", response_model=list[CuentaOut])
def listar_cuentas_de_identidad(id_identidad: int, db: Session = Depends(get_db), q: str | None = Query(None, description="Buscar cuentas por nombre")):
    query = db.query(Cuenta).filter(Cuenta.id_identidad == id_identidad)
    if q:
        query = query.filter(func.lower(Cuenta.nombre).like(f"%{q.lower()}%"))
    return query.order_by(Cuenta.id_cuenta.asc()).all()

@router.put("/actualizar/{id_cuenta}", response_model=CuentaOut)
def update_cuenta(id_cuenta: int, cuenta: CuentaUpdate, db: Session = Depends(get_db)):
    existing_cuenta = db.query(Cuenta).filter(Cuenta.id_cuenta == id_cuenta).first()
    if not existing_cuenta:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cuenta no encontrada")
    
    existing_cuenta.nombre = cuenta.nombre.strip()
    existing_cuenta.correo = cuenta.correo.strip()
    existing_cuenta.credenciales = cuenta.credenciales.strip()
    
    db.commit()
    db.refresh(existing_cuenta)
    return existing_cuenta

@router.delete("/eliminar/{id_cuenta}", status_code=status.HTTP_204_NO_CONTENT) 
def delete_cuenta(id_cuenta: int, db: Session = Depends(get_db)):
    existing_cuenta = db.query(Cuenta).filter(Cuenta.id_cuenta == id_cuenta).first()
    if not existing_cuenta:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cuenta no encontrada")
    
    db.delete(existing_cuenta)
    db.commit()
    return {"detail": "Cuenta eliminada exitosamente"}
