from pydantic import BaseModel, Field
from typing import Optional

class CuentaBase(BaseModel):
    nombre : str = Field(min_length=1, max_length=100)
    correo : str = Field(min_length=1, max_length=100)

class CuentaCreate(CuentaBase):
    credenciales: Optional[str] = Field(None, min_length=1, max_length=255)
    url: Optional[str] = Field(max_length=255)
    id_identidad: int
    id_red_social: Optional[int] = None

class CuentaUpdate(CuentaBase):
    credenciales: str = Field(min_length=1, max_length=255)

class CuentaOut(CuentaBase):
    id_cuenta: int
    fecha:str | None = None 
    url: str | None = None
    id_red_social: int | None = None
    id_identidad: int
    red_social_nombre : str | None = None
    credenciales : str
    class Config:
        from_attributes = True  
