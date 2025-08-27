from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class ConfiguracionBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)

class ConfiguracionLogin(BaseModel):
    username: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8, max_length=255)

class ConfiguracionCreate(ConfiguracionBase):
    password: str = Field(min_length=8, max_length=255)
    apikey: Optional[str] = None
    modo: Optional[str] = None

class ConfiguracionUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    password: Optional[str] = Field(None, min_length=8, max_length=255)
    apikey: Optional[str] = None
    modo: Optional[str] = None

class ConfiguracionOut(ConfiguracionBase):
    apikey: Optional[str] = None
    modo: Optional[str] = None
    model_config = ConfigDict(from_attributes=True) 
