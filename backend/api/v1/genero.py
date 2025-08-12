from fastapi import APIRouter,Depends, HTTPException,Query,status
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.sesion import get_db
from db.models import Genero
from schemas.genero import GeneroCreate, GeneroUpdate, GeneroOut

router = APIRouter(prefix="/generos", tags=["Generos"])

@router.post("/crear", response_model=GeneroOut, status_code=status.HTTP_201_CREATED)
def create_genero(genero: GeneroCreate, db: Session = Depends(get_db)):
    exist = db.query(Genero).filter(func.lower(Genero.nombre)==genero.nombre.lower()).first()
    if exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El género ya existe")
    
    new_genero = Genero(nombre=genero.nombre.strip())
    db.add(new_genero)
    db.commit()
    db.refresh(new_genero)
    return new_genero
@router.get("/listar", response_model=list[GeneroOut])
def listar_generos(db: Session = Depends(get_db), q:str | None = Query(None,descroption="Buscar géneros por nombre")):
    query = db.query(Genero)
    if q:
        query = db.query(Genero).filter(func.lower(Genero.nombre).like(f"%{q.lower()}%"))
    return query.order_by(Genero.nombre.asc()).all()

@router.get("/{id_genero}", response_model=GeneroOut)
def get_genero(id_genero_int,db: Session = Depends(get_db)):
    genero = db.query(Genero).filter(Genero.id_genero == id_genero_int).first()
    if not genero:
        raise HTTPException(status_code =status.HTTP_404_NOT_FOUND, detail="Género no encontrado")
    return genero
