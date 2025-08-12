from sqlalchemy import Column,Integer,String,UniqueConstraint
from sqlalchemy.orm import relationship
from db.base import Base

class Genero(Base):
    __tablename__ = "genero"
    id_genero = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_genero'),
    )
    identidades = relationship("Identidad", back_populates="genero")