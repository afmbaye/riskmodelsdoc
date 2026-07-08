from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY, FILE_SEARCH_STORE_NAME

client = genai.Client(api_key=GEMINI_API_KEY)


def get_or_create_store(display_name: str = FILE_SEARCH_STORE_NAME) -> str:
    """
    Return the resource name of an existing corpus matching display_name,
    or create a new one.  Resource name format: 'corpora/<id>'.
    """
    try:
        for corpus in client.corpora.list():
            if corpus.display_name == display_name:
                print(f"[store] Found existing corpus: {corpus.name!r}")
                return corpus.name
    except Exception as exc:
        print(f"[store] Warning — could not list corpora: {exc}")

    print(f"[store] Creating new corpus: {display_name!r}")
    corpus = client.corpora.create(
        corpus=types.Corpus(display_name=display_name)
    )
    print(f"[store] Created: {corpus.name!r}")
    return corpus.name


def query_store(store_name: str, question: str, top_k: int = 5) -> list[dict]:
    """
    Retrieve the top_k most relevant chunks from the corpus for a given question.
    Returns a list of {'source': str, 'text': str} dicts.
    """
    results = client.corpora.query(
        name=store_name,
        query=types.QueryCorpusRequest(
            query=question,
            results_count=top_k,
        ),
    )
    chunks = []
    for r in results.relevant_chunks or []:
        chunk_text = r.chunk.data.string_value if r.chunk and r.chunk.data else ""
        source = ""
        for meta in r.chunk.custom_metadata or []:
            if meta.key == "source_file":
                source = meta.string_value
                break
        chunks.append({"source": source, "text": chunk_text})
    return chunks


def get_store_info(store_name: str) -> dict:
    """Return basic info about the corpus."""
    try:
        corpus = client.corpora.get(name=store_name)
        doc_count = sum(1 for _ in client.corpora.documents.list(parent=store_name))
        return {
            "name": corpus.name,
            "display_name": corpus.display_name,
            "document_count": doc_count,
        }
    except Exception as exc:
        return {"error": str(exc)}
