from pydantic import BaseModel

class PaisBase(BaseModel):
    nombre: str
    codigo: str

class PaisCreate(PaisBase):
    pass

class PaisUpdate(PaisBase):
    pass

class PaisOut(PaisBase):
    id_pais: int

    class Config:
        orm_mode = True