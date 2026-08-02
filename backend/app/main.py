from fastapi import FastAPI
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title="AI PDF Assistant"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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