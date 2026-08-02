import json

from app.config import DOCUMENTS_FILE


def load_documents() -> list:

    with open(DOCUMENTS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_documents(documents: list):

    with open(DOCUMENTS_FILE, "w", encoding="utf-8") as file:
        json.dump(documents, file, indent=4)


def add_document(document: dict):

    documents = load_documents()

    documents.append(document)

    save_documents(documents)


def get_document(document_id: str):

    documents = load_documents()

    for document in documents:
        if document["document_id"] == document_id:
            return document

    return None

def delete_document(document_id: str):

    documents = load_documents()

    documents = [
        document
        for document in documents
        if document["document_id"] != document_id
    ]

    save_documents(documents)