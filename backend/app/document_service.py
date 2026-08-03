import uuid
from pathlib import Path
from datetime import datetime

from fastapi import UploadFile, HTTPException

from app.config import UPLOAD_FOLDER
from app.storage import (add_document, load_documents, get_document, delete_document as delete_document_metadata, save_documents,)
from app.pdf import save_pdf, extract_pages
from app.chunking import chunk_document
from app.embeddings import create_embeddings
from app.vector_store import create_collection, index_chunks, delete_document_chunks


def process_document(document_id: str, pdf_path):
    """
    Extract pages, create chunks, generate embeddings
    and store them in Qdrant.
    """

    page_data = extract_pages(pdf_path)

    chunks = chunk_document(
        document_id=document_id,
        page_data=page_data,
    )

    embedded_chunks = create_embeddings(chunks)

    create_collection()

    index_chunks(embedded_chunks)

    return {
        "pages": len(page_data),
        "chunks": len(embedded_chunks),
    }


def upload_document(file: UploadFile):
    """
    Upload a PDF and process it.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing."
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    original_filename = file.filename

    document_id = str(uuid.uuid4())

    extension = Path(file.filename).suffix

    stored_filename = f"{document_id}{extension}"

    file.filename = stored_filename

    saved_pdf_path = save_pdf(
        file,
        UPLOAD_FOLDER,
    )

    document = {
        "document_id": document_id,
        "original_filename": original_filename,
        "stored_filename": stored_filename,
        "uploaded_at": datetime.now().isoformat(),
    }

    add_document(document)

    processing_result = process_document(
        document_id=document_id,
        pdf_path=saved_pdf_path,
    )

    return {
        "success": True,
        "document_id": document_id,
        "filename": original_filename,
        "pages": processing_result["pages"],
        "chunks": processing_result["chunks"],
    }


def get_all_documents():
    """
    Return all uploaded documents.
    """

    documents = load_documents()

    return {
        "success": True,
        "count": len(documents),
        "documents": documents,
    }

def get_document_by_id(document_id: str):
    """
    Return one document by ID.
    """

    document = get_document(document_id)

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return document


def delete_document_by_id(document_id: str):

    documents = load_documents()

    # Find the document
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

    # Delete PDF
    pdf_path = Path(UPLOAD_FOLDER) / document["stored_filename"]

    if pdf_path.exists():
        pdf_path.unlink()

    # Delete vectors from Qdrant
    try:
        delete_document_chunks(document_id)
    except Exception as e:
        print(
            f"Warning: Failed to delete Qdrant vectors for document "
            f"{document_id}: {e}"
        )

    # Remove metadata
    delete_document_metadata(document_id)

    return {
        "success": True,
        "message": "Document deleted successfully.",
    }