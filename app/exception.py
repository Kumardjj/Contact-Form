from fastapi import Request
from fastapi.responses import JSONResponse

# Custom Exceptions
class EmailAlreadyExistsError(Exception):
    pass

# Exception Handlers
class PasswordMismatchError(Exception):
    pass


class DatabaseError(Exception):
    pass

class InvalidCredentialsError(Exception):
    pass



async def email_exists_handler(
    request: Request,
    exc: EmailAlreadyExistsError
):
    return JSONResponse(
        status_code=409,
        content={"detail": "Email already registered"}
    )


async def password_mismatch_handler(
    request: Request,
    exc: PasswordMismatchError
):
    return JSONResponse(
        status_code=400,
        content={"detail": "Passwords do not match"}
    )


async def database_error_handler(
    request: Request,
    exc: DatabaseError
):
    return JSONResponse(
        status_code=503,
        content={"detail": "Database service unavailable"}
    )

async def invalid_credentials_handler(
    request: Request,
    exc: InvalidCredentialsError
):
    return JSONResponse(
        status_code=401,
        content={"detail": "Invalid email or password"}
    )