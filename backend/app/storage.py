import json
from pathlib import Path 

from app.config import UPLOAD_FOLDER, DOCUMENTS_FILE


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

    # Find the document first
    document = next(
        (
            doc
            for doc in documents
            if doc["document_id"] == document_id
        ),
        None,
    )

    if document is None:
        return

    # Delete the uploaded PDF
    pdf_path = Path(UPLOAD_FOLDER) / document["stored_filename"]

    if pdf_path.exists():
        pdf_path.unlink()

    # Remove metadata
    documents = [
        doc
        for doc in documents
        if doc["document_id"] != document_id
    ]

    save_documents(documents)