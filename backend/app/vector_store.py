from qdrant_client import QdrantClient
from qdrant_client.models import Distance, MatchValue, VectorParams, PointStruct, Filter, FieldCondition
from uuid import uuid4
from app.schemas import Chunk, RetrievedChunk
from app.embeddings import create_embedding


from app.config import (
    QDRANT_HOST,
    QDRANT_PORT,
    COLLECTION_NAME,
    EMBEDDING_DIMENSION,
)

def get_client():
    """
    Return a Qdrant client.
    """

    return QdrantClient(
        host=QDRANT_HOST,
        port=QDRANT_PORT,
    )

def create_collection():
    """
    Create the vector collection if it doesn't exist.
    """

    client = get_client()

    collections = client.get_collections().collections

    collection_names = [collection.name for collection in collections]

    if COLLECTION_NAME in collection_names:
        return

    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=EMBEDDING_DIMENSION,
            distance=Distance.COSINE,
        ),
    )

    print(f"Collection '{COLLECTION_NAME}' created successfully.")



def index_chunks(chunks: list[Chunk]):
    """
    Store embedded chunks in Qdrant.
    """

    client = get_client()

    points = []

    for chunk in chunks:

        if chunk.embedding is None:
            continue

        points.append(
            PointStruct(
                id=str(uuid4()),
                vector=chunk.embedding,
                payload={
                    "document_id": chunk.document_id,
                    "chunk_id": chunk.chunk_id,
                    "page": chunk.page,
                    "text": chunk.text,
                },
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    print(f"Indexed {len(points)} chunks.")


def search_chunks(
    document_id: str,
    query: str,
    limit: int = 5,
) -> list[RetrievedChunk]:
    """
    Search the most relevant chunks from a specific document.
    """

    client = get_client()

    query_embedding = create_embedding(query)

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="document_id",
                    match=MatchValue(value=document_id),
                )
            ]
        ),
        limit=limit,
    )

    retrieved_chunks = []

    for point in results.points:

        payload = point.payload

        if payload is None:
            continue

        retrieved_chunks.append(
            RetrievedChunk(
                document_id=payload["document_id"],
                chunk_id=payload["chunk_id"],
                page=payload["page"],
                text=payload["text"],
                score=point.score,
            )
        )

    return retrieved_chunks