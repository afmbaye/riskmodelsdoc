# pbi-doc-rag

RAG API sur la documentation Power BI (modèles + sources) via Gemini File Search + FastAPI.

## Prérequis

- Python 3.11+
- Une clé API Gemini → [aistudio.google.com/api-keys](https://aistudio.google.com/api-keys)

## Installation

```bash
cd pbi-doc-rag
pip install -r requirements.txt
```

## Configuration

```bash
cp .env.example .env
# Edite .env et renseigne ta GEMINI_API_KEY
```

Variables disponibles dans `.env` :

| Variable | Défaut | Description |
|---|---|---|
| `GEMINI_API_KEY` | *(obligatoire)* | Clé API Google AI Studio |
| `FILE_SEARCH_STORE_NAME` | `pbi-doc-store` | Nom du File Search Store Gemini |

## Ingestion des fichiers JSON

Lance ce script **une seule fois** (ou quand `data/` change) :

```bash
python -m app.ingest
```

Il parcourt tous les `.json` de `data/`, les uploade dans un File Search Store Gemini et log le statut de chaque fichier. Les fichiers déjà uploadés sont ignorés (idempotent).

## Lancer l'API

```bash
uvicorn app.main:app --reload
```

L'API écoute sur `http://localhost:8000`.

## Endpoints

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/health` | Healthcheck |
| `GET` | `/store/status` | Infos sur le File Search Store |
| `POST` | `/query` | Pose une question sur la documentation |

## Exemple de requête

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Quelles sont les sources de données du modèle Portfolio Risk Metrics ?"}'
```

Réponse :

```json
{
  "answer": "Le modèle Portfolio Risk Metrics est alimenté par...",
  "citations": [
    {
      "source_file": "models/portfolio-risk-metrics/overview.json",
      "chunk": "..."
    }
  ]
}
```

## Documentation interactive

Swagger UI disponible sur `http://localhost:8000/docs` une fois l'API lancée.
