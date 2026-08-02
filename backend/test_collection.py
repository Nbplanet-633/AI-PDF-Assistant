from app.vector_store import get_client
from app.config import COLLECTION_NAME

client = get_client()

collection = client.get_collection(COLLECTION_NAME)

print("Collection:", COLLECTION_NAME)
print("Vectors stored:", collection.points_count)