from pydantic import BaseModel

class OrientacionSexualBase(BaseModel):
    nombre: str

class OrientacionSexualCreate(OrientacionSexualBase):
    pass
class OrientacionSexualUpdate(OrientacionSexualBase):
    pass
class OrientacionSexualOut(OrientacionSexualBase):
    id_orientacion: int

    class Config:
        orm_mode = True