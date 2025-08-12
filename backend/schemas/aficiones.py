from pydantic import BaseModel, Field, ConfigDict

class AficionBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)

class AficionCreate(AficionBase):
    pass 

class AficionOut(AficionBase):
    id_aficion: int
    nombre: str = Field(min_length=2, max_length=100)
    model_config = ConfigDict(from_attributes=True)