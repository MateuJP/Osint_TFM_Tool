from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class MuestraGraficaBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=255)
    url: str = Field(..., min_length=1)
    formato: str = Field(..., min_length=1, max_length=50)

class MuestraGraficaCreate(MuestraGraficaBase):
    id_accion: int

class MuestraGraficaUpdate(MuestraGraficaBase):
    id_accion: Optional[int]  # Hacer opcional para permitir no cambiar la acción

class MuestraGraficaOut(MuestraGraficaBase):
    id_muestra: int
    id_accion: int

    model_config = ConfigDict(from_attributes=True)  # reemplaza orm_mode=True