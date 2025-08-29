from pydantic import BaseModel, Field

class EstadoBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)

class EstadoCreate(EstadoBase):
    pass
class EstadoUpdate(EstadoBase):
    pass
class EstadoOut(EstadoBase):
    id_estado: int
    nombre: str = Field(min_length=2, max_length=100)