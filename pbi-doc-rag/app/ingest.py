"""
Index all JSON files from data/ into a local in-memory index (list of chunks).
The index is rebuilt at startup — no external store needed.

Can also be run standalone to verify which files are found:
    python -m app.ingest
"""
import json
import pathlib

DATA_DIR = pathlib.Path(__file__).resolve().parents[2] / "data"


def _extract_id(data: dict, fallback: str) -> str:
    for key in ("modelId", "id"):
        val = data.get(key)
        if isinstance(val, str) and val:
            return val
    return fallback


def build_index() -> list[dict]:
    """
    Walk data/**/*.json and return a flat list of chunk dicts:
      {"source": relative path, "model_id": str, "text": raw JSON string}
    """
    if not DATA_DIR.exists():
        raise FileNotFoundError(f"data/ directory not found at {DATA_DIR}")

    index = []
    for path in sorted(DATA_DIR.rglob("*.json")):
        rel = str(path.relative_to(DATA_DIR)).replace("\\", "/")
        try:
            raw = path.read_text(encoding="utf-8")
            data = json.loads(raw)
            model_id = _extract_id(data, rel)
            index.append({"source": rel, "model_id": model_id, "text": raw})
        except Exception as exc:
            print(f"  [warn] {rel} — skipped: {exc}")

    return index


def search(index: list[dict], query: str, top_k: int = 5) -> list[dict]:
    """
    Simple keyword search: score each chunk by how many query words it contains.
    Returns top_k chunks sorted by score descending.
    """
    words = query.lower().split()
    scored = []
    for chunk in index:
        text_lower = chunk["text"].lower()
        score = sum(text_lower.count(w) for w in words)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [c for _, c in scored[:top_k]]


if __name__ == "__main__":
    idx = build_index()
    print(f"[ingest] {len(idx)} files indexed from {DATA_DIR}")
    for entry in idx:
        print(f"  {entry['source']}  (model_id: {entry['model_id']})")
