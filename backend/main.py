from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db.sesion import get_db
from db.sesion import ping_db
from config import settings
from api.v1.router import api as v1_router
app = FastAPI(title="OSINT App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")
