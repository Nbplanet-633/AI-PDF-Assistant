import fitz
import shutil

from app.config import UPLOAD_FOLDER


def save_pdf(file, upload_folder):
    file_path = upload_folder / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path


def get_pdf_path(filename: str):
    return UPLOAD_FOLDER / filename


def extract_pages(pdf_path):
    document = fitz.open(pdf_path)

    pages = []

    for page_number in range(len(document)):

        page = document.load_page(page_number)

        pages.append(
            {
                "page": page_number + 1,
                "text": page.get_text()
            }
        )

    document.close()

    return pages


    """
    Convert page-wise data into one complete document.
    """

    page_data = extract_pages(pdf_path)

    full_text = ""

    for page in page_data:
        full_text += page["text"]

    return {
        "pages": len(page_data),
        "characters": len(full_text),
        "text": full_text,
        "page_data": page_data
    }