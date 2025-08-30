from pydantic import BaseModel

class NacionalidadBase(BaseModel):
    nombre: str
    codigo: str

class NacionalidadCreate(NacionalidadBase):
    pass
class NacionalidadUpdate(NacionalidadBase):
    pass
class NacionalidadOut (NacionalidadBase):
    id_nacionalidad:int
    class Config:
        orm_mode = True
