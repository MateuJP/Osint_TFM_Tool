from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import date

class AccionBase(BaseModel):
    notas: Optional[str] = None
    observaciones: Optional[str] = None
    url: Optional[str] = None
    resumen: Optional[str] = None
    fecha: date = Field(..., description="Fecha de la acción en formato AAAA-MM-DD")

class AccionCreate(AccionBase):
    id_identidad: int
    id_cuenta: int

class AccionUpdate(AccionBase):
    id_accion: int
    id_identidad: Optional[int] = None
    id_cuenta: Optional[int] = None    
    fecha: Optional[date] = None 
    notas: Optional[str] = None
    observaciones: Optional[str] = None
    url: Optional[str] = None
    resumen: Optional[str] = None

class AccionOut(AccionBase):
    id_accion: int
    id_identidad: int
    id_cuenta: int

    model_config = ConfigDict(from_attributes=True)  # reemplaza orm_mode=True