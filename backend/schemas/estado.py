from pydantic import BaseModel, Field, ConfigDicts

class EstadoCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100, required=True)
class EstadoUpdate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100, required=True)
class EstadoOut(BaseModel):
    id_estado: int
    nombre: str = Field(min_length=2, max_length=100)