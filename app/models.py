from pydantic import BaseModel, EmailStr, Field

class ContactCreate(BaseModel):
    name : str = Field(min_length = 2, max_length=100)
    email : EmailStr
    subject : str = Field(min_length = 3)
    message : str = Field(min_length = 3)

