from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = Field(..., env='DATABASE_URL')
    cors_origin: str = Field('*', env='CORS_ORIGIN')

    class Config:
        extra = "ignore"
settings = Settings()