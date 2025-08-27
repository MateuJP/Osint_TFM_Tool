from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer
from . import genero
from . import aficiones
from . import identidad
from . import configuracion
from . import cuenta
from . import red_social
from . import muestra_grafica
from . import accion

api = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")

api.include_router(genero.router)
api.include_router(aficiones.router)
api.include_router(identidad.router)
api.include_router(configuracion.router)
api.include_router(cuenta.router)
api.include_router(red_social.router)
api.include_router(muestra_grafica.router)
api.include_router(accion.router)