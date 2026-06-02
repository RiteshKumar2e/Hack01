import os
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

import json
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router, set_pipeline
from .ml.pipeline import RankingPipeline
from .data.generate_data import generate_sample_jobs
from .db import init_db, get_all_candidates, save_candidate, get_all_sample_jobs, save_sample_job

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
    """Load candidate data from Turso/libSQL or generate and seed if empty."""
    global candidates_data, sample_jobs_data

    # Initialize the database schema
    init_db()

    # Load candidates from database
    candidates_data = get_all_candidates()
    if not candidates_data:
        logger.info("No candidates found in Turso database.")
        candidates_data = []
    else:
        logger.info(f"Loaded {len(candidates_data)} candidates from Turso database.")

    # Load sample jobs from database
    sample_jobs_data = get_all_sample_jobs()
    if not sample_jobs_data:
        logger.info("No sample jobs found in Turso database.")
        sample_jobs_data = []
    else:
        logger.info(f"Loaded {len(sample_jobs_data)} sample jobs from Turso database.")


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
