from sqlalchemy import String, Integer, Column, UniqueConstraint
from sqlalchemy.orm import relationship
from db.base import Base

class Aficiones(Base):
    __tablename__ = "aficion"
    id_aficion = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    identidades_aficiones = relationship("IdentidadAficiones", back_populates="aficion", passive_deletes=True)
    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_aficion'),
    )