from sqlalchemy import Column, Integer, Text, ForeignKey,UniqueConstraint
from sqlalchemy.orm import relationship
from db.base import Base

class IdentidadAficiones(Base):
    __tablename__ = "identidad_aficiones"

    # Equivalente a: PRIMARY KEY (id_identidad, id_aficion)
    id_identidad = Column(
        Integer,
        ForeignKey("identidad.id_identidad", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    id_aficion = Column(
        Integer,
        ForeignKey("aficion.id_aficion", ondelete="CASCADE"),
        primary_key=True,
    )

    observaciones = Column(Text)

    # Relaciones a los extremos
    identidad = relationship("Identidad", back_populates="identidades_aficiones", passive_deletes=True)
    aficion   = relationship("Aficiones",   back_populates="identidades_aficiones", passive_deletes=True)
