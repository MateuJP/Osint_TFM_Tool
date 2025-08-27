from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.sesion import get_db
from db.models import RedSocial
from schemas.red_social import RedSocialCreate, RedSocialUpdate, RedSocialOut
from auth import get_current_user
router = APIRouter(prefix="/redes-sociales", tags=["Redes Sociales"])

@router.post("/crear", response_model=RedSocialOut, status_code=status.HTTP_201_CREATED)

def create_red_social(red_social: RedSocialCreate, db: Session = Depends(get_db),_user = Depends(get_current_user)):
    exist = db.query(RedSocial).filter(func.lower(RedSocial.nombre) == red_social.nombre.lower()).first()
    if exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La red social ya existe")
    
    new_red_social = RedSocial(
        nombre=red_social.nombre.strip(),
        logo=red_social.logo.strip() if red_social.logo else None
    )
    db.add(new_red_social)
    db.commit()
    db.refresh(new_red_social)
    return new_red_social

@router.get("/lista", response_model=list[RedSocialOut])
def get_redes_sociales(db: Session = Depends(get_db), _user = Depends(get_current_user)):
    redes_sociales = db.query(RedSocial).all()
    return redes_sociales

@router.get("/{id_red_social}", response_model=RedSocialOut)
def get_red_social(id_red_social: int, db: Session = Depends(get_db),_user = Depends(get_current_user)):
    red_social = db.query(RedSocial).filter(RedSocial.id_red_social == id_red_social).first()
    if not red_social:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Red social no encontrada")
    return red_social

@router.put("/actualizar/{id_red_social}", response_model=RedSocialOut)
def update_red_social(id_red_social: int, red_social: RedSocialUpdate, db: Session = Depends(get_db),_user = Depends(get_current_user)):
    existing_red_social = db.query(RedSocial).filter(RedSocial.id_red_social == id_red_social).first()
    if not existing_red_social:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Red social no encontrada")
    
    existing_red_social.nombre = red_social.nombre.strip()
    existing_red_social.logo = red_social.logo.strip() if red_social.logo else None
    
    db.commit()
    db.refresh(existing_red_social)
    return existing_red_social

@router.delete("/eliminar/{id_red_social}", status_code=status.HTTP_204_NO_CONTENT)
def delete_red_social(id_red_social: int, db: Session = Depends(get_db),_user = Depends(get_current_user)):
    existing_red_social = db.query(RedSocial).filter(RedSocial.id_red_social == id_red_social).first()
    if not existing_red_social:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Red social no encontrada")
    
    db.delete(existing_red_social)
    db.commit()
    return {"detail": "Red social eliminada exitosamente"}
