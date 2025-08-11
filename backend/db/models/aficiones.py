from sqlalchemy import String, Integer, Column, UniqueConstraint
from db.base import Base

class Aficion(Base):
    __tablename__ = "aficion"
    id_aficion = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_aficion'),
    )