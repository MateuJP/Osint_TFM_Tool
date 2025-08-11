from sqlalchemy import create_engine,text
from sqlalchemy.orm import sessionmaker
from config import settings

engine = create_engine(settings.database_url,pool_pre_ping=True,future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
def ping_db():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
        connection.commit()