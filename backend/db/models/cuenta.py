from sqlalchemy import Column, Integer, Text, ForeignKey,DateTime, String,UniqueConstraint
from sqlalchemy.orm import relationship
from db.base import Base

class Cuenta(Base):
    __tablename__ = "cuenta"
    
    id_cuenta = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    correo = Column(String(100), nullable=False, unique=True)
    credenciales = Column(String(255), nullable=False)
    fecha = Column(DateTime, nullable=False)
    url = Column(String(255), nullable=True)

    id_identidad = Column(Integer, ForeignKey('identidad.id_identidad'), nullable=False)
    identidad = relationship("Identidad", back_populates="cuentas")

    id_red_social = Column(Integer, ForeignKey('red_social.id_red_social'), nullable=False)
    red_social = relationship("RedSocial", back_populates="cuentas")

    acciones = relationship("Accion", back_populates="cuenta")
    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_cuenta'),
        UniqueConstraint('correo', name='uq_correo_cuenta'),
    )