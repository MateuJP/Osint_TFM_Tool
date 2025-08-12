from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint
from db.base import Base
from sqlalchemy.orm import relationship
class Nacionalidad(Base):
    __tablename__ = "nacionalidad"
    id_nacionalidad = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    codigo = Column(String(100), nullable=False)

    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_nacionalidad'),
        UniqueConstraint('codigo', name='uq_codigo_nacionalidad'),
    )
    identidades = relationship("Identidad", back_populates="nacionalidad")