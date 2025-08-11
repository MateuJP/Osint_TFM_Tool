from sqlalchemy import Column,Integer,String,UniqueConstraint
from db.base import Base

class OrientacionPolitica(Base):
    __tablename__ = "orientacion_politica"
    id_orientacion_politica = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_orientacion_politica')
    )