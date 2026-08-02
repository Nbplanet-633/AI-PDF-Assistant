from app.chunking import chunk_document
from app.embeddings import create_embeddings

page_data = [
    {
        "page": 1,
        "text": "Operating systems manage computer resources. "
                "CPU scheduling decides which process executes next. "
                * 40
    }
]

chunks = chunk_document("demo-document", page_data)

embedded_chunks = create_embeddings(chunks)

print("Total chunks:", len(embedded_chunks))
print()

print("First chunk:")
print(embedded_chunks[0].text[:100])

print()

print("Embedding length:")
if embedded_chunks[0].embedding is not None:
    print("Embedding length:", len(embedded_chunks[0].embedding))