from fastapi import FastAPI
from app.routes import router
from app.auth_routes import router as auth_router

app = FastAPI(
    title = "Contact Form API",
    version="1.0.0"

)

app.include_router(router)
app.include_router(auth_router)