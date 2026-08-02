from pydantic import BaseModel
from uuid import UUID

class UploadResponse(BaseModel):
    success: bool
    document_id: UUID
    filename: str


class SummaryResponse(BaseModel):
    overview: str
    key_points: list[str]
    keywords: list[str]


class Chunk(BaseModel):
    document_id: str
    chunk_id: int
    page: int
    text: str
    embedding: list[float] | None = None

class RetrievedChunk(BaseModel):
    document_id: str
    chunk_id: int
    page: int
    text: str
    score: float


class Source(BaseModel):
    page: int
    chunk_id: int
    preview: str


class QuestionResponse(BaseModel):
    answer: str
    sources: list[Source]

class QuestionRequest(BaseModel):
    question: str