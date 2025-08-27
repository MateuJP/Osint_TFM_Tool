from pydantic import BaseModel, Field
from typing import Optional

class RedSocialBase(BaseModel):
    nombre : str = Field(min_length=1, max_length=100)

class RedSocialCreate(RedSocialBase):
    logo: Optional[str] = Field(None, max_length=255)

class RedSocialUpdate(RedSocialBase):
    logo: str | None = Field(max_length=255)

class RedSocialOut(RedSocialBase):
    id_red_social: int
    logo: str | None = None

    class Config:
        from_attributes = True