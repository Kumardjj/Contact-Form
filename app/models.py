from pydantic import BaseModel, EmailStr, Field
class ContactCreate(BaseModel):
    name : str = Field(min_length = 2, max_length=100)
    email : EmailStr
    subject : str = Field(min_length = 3)
    message : str = Field(min_length = 3)

class RegisterRequest(BaseModel):
    name : str = Field(min_length= 2 , max_length= 100)
    email : EmailStr
    password: str  = Field(min_length=8 , max_length= 128)
    cnf_password : str = Field(min_length= 8, max_length= 128)
    
class LoginRequest(BaseModel):
    email : str
    password: str 

class FormCreate(BaseModel):
    form_name: str = Field(min_length=2, max_length=100)

class SubmissionCreate(BaseModel):
    data: dict