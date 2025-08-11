from sqlalchemy import Column, Integer, String, UniqueConstraint
from db.base import Base

class OrientacionSexual(Base):
    __tablename__ = "orientacion_sexual"
    id_orientacion = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_orientacion_sexual')
    )