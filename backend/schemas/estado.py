from pydantic import BaseModel, Field

class EstadoCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
class EstadoUpdate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
class EstadoOut(BaseModel):
    id_estado: int
    nombre: str = Field(min_length=2, max_length=100)