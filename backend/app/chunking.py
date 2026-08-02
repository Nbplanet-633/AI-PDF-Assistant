from app.config import CHUNK_SIZE, CHUNK_OVERLAP
from app.schemas import Chunk

def join_pages(page_data):
    """
    Join all pages into a single string.
    Used for document summarization.
    """

    return "\n".join(page["text"] for page in page_data)


def chunk_document(document_id: str, page_data) -> list[Chunk]:
    """
    Split each page into overlapping chunks.
    Used for RAG.
    """

    chunks = []

    chunk_id = 1

    for page in page_data:

        words = page["text"].split()

        start = 0

        while start < len(words):

            end = start + CHUNK_SIZE

            chunk_text = " ".join(words[start:end])

            chunks.append(
                Chunk(
                    document_id=document_id,
                    chunk_id=chunk_id,
                    page=page["page"],
                    text=chunk_text,
                )
            )
            chunk_id += 1

            start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks


