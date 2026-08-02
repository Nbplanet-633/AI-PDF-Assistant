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