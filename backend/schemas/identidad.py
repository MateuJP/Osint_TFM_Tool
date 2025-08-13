# schemas/identidad.py
from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, List


class IdentidadBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    apellido: str = Field(..., min_length=2, max_length=100)
    edad: Optional[int] = None
    fecha_nacimiento: Optional[date] = None
    profesion: Optional[str] = Field(None, max_length=100)
    nivel_educativo: Optional[str] = Field(None, max_length=100)
    nombre_padre: Optional[str] = Field(None, max_length=100)
    nombre_madre: Optional[str] = Field(None, max_length=100)
    numero_hermanos: Optional[int] = None
    bibliografia: Optional[str] = None
    observaciones: Optional[str] = None
    avatar: Optional[str] = None
    id_estado: Optional[int] = None
    id_genero: Optional[int] = None
    id_situacion_sentimental: Optional[int] = None
    id_orientacion_sexual: Optional[int] = None
    id_orientacion_politica: Optional[int] = None
    id_nacionalidad: Optional[int] = None
    id_pais_residencia: Optional[int] = None

class IdentidadCreate(IdentidadBase):
    pass


class IdentidadUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    apellido: Optional[str] = Field(None, min_length=2, max_length=100)
    edad: Optional[int] = None
    fecha_nacimiento: Optional[date] = None
    profesion: Optional[str] = Field(None, max_length=100)
    nivel_educativo: Optional[str] = Field(None, max_length=100)
    nombre_padre: Optional[str] = Field(None, max_length=100)
    nombre_madre: Optional[str] = Field(None, max_length=100)
    numero_hermanos: Optional[int] = None
    bibliografia: Optional[str] = None
    observaciones: Optional[str] = None
    avatar: Optional[str] = None

    id_estado: Optional[int] = None
    id_genero: Optional[int] = None
    id_situacion_sentimental: Optional[int] = None
    id_orientacion_sexual: Optional[int] = None
    id_orientacion_politica: Optional[int] = None
    id_nacionalidad: Optional[int] = None
    id_pais_residencia: Optional[int] = None


class IdentidadOut(IdentidadBase):
    id_identidad: int

    estado_nombre: Optional[str] = None
    genero_nombre: Optional[str] = None
    situacion_sentimental_nombre: Optional[str] = None
    orientacion_sexual_nombre: Optional[str] = None
    orientacion_politica_nombre: Optional[str] = None
    nacionalidad_nombre: Optional[str] = None
    pais_residencia_nombre: Optional[str] = None

    class Config:
        from_attributes = True  
