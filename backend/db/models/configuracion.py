from sqlalchemy import Column, String
from db.base import Base
# from app.db.base import Base  # <- si tu main está en /app/app

class Configuracion(Base):
    __tablename__ = "configuracion"

    nombre = Column(String(100), primary_key=True)  # uso nombre como PK
    contrasena = Column(String(255), nullable=False)
    apikey = Column(String(255))
    modo = Column(String(50))