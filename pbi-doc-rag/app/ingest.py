"""
Upload all JSON files from data/ into the Gemini Semantic Retrieval corpus.

Each JSON file becomes one Document; its text content is ingested as Chunks
(one chunk per file for simplicity — Gemini splits automatically if too long).

Usage:
    python -m app.ingest
"""
import json
import pathlib
import sys

from google.genai import types

from app.gemini_client import client, get_or_create_store
from app.config import FILE_SEARCH_STORE_NAME

# data/ sits two levels above this file  (pbi-doc-rag/app/ingest.py → data/)
DATA_DIR = pathlib.Path(__file__).resolve().parents[2] / "data"
CHUNK_MAX_CHARS = 9_000  # Gemini chunk size limit is ~10 000 bytes


def _extract_model_name(data: dict, fallback: str) -> str:
    for key in ("modelId", "id", "name"):
        val = data.get(key)
        if isinstance(val, str) and val:
            return val
        if isinstance(val, dict):
            return val.get("fr") or val.get("en") or ""
    return fallback


def _already_exists(corpus_name: str, display_name: str) -> bool:
    try:
        for doc in client.corpora.documents.list(parent=corpus_name):
            if doc.display_name == display_name:
                return True
    except Exception:
        pass
    return False


def _upload_file(corpus_name: str, display_name: str, raw: str, model_name: str) -> None:
    """Create a Document in the corpus and add the file content as chunks."""
    doc = client.corpora.documents.create(
        parent=corpus_name,
        document=types.Document(
            display_name=display_name,
            custom_metadata=[
                types.CustomMetadata(key="source_file", string_value=display_name),
                types.CustomMetadata(key="model_name", string_value=model_name),
            ],
        ),
    )

    # Split content into chunks if needed
    parts = [raw[i : i + CHUNK_MAX_CHARS] for i in range(0, len(raw), CHUNK_MAX_CHARS)]
    for part in parts:
        client.corpora.documents.chunks.create(
            parent=doc.name,
            chunk=types.Chunk(
                data=types.ChunkData(string_value=part),
            ),
        )


def ingest() -> None:
    if not DATA_DIR.exists():
        print(f"[ingest] ERROR — data dir not found: {DATA_DIR}", file=sys.stderr)
        sys.exit(1)

    corpus_name = get_or_create_store(FILE_SEARCH_STORE_NAME)
    json_files = sorted(DATA_DIR.rglob("*.json"))
    print(f"[ingest] {len(json_files)} JSON file(s) found in {DATA_DIR}\n")

    ok = skipped = failed = 0

    for path in json_files:
        rel = path.relative_to(DATA_DIR)
        display_name = str(rel).replace("\\", "/")

        if _already_exists(corpus_name, display_name):
            print(f"  [skip]  {display_name}")
            skipped += 1
            continue

        try:
            raw = path.read_text(encoding="utf-8")
            data = json.loads(raw)
        except Exception as exc:
            print(f"  [error] {display_name} — read/parse failed: {exc}")
            failed += 1
            continue

        model_name = _extract_model_name(data, display_name)

        try:
            _upload_file(corpus_name, display_name, raw, model_name)
            print(f"  [ok]    {display_name}  (model: {model_name})")
            ok += 1
        except Exception as exc:
            print(f"  [error] {display_name} — upload failed: {exc}")
            failed += 1

    print(f"\n[ingest] Done — {ok} uploaded, {skipped} skipped, {failed} failed.")


if __name__ == "__main__":
    ingest()
