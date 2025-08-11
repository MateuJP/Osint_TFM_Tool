from pydantic import BaseModel, Field,ConfigDicts

class GeneroBase(BaseModel):
    nombre: str = Field(min_legth=2,max_length=100)

class GeneroCreate(GeneroBase):
    pass
class GeneroUpdate(GeneroBase):
    nombre: str = Field(min_length=2, max_length=100, required=True)

class GeneroOut(GeneroBase)
    id_genero : int
    model_config = ConfigDicts(from_attributes=True)