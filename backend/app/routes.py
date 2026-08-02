from fastapi import APIRouter, UploadFile, File, HTTPException

from app.pdf import get_pdf_path, extract_pages
from app.storage import get_document
from app.ai_service import summarize_document, answer_question
from app.schemas import QuestionRequest
from app.vector_store import search_chunks
from app.document_service import (
    upload_document,
    get_all_documents,
    get_document_by_id,
    delete_document_by_id,
)

from app.cache import (
    cache_exists,
    load_cache,
    save_cache
)

router = APIRouter()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF."""

    return upload_document(file)


@router.get("/documents")
def get_documents():
    return get_all_documents()

@router.get("/documents/{document_id}")
def get_single_document(document_id: str):
    return {
        "document": get_document_by_id(document_id)
    }

@router.delete("/documents/{document_id}")
def delete_single_document(document_id: str):
    return delete_document_by_id(document_id)



@router.post("/summary/{document_id}")
def summarize_pdf(document_id: str):

    # Step 1: Get document metadata
    document = get_document_by_id(document_id)

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

@router.post("/ask/{document_id}")
def ask_question(

    document_id: str,
    request: QuestionRequest,
):
    """
    Ask questions about an uploaded PDF.
    """

    # Step 1: Check if document exists
    document = get_single_document(document_id)

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Step 2: Retrieve relevant chunks from Qdrant
    chunks = search_chunks(
        document_id=document_id,
        query=request.question,
        limit=5,
    )

    # Step 3: If no chunks found
    if len(chunks) == 0:
        raise HTTPException(
            status_code=404,
            detail="No relevant information found in the document."
        )

    # Step 4: Ask Gemini using retrieved chunks
    response = answer_question(
        question=request.question,
        chunks=chunks,
    )

    # Step 5: Return the response
    return response


def get_document_pages(document_id: str):
    """
    Load a document and extract its pages.
    """

    document = get_document(document_id)

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    pdf_path = get_pdf_path(document["stored_filename"])

    return document, extract_pages(pdf_path)

