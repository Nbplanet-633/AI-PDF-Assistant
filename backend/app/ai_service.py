from google import genai
from google.genai import types

from app.config import GEMINI_API_KEY, MAX_SUMMARY_CHARACTERS
from app.schemas import SummaryResponse, QuestionResponse, Source
from app.chunking import join_pages

client = genai.Client(api_key=GEMINI_API_KEY)


def summarize_document(page_data):

    text = join_pages(page_data)

    prompt = f"""
Summarize the following document.

Return:
1. A concise overview
2. Five key points
3. Important keywords

Document:

{text[:MAX_SUMMARY_CHARACTERS]}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=SummaryResponse,
        ),
    )

    print(type(response.parsed))
    print(response.parsed)

    return response.parsed

def answer_question(question: str, chunks):

    context = ""

    for chunk in chunks:

        context += f"""
Page {chunk.page}

{chunk.text}

--------------------

"""

    prompt = f"""
You are an AI PDF assistant.

Answer ONLY using the provided context.

If the answer is not present,
say:

"I couldn't find that information in the document."

Context:

{context}

Question:

{question}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    sources = []

    for chunk in chunks:

        sources.append(
            Source(
                page=chunk.page,
                chunk_id=chunk.chunk_id,
                preview=chunk.text[:150],
            )
        )
    answer = response.text

    if answer is None:
        answer = "Sorry, I couldn't generate an answer."

    return QuestionResponse(
        answer=answer,
        sources=sources,
    )