from pydantic import BaseModel, Field, ConfigDict

class GeneroBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)

class GeneroCreate(GeneroBase):
    pass 

class GeneroUpdate(GeneroBase):
    pass  # igual que create, pero puedes poner opcional si quieres en actualizaciones

class GeneroOut(GeneroBase):
    id_genero: int
    nombre: str = Field(min_length=2, max_length=100)
    model_config = ConfigDict(from_attributes=True)  # reemplaza orm_mode=True
