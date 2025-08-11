from sqlalchemy import Column,Integer,String,UniqueConstraint
from db.base import Base

class Estado(Base):
    __tablename__ = "estado"
    id_estado = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    
    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_estado')
    )