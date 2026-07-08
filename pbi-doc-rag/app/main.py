from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

STATIC_DIR = Path(__file__).parent / "static"

from app.gemini_client import generate_with_retry
from app.ingest import build_index, search

SYSTEM_PROMPT = (
    "Tu es un assistant qui répond aux questions sur la documentation technique de rapports "
    "et modèles Power BI (sources de données, tables, modèles sémantiques, pages, visuels). "
    "Réponds uniquement à partir des documents fournis dans le contexte. "
    "Si l'information n'est pas trouvée dans ces documents, dis-le clairement plutôt "
    "d'inventer une réponse. Sois précis et mentionne le nom du modèle ou rapport concerné "
    "quand c'est pertinent."
)

CHUNK_PREVIEW = 300  # chars shown in citations

app_state: dict = {}
_cache: dict[str, QueryResponse] = {}   # simple question → response cache


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[startup] Building index from data/...")
    app_state["index"] = build_index()
    print(f"[startup] {len(app_state['index'])} files indexed.")
    yield


app = FastAPI(title="PBI Doc RAG", version="0.1.0", lifespan=lifespan)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


class Citation(BaseModel):
    source_file: str
    excerpt: str


class QueryResponse(BaseModel):
    answer: str
    citations: list[Citation]


@app.get("/", include_in_schema=False)
def root():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/store/status")
def store_status():
    idx = app_state.get("index", [])
    return {"type": "local-index", "document_count": len(idx)}


@app.post("/query", response_model=QueryResponse)
def query(req: QueryRequest):
    q = req.question.strip()
    if not q:
        raise HTTPException(status_code=400, detail="question must not be empty")

    if q in _cache:
        print(f"[cache] hit for: {q[:60]}")
        return _cache[q]

    index = app_state.get("index")
    if not index:
        raise HTTPException(status_code=503, detail="Index not ready")

    # 1 — Retrieve relevant chunks
    chunks = search(index, q, top_k=3)

    if not chunks:
        return QueryResponse(
            answer="Aucun document pertinent trouvé pour cette question.",
            citations=[],
        )

    # 2 — Build prompt with context (1500 chars/chunk to stay within free-tier token limits)
    context_block = "\n\n---\n\n".join(
        f"[Source: {c['source']}]\n{c['text'][:1500]}" for c in chunks
    )
    full_prompt = (
        f"Contexte documentaire :\n\n{context_block}\n\n"
        f"Question : {q}"
    )

    # 3 — Generate answer (with retry on 429)
    try:
        answer = generate_with_retry(full_prompt, SYSTEM_PROMPT)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini error: {exc}")

    citations = [
        Citation(source_file=c["source"], excerpt=c["text"][:CHUNK_PREVIEW])
        for c in chunks
    ]
    _cache[q] = QueryResponse(answer=answer, citations=citations)
    return _cache[q]
