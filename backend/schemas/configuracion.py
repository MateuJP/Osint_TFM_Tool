from pydantic import BaseModel, Field
from typing import Optional

class ConfiguracionBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)

class ConfiguracionCreate(ConfiguracionBase):
    password: str = Field(min_length=8, max_length=255)
    apikey: str | None = None
    modo: str | None = None

class ConfiguracionUpdate(ConfiguracionBase):
    password: Optional[str] = Field(None, min_length=8, max_length=255)
    apikey: Optional[str] = None
    modo: Optional[str] = None

class ConfiguracionOut(ConfiguracionBase):
    password: str
    apikey: Optional[str] = None
    modo: Optional[str] = None
    
    class Cofig:
        from_attributes = True 

