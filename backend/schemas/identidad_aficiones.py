from pydantic import BaseModel, Field
from typing import Optional

class IdentidadAficionesBase(BaseModel):
    id_identidad: int
    id_aficion: int

class IdentidadAficionesCreate(IdentidadAficionesBase):
    pass

class IdentidadAficionesUpdate(IdentidadAficionesBase):
    pass
class IdentidadAficionesOut(IdentidadAficionesBase):
    nombre_identidad: Optional[str] = None
    aficion_nombre : Optional[str] = None