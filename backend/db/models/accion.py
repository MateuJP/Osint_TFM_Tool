from sqlalchemy import Column, Integer, Text, ForeignKey,DateTime, String,UniqueConstraint
from sqlalchemy.orm import relationship
from db.base import Base

class Accion(Base):
    __tablename__ = "accion"

    id_accion = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=True)
    fecha = Column(DateTime, nullable=False)
    notas = Column(Text, nullable=True)
    observaciones = Column(Text, nullable=True)
    url= Column(String(255), nullable=True)
    resumen = Column(Text, nullable=True)

    id_identidad = Column(Integer, ForeignKey('identidad.id_identidad'), nullable=False)
    identidad = relationship("Identidad", back_populates="acciones")

    id_cuenta = Column(Integer, ForeignKey('cuenta.id_cuenta'), nullable=False)
    cuenta = relationship("Cuenta", back_populates="acciones")

    muestras_graficas = relationship("MuestraGrafica", back_populates="acciones")
    __table_args__ = (
        UniqueConstraint('fecha', 'id_identidad', 'id_cuenta', name='uq_fecha_identidad_cuenta_accion'),
    )