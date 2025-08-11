from sqlalchemy import Column, Integer, String, Date, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlachemy.sql import functions as func
from db.base import Base

class Identidad(Base):
    __tablename__ = "identidad"
    
    id_identidad = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    fecha_creacion = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())
    edad = Column(Integer, nullable=True)
    fecha_nacimiento = Column(Date, nullable=True)
    profesion= Column(String(100), nullable=True)
    nivel_educativo = Column(String(100), nullable=True)
    nombre_padre= Column(String(100), nullable=True)
    nombre_madre = Column(String(100), nullable=True)
    numero_hermanos=Column(Integer, nullable=True)
    bibliogradia = Column(Text, nullable=True)
    observaciones = Column(Text, nullable=True)
    avatar = Column(String(255), nullable=True)
    # Relaciones con otras tablas
    id_estado = Column(Integer, ForeignKey('estado.id_estado'), nullable=False)
    estado = relationship("Estado", back_populates="identidades")
    
    id_genero = Column(Integer, ForeignKey('genero.id_genero'), nullable=False)
    genero = relationship("Genero", back_populates="identidades")

    id_situacion_sentimental = Column(Integer, ForeignKey('situacion_sentimental.id_situacion_sentimental'), nullable=False)
    situacion_sentimental = relationship("SituacionSentimental", back_populates="identidades")

    id_orientacion_sexual = Column(Integer, ForeignKey('orientacion_sexual.id_orientacion'), nullable=False)
    orientacion_sexual = relationship("OrientacionSexual", back_populates="identidades")

    id_orientacion_politica = Column(Integer, ForeignKey('orientacion_politica.id_orientacion'), nullable=False)
    orientacion_politica = relationship("OrientacionPolitica", back_populates="identidades")
    id_nacionalidad = Column(Integer, ForeignKey('nacionalidad.id_nacionalidad'), nullable=False)
    nacionalidad = relationship("Nacionalidad", back_populates="identidades")

    id_pais_residencia = Column(Integer, ForeignKey('pais.id_pais'), nullable=False)
    pais= relationship("Pais", back_populates="identidades")
   
    __table_args__ = (
        Index('idx_nombre_apellido', 'nombre', 'apellido'),
    )