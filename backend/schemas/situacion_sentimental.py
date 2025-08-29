from pydantic import BaseModel

class SituacionSentimentalBase(BaseModel):
    nombre: str

class SituacionSentimentalCreate(SituacionSentimentalBase):
    pass

class SituacionSentimentalUpdate(SituacionSentimentalBase):
    pass

class SituacionSentimentalOut(SituacionSentimentalBase):
    id_situacion_sentimental: int

    class Config:
        orm_mode = True