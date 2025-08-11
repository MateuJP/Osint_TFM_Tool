from sqlalchemy import Column,Integer,String,UniqueConstraint
from db.base import Base

class SituacionSentimental(Base):
    __tablename__ = "situacion_sentimental"
    id_situacion_sentimental = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_situacion_sentimental')
    )