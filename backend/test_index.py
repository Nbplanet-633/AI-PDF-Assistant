from app.chunking import chunk_document
from app.embeddings import create_embeddings
from app.vector_store import create_collection, index_chunks

page_data = [
    {
        "page": 1,
        "text": (
            "Operating systems manage computer resources. "
            "CPU scheduling decides which process executes next. "
        ) * 50
    }
]

chunks = chunk_document(
    document_id="demo-document",
    page_data=page_data
)

embedded_chunks = create_embeddings(chunks)

create_collection()

index_chunks(embedded_chunks)

print("Done!")