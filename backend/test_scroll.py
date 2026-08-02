from app.vector_store import get_client
from app.config import COLLECTION_NAME

client = get_client()

points, _ = client.scroll(
    collection_name=COLLECTION_NAME,
    limit=10,
    with_payload=True,
)

for point in points:
    print(point.payload)
    