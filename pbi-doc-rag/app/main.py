from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.gemini_client import client, get_or_create_store, get_store_info, query_store
from app.config import FILE_SEARCH_STORE_NAME

SYSTEM_PROMPT = (
    "Tu es un assistant qui répond aux questions sur la documentation technique de rapports "
    "et modèles Power BI (sources de données, tables, modèles sémantiques, pages, visuels). "
    "Réponds uniquement à partir des documents fournis dans le contexte. "
    "Si l'information n'est pas trouvée dans ces documents, dis-le clairement plutôt "
    "d'inventer une réponse. Sois précis et mentionne le nom du modèle ou rapport concerné "
    "quand c'est pertinent."
)

MODEL_ID = "gemini-2.0-flash"

store_state: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    store_state["name"] = get_or_create_store(FILE_SEARCH_STORE_NAME)
    yield


app = FastAPI(title="PBI Doc RAG", version="0.1.0", lifespan=lifespan)

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
    chunk: str


class QueryResponse(BaseModel):
    answer: str
    citations: list[Citation]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/store/status")
def store_status():
    if not store_state.get("name"):
        raise HTTPException(status_code=503, detail="Store not initialised")
    return get_store_info(store_state["name"])


@app.post("/query", response_model=QueryResponse)
def query(req: QueryRequest):
    if not store_state.get("name"):
        raise HTTPException(status_code=503, detail="Store not initialised")
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="question must not be empty")

    # 1 — Retrieve relevant chunks from the corpus
    try:
        chunks = query_store(store_state["name"], req.question, top_k=5)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Retrieval error: {exc}")

    # 2 — Build prompt with retrieved context injected
    context_block = "\n\n---\n\n".join(
        f"[Source: {c['source']}]\n{c['text']}" for c in chunks
    ) or "Aucun document trouvé."

    full_prompt = (
        f"Contexte documentaire :\n\n{context_block}\n\n"
        f"Question : {req.question}"
    )

    # 3 — Generate answer
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=full_prompt,
            config={"system_instruction": SYSTEM_PROMPT},
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini generation error: {exc}")

    answer = response.text or ""
    citations = [Citation(source_file=c["source"], chunk=c["text"][:300]) for c in chunks]

    return QueryResponse(answer=answer, citations=citations)
