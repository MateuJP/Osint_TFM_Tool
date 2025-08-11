from sqlalchemy import Column,Integer,String,UniqueConstraint
from db.base import Base

class RedSocial(Base):
    __tablename__ = "red_social"
    id_red_social = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False, unique=True)
    logo = Column(String, nullable=True)
    
    __table_args__ = (
        UniqueConstraint('nombre', name='uq_nombre_red_social'),
    )