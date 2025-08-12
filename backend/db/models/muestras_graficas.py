from sqlalchemy import Column, Integer, Text,String, ForeignKey,UniqueConstraint
from sqlalchemy.orm import relationship
from db.base import Base

class MuestraGrafica(Base):
    __tablename__ = "muestras_graficas"

    id_muestra = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    url = Column(Text, nullable=False)
    formato = Column(String(50), nullable=False)

    id_accion = Column(Integer, ForeignKey('accion.id_accion'), nullable=False)
    acciones= relationship("Accion", back_populates="muestras_graficas")

    __table_args__ = (
        UniqueConstraint('titulo', 'id_accion', name='uq_titulo_accion_muestra_grafica'),
    )
