from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://https://contact-form-two-phi.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware

from app.rate_limiter import limiter



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


app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)

app.add_middleware(SlowAPIMiddleware)