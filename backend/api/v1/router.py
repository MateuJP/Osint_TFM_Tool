from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer
from . import genero
from . import aficiones
from . import identidad
from . import configuracion


api = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")

api.include_router(genero.router)
api.include_router(aficiones.router)
api.include_router(identidad.router)
api.include_router(configuracion.router)