# TRACE Backend Service

FastAPI-powered transaction investigation backend for TRACE. Built for deterministic evidence reconstruction across multi-institution payment logs.

## Core Responsibilities
- Houses the deterministic correlation engine (Part 3), which reliably links normalized events to payment attempts while preserving uncertainty. Correlation does **not** decide transaction outcomes.
- Ingests, validates, and normalizes synthetic payment logs (Part 2).
- Serves typed REST APIs for the React frontend.
- (Planned) Houses the deterministic rules engine that determines case findings, and generates tamper-evident audit evidence packs.

## Technology Stack
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn ASGI
- **Data Validation & Schemas**: Pydantic v2
- **Persistence Target**: PostgreSQL / Supabase
- **Testing**: Pytest & HTTPX TestClient

## Project Structure
```text
backend/
├── app/
│   ├── __init__.py
│   ├── config.py             # App settings via pydantic-settings
│   ├── main.py               # FastAPI entrypoint, CORS, /health, error handlers
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── router.py     # /cases, /evidence, /correlation; 501 for /analyze, /review
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py           # SQLAlchemy declarative base
│   │   ├── models.py         # CaseModel, SourceFileModel, RawRecordModel, EventModel
│   │   └── session.py        # Engine, SessionLocal, get_db, init_db
│   ├── ingestion/
│   │   ├── __init__.py
│   │   ├── exceptions.py     # Domain exceptions (FileTooLarge, Duplicate, Validation)
│   │   ├── parsers.py        # Safe CSV & JSONL parsing
│   │   ├── validators.py     # Timezone, minor units, and institution schema validation
│   │   ├── normalizer.py     # Canonical event mapping with raw_record_id lineage
│   │   └── service.py        # Transactional ingestion orchestration
│   ├── correlation/
│   │   ├── __init__.py
│   │   ├── engine.py         # Deterministic multi-pass correlation (union-find over global ids)
│   │   └── exceptions.py     # CrossCaseCorrelationError & correlation domain errors
│   └── schemas/
│       ├── __init__.py
│       ├── enums.py          # 5 exact outcomes, 4 qualitative strengths
│       ├── analysis.py       # Shared AnalysisResponse & sub-schemas
│       ├── case.py           # Case models & requests
│       ├── correlation.py    # Correlation states, methods, reason codes, groups
│       ├── evidence.py       # Evidence ingestion & evidence-pack schemas
│       ├── health.py         # Health probe schemas
│       └── review.py         # Human reviewer models
├── migrations/
│   ├── 001_initial_schema.sql# PostgreSQL DDL migration (Supabase compatible)
│   └── README.md             # Migration execution instructions
├── tests/
│   ├── fixtures/             # Synthetic CSV and JSONL test fixtures
│   ├── __init__.py
│   ├── test_contracts.py     # Enum & domain contract tests
│   ├── test_health.py        # Health and OpenAPI route verification
│   ├── test_ingestion.py     # Comprehensive positive/negative ingestion tests
│   └── test_correlation.py   # Deterministic correlation, ambiguity & determinism tests
├── .env.example              # Safe placeholder environment config
├── pyproject.toml            # Build metadata & pytest configuration
├── requirements.txt          # Pinned dependency manifest
└── README.md
```

## Local Development Setup

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure real passwords, API keys, or secrets are NEVER checked into version control.

### 2. Dependency Installation
Using standard pip (or within a virtual environment):
```bash
pip install -r requirements.txt
```

### 3. Run Development Server
```bash
python -m uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Interactive ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- Health Probe: [http://localhost:8000/health](http://localhost:8000/health)

### 4. Run Test Suite
```bash
python -m pytest
```
