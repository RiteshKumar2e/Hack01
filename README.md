# Talent Discovery — Intelligent Candidate Ranking System

AI-powered candidate matching and ranking system that goes beyond keyword filtering to intelligently rank candidates using a multi-signal ML pipeline.

---

## Project Structure

```
Hack01/
├── backend/                  # FastAPI + ML Engine
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── schemas.py        # Pydantic request/response models
│   │   ├── api/
│   │   │   └── routes.py     # API endpoints
│   │   ├── ml/               # ML pipeline (built from scratch)
│   │   │   ├── pipeline.py   # Orchestrator
│   │   │   ├── tokenizer.py  # Text tokenizer
│   │   │   ├── tfidf.py      # TF-IDF scoring
│   │   │   ├── bm25.py       # BM25 scoring
│   │   │   ├── semantic.py   # SBERT semantic matching
│   │   │   ├── metadata_scorer.py
│   │   │   ├── behavioral_scorer.py
│   │   │   └── ranker.py     # Multi-signal fusion ranker
│   │   └── data/
│   │       ├── generate_data.py   # Synthetic data generator
│   │       ├── candidates.json    # 200 candidate profiles (auto-generated)
│   │       └── sample_jobs.json   # 6 sample job templates
│   └── requirements.txt
│
└── frontend/                 # React + Vite
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── JobInput.jsx
    │   │   ├── CandidateCard.jsx
    │   │   ├── CandidateDetail.jsx
    │   │   ├── ScoreBreakdown.jsx
    │   │   └── StatsPanel.jsx
    │   └── services/
    │       └── api.js
    └── package.json
```

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**
- **pip** (Python package manager)

---

## Setup & Run

### 1. Backend (FastAPI + ML Pipeline)

Open a terminal and run:

```bash
# Navigate to backend folder
cd backend

# (Recommended) Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --reload --port 8000
```

The backend will start at **http://localhost:8000**

- API Docs (Swagger): http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

> **Note:** On first startup, the server will:
> 1. Generate 200 synthetic candidate profiles (if not already cached)
> 2. Download the SBERT model (~90MB, one-time)
> 3. Build TF-IDF and BM25 indices
>
> This may take 1-2 minutes the first time.

---

### 2. Frontend (React + Vite)

Open a **second terminal** and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will start at **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/health` | System health + pipeline status |
| `GET`  | `/api/candidates` | List candidates (paginated) |
| `GET`  | `/api/candidates/{id}` | Get full candidate profile |
| `GET`  | `/api/sample-jobs` | Get pre-configured job templates |
| `POST` | `/api/rank` | Rank candidates against a job description |

### Example: Rank Candidates

```bash
curl -X POST http://localhost:8000/api/rank \
  -H "Content-Type: application/json" \
  -d '{
    "job_description": "Looking for a senior ML engineer with PyTorch experience...",
    "job_title": "Senior ML Engineer",
    "preferred_skills": ["PyTorch", "MLOps", "Docker"],
    "top_k": 10
  }'
```

---

## How the ML Pipeline Works

The ranking system uses a **multi-signal fusion** approach:

1. **Lexical Matching** — BM25 and TF-IDF for keyword relevance
2. **Semantic Matching** — SBERT embeddings for contextual understanding
3. **Metadata Scoring** — Experience years, education level, location (Gaussian decay)
4. **Behavioral Signals** — Activity recency, GitHub contributions, profile completeness, publications (exponential decay)
5. **Fusion Ranker** — Weighted combination of all signals into a final match score

---

## Quick Start (Both Servers)

**Terminal 1 — Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.
