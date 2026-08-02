from fastapi import FastAPI
from app.routes import router

app = FastAPI(
    title="AI PDF Assistant"
)

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI PDF Assistant 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "Backend is running!"
    }