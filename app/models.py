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

class ProfileUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=128)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length= 20, max_length = 200)
    new_password : str = Field( min_length = 8, max_length = 200)
    confirm_password : str = Field(min_length = 8, max_length = 200)

class FormCreate(BaseModel):
    form_name: str = Field(min_length=2, max_length=100)
    notification_email : EmailStr

class SubmissionCreate(BaseModel):
    data: dict