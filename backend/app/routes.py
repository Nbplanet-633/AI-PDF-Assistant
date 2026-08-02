import uuid
from pathlib import Path
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import UPLOAD_FOLDER
from app.pdf import (save_pdf , get_pdf_path, extract_pages)
from app.storage import add_document, get_document, load_documents, delete_document


from app.summarizer import summarize_document

from app.cache import (
    cache_exists,
    load_cache,
    save_cache
)

router = APIRouter()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

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

    

    # Save original filename
    original_filename = file.filename

    # Generate unique document ID
    document_id = str(uuid.uuid4())

    # Keep the original file extension
    extension = Path(file.filename).suffix

    # Create a unique filename
    stored_filename = f"{document_id}{extension}"

    # Change filename before saving
    file.filename = stored_filename

    # Save the PDF
    save_pdf(file, UPLOAD_FOLDER)

    # Create metadata
    document = {
        "document_id": document_id,
        "original_filename": original_filename,
        "stored_filename": stored_filename,
        "uploaded_at": datetime.now().isoformat()
    }

    # Save metadata to documents.json
    add_document(document)

    return {
        "success": True,
        "document_id": document_id,
        "filename": original_filename
    }

@router.get("/documents")
def get_documents():

    documents = load_documents()

    return {
        "success": True,
        "count": len(documents),
        "documents": documents
    }

@router.get("/documents/{document_id}")
def get_single_document(document_id: str):

    document = get_document(document_id)

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return {
        "document": document
    }

@router.post("/summary/{document_id}")
def summarize_pdf(document_id: str):

    # Step 1: Get document metadata
    document = get_document(document_id)

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Step 2: Locate the PDF
    pdf_path = get_pdf_path(document["stored_filename"])

    # Step 3: Extract page-wise text
    if cache_exists(document_id):

        page_data = load_cache(document_id)

    else:

        page_data = extract_pages(pdf_path)

        save_cache(document_id, page_data)

    # Step 4: Generate AI summary
    summary = summarize_document(page_data)

    # Step 5: Return response
    return {
        "document": {
            "id": document["document_id"],
            "filename": document["original_filename"]
        },
        "summary": summary
    }