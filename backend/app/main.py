"""
Intelligent Candidate Discovery — FastAPI Application
Main entry point that initializes the ML pipeline and serves the API.
"""

import json
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router, set_pipeline
from .ml.pipeline import RankingPipeline
from .data.generate_data import generate_candidates, generate_sample_jobs

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global pipeline instance
pipeline = RankingPipeline()
candidates_data = []
sample_jobs_data = []


def load_or_generate_data():
    """Load candidate data from JSON or generate if not found."""
    global candidates_data, sample_jobs_data

    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    candidates_path = os.path.join(data_dir, 'candidates.json')
    jobs_path = os.path.join(data_dir, 'sample_jobs.json')

    # Load or generate candidates
    if os.path.exists(candidates_path):
        logger.info(f"Loading candidates from {candidates_path}")
        with open(candidates_path, 'r') as f:
            candidates_data = json.load(f)
    else:
        logger.info("Generating synthetic candidates...")
        candidates_data = generate_candidates()
        os.makedirs(data_dir, exist_ok=True)
        with open(candidates_path, 'w') as f:
            json.dump(candidates_data, f, indent=2)
        logger.info(f"Saved {len(candidates_data)} candidates to {candidates_path}")

    # Load or generate sample jobs
    if os.path.exists(jobs_path):
        with open(jobs_path, 'r') as f:
            sample_jobs_data = json.load(f)
    else:
        sample_jobs_data = generate_sample_jobs()
        with open(jobs_path, 'w') as f:
            json.dump(sample_jobs_data, f, indent=2)

    logger.info(f"Loaded {len(candidates_data)} candidates and {len(sample_jobs_data)} sample jobs")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler — initialize pipeline on startup."""
    logger.info("=" * 60)
    logger.info("🚀 Starting Intelligent Candidate Discovery System")
    logger.info("=" * 60)

    # Load data
    load_or_generate_data()

    # Initialize ML pipeline
    pipeline.initialize(candidates_data)

    # Set pipeline reference in routes
    set_pipeline(pipeline, candidates_data, sample_jobs_data)

    logger.info("✅ System ready! Pipeline initialized and API serving.")
    logger.info("=" * 60)

    yield  # App is running

    logger.info("Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Intelligent Candidate Discovery",
    description="AI-powered candidate ranking system with multi-signal ML pipeline",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(router)


@app.get("/")
async def root():
    return {
        "name": "Intelligent Candidate Discovery",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }
