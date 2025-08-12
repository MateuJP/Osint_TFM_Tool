from fastapi import APIRouter
from . import genero
from . import aficiones

api = APIRouter()

api.include_router(genero.router)
api.include_router(aficiones.router)