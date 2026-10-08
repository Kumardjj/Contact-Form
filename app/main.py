from fastapi import FastAPI

from app.routes import router
from app.auth_routes import router as auth_router
from app.submission_routes import router as submission_router
from app.exception import (
    EmailAlreadyExistsError,
    PasswordMismatchError,
    DatabaseError,
    email_exists_handler,
    password_mismatch_handler,
    database_error_handler,
    InvalidCredentialsError,
    invalid_credentials_handler
)

from app.form_routes import router as form_router
from app.dashboard_routes import router as dashboard_router
app = FastAPI(
    title="Contact Form API",
    version="1.0.0"
)


app.include_router(router)
app.include_router(auth_router)
app.include_router(form_router)
app.include_router(submission_router)
app.include_router(dashboard_router)

app.add_exception_handler(
    EmailAlreadyExistsError,
    email_exists_handler
)

app.add_exception_handler(
    PasswordMismatchError,
    password_mismatch_handler
)

app.add_exception_handler(
    DatabaseError,
    database_error_handler
)

app.add_exception_handler(
    InvalidCredentialsError,
    invalid_credentials_handler
)