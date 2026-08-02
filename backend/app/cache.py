import json

from app.config import CACHE_FOLDER


def get_cache_path(document_id: str):
    return CACHE_FOLDER / f"{document_id}.json"


def cache_exists(document_id: str):

    return get_cache_path(document_id).exists()


def save_cache(document_id: str, page_data):

    cache_path = get_cache_path(document_id)

    with open(cache_path, "w", encoding="utf-8") as file:
        json.dump(page_data, file, indent=4)


def load_cache(document_id: str):

    cache_path = get_cache_path(document_id)

    with open(cache_path, "r", encoding="utf-8") as file:
        return json.load(file)