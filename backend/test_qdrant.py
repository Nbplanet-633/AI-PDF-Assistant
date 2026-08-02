from app.vector_store import get_client, create_collection

create_collection()

client = get_client()

collections = client.get_collections()

print(collections)