from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_FOLDER = BASE_DIR / "uploads"
UPLOAD_FOLDER.mkdir(exist_ok=True)

DATA_FOLDER = BASE_DIR / "data"
DATA_FOLDER.mkdir(exist_ok=True)

DOCUMENTS_FILE = DATA_FOLDER / "documents.json"

if not DOCUMENTS_FILE.exists():
    DOCUMENTS_FILE.write_text("[]", encoding="utf-8")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

MAX_SUMMARY_CHARACTERS = 10000

CHUNK_SIZE = 500
CHUNK_OVERLAP = 100

CACHE_FOLDER = BASE_DIR / "cache"
CACHE_FOLDER.mkdir(exist_ok=True)

# Qdrant Configuration
QDRANT_HOST = "localhost"
QDRANT_PORT = 6333

# Vector Database
COLLECTION_NAME = "documents"

# Embedding Model
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"
EMBEDDING_DIMENSION = 384