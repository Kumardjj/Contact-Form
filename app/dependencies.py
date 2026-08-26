import os 
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=[ALGORITHM]
        )
        username = payload.get("sub")

        if username is None:
            raise HTTPException(
                status_code = 401,
                detail = "Invalid token"
            )
        
        return username
    
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail = "invalid or expired token"
        )

