#!/usr/bin/env bash
# Run from the pbi-doc-rag/ directory
set -e
cd "$(dirname "$0")/.."
python -m app.ingest
