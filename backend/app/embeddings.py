from sentence_transformers import SentenceTransformer
from app.schemas import Chunk
from app.config import EMBEDDING_MODEL

model = SentenceTransformer(EMBEDDING_MODEL)


def create_embedding(text: str):
    """
    Generate an embedding for a single text.
    """

    embedding = model.encode(text)

    return embedding.tolist()


def create_embeddings(chunks: list[Chunk]) -> list[Chunk]:

    embedded_chunks = []

    for chunk in chunks:

        chunk.embedding = create_embedding(chunk.text)

        embedded_chunks.append(chunk)

    return embedded_chunks