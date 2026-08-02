from app.vector_store import get_client, create_collection
from app.config import COLLECTION_NAME

client = get_client()

client.delete_collection(COLLECTION_NAME)

create_collection()

print("Qdrant reset successfully!")