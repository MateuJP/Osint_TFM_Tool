from fastapi import APIRouter, Depends, HTTPException,Query,status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import MuestraGrafica, Accion
from schemas.muestras_graficas import MuestraGraficaCreate, MuestraGraficaUpdate, MuestraGraficaOut
from auth import get_current_user
router = APIRouter(prefix="/muestras_graficas", tags=["Muestras Gráficas"])

@router.post("/crear", response_model = MuestraGraficaOut, status_code=status.HTTP_201_CREATED)
def create_muestra_grafica(muestra: MuestraGraficaCreate, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    # No hace falta verificar la existencia de la muestra gráfica, ya que se pueden subir varias iguales asicoadas a diferentes acciones
    new_muestra = MuestraGrafica(
        titulo=muestra.titulo.strip(),
        url=muestra.url.strip(),
        formato=muestra.formato.strip(),
        id_accion=muestra.id_accion
    )
    db.add(new_muestra)
    db.commit()
    db.refresh(new_muestra)
    return new_muestra

@router.get("/listar/{id_accion}", response_model=list[MuestraGraficaOut])
def  listar_muestras_de_accion(id_accion:int, db: Session = Depends(get_db), _user =Depends(get_current_user),q: str | None = Query(None, description="Buscar muestras gráficas por título")):
    query = db.query(MuestraGrafica).filter(MuestraGrafica.id_accion == id_accion)
    if q:
        query = query.filter(func.lower(MuestraGrafica.titulo).like(f"%{q.lower()}%"))
    return query.order_by(MuestraGrafica.id_muestra.asc()).all()

@router.put("/actualizar/{id_muestra}", response_model=MuestraGraficaOut)
def update_muestra_grafica(id_muestra: int, muestra: MuestraGraficaUpdate, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    existing_muestra = db.query(MuestraGrafica).filter(MuestraGrafica.id_muestra == id_muestra).first()
    if not existing_muestra:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Muestra gráfica no encontrada")
    
    existing_muestra.titulo = muestra.titulo.strip()
    existing_muestra.url = muestra.url.strip()
    existing_muestra.formato = muestra.formato.strip()
    
    if muestra.id_accion is not None:
        accion = db.query(Accion).filter(Accion.id_accion == muestra.id_accion).first()
        if not accion:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La acción asociada no existe")
        existing_muestra.id_accion = muestra.id_accion
    
    db.commit()
    db.refresh(existing_muestra)
    return existing_muestra
@router.delete("/eliminar/{id_muestra}", status_code=status.HTTP_204_NO_CONTENT) 
def delete_muestra_grafica(id_muestra: int, db: Session = Depends(get_db), _user = Depends(get_current_user)):
    existing_muestra = db.query(MuestraGrafica).filter(MuestraGrafica.id_muestra == id_muestra).first()
    if not existing_muestra:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Muestra gráfica no encontrada")
    
    db.delete(existing_muestra)
    db.commit()
    return

