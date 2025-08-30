from fastapi import APIRouter, Depends, HTTPException,Query,status,UploadFile,File,Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from db.sesion import get_db
from db.models import MuestraGrafica, Accion
from schemas.muestras_graficas import MuestraGraficaCreate, MuestraGraficaUpdate, MuestraGraficaOut
from auth import get_current_user
import os
router = APIRouter(prefix="/muestras_graficas", tags=["Muestras Gráficas"])
UPLOAD_DIR = "uploads/muestras_graficas"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/crear/externo", response_model = MuestraGraficaOut, status_code=status.HTTP_201_CREATED)
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

@router.post("/crear/upload", response_model=MuestraGraficaOut, status_code=201)
def subir_mustra(
    titulo: str = Form(...),
    formato: str = Form(...),
    id_accion: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _user = Depends(get_current_user),
    url: str = Form("")
):
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{id_accion}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    new_muestra = MuestraGrafica(
        titulo=titulo.strip(),
        url=f"/muestras_graficas/archivo/{filename}",
        formato=formato.strip(),
        id_accion=id_accion,
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

@router.get("/archivo/{filename}")
def ger_mustra_archivo(filename:str):
    filepath = os.path.join(UPLOAD_DIR,filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail= "Archivo No encontrado")
    return FileResponse(filepath)