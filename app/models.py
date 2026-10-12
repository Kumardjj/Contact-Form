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
<<<<<<< HEAD
 
=======
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str = Field(min_lenghth= 20, max_length = 200)
    new_password : str = Field( min_length = 8, max_length = 200)
    confirm_password : str = Field(min_length = 8, max_length = 200)



>>>>>>> d8ba0ab1d9841818ea79ef1c08d4d04c13a185e8
class FormCreate(BaseModel):
    form_name: str = Field(min_length=2, max_length=100)
    notification_email : EmailStr

class SubmissionCreate(BaseModel):
    data: dict