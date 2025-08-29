from pydantic import BaseModel

class OrientacionPoliticaBase(BaseModel):
    nombre: str
class OrientacionPoliticaCreate(OrientacionPoliticaBase):
    pass
class OrientacionPoliticaUpdate(OrientacionPoliticaBase):
    pass
class OrientacionPoliticaOut(OrientacionPoliticaBase):
    id_orientacion_politica: int

    class Config:
        orm_mode = True