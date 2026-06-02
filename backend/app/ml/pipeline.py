"""
ML Pipeline Orchestrator
Manages the full ranking pipeline: initialization, caching, and scoring flow.
Coordinates all ML components into a single callable interface.
"""

import time
import logging
import numpy as np
from typing import Optional

from .tokenizer import build_document_text
from .tfidf import TFIDFVectorizer
from .bm25 import BM25Scorer
from .semantic import encode_texts, semantic_search
from .metadata_scorer import compute_metadata_scores
from .behavioral_scorer import compute_behavioral_scores
from .ranker import FusionRanker

logger = logging.getLogger(__name__)


class RankingPipeline:
    """
    Orchestrates the full candidate ranking pipeline.
    
    Lifecycle:
    1. initialize() — Called once at startup. Pre-computes all candidate 
       representations (document texts, TF-IDF vectors, BM25 index, SBERT embeddings).
    2. rank() — Called per query. Scores all candidates against the job description.
    """

    def __init__(self):
        self.candidates: list[dict] = []
        self.doc_texts: list[str] = []
        self.tfidf_vectorizer = TFIDFVectorizer()
        self.bm25_scorer = BM25Scorer()
        self.fusion_ranker = FusionRanker()
        self.tfidf_vectors: Optional[np.ndarray] = None
        self.semantic_embeddings: Optional[np.ndarray] = None
        self._initialized = False

    def initialize(self, candidates: list[dict]):
        """
        Initialize the pipeline with candidate data.
        Pre-computes all representations for fast querying.
        """
        logger.info(f"Initializing ranking pipeline with {len(candidates)} candidates...")
        start = time.time()

        self.candidates = candidates

        if not candidates:
            self.doc_texts = []
            self.tfidf_vectors = np.zeros((0, 0))
            self.semantic_embeddings = np.zeros((0, 384))
            self._initialized = True
            logger.info("Pipeline initialized with empty candidate pool.")
            return

        # Build document texts from candidate profiles
        logger.info("Building document representations...")
        self.doc_texts = [build_document_text(c) for c in candidates]

        # Fit TF-IDF vectorizer and compute vectors
        logger.info("Fitting TF-IDF vectorizer...")
        self.tfidf_vectors = self.tfidf_vectorizer.fit_transform(self.doc_texts)

        # Fit BM25 scorer
        logger.info("Building BM25 index...")
        self.bm25_scorer.fit(self.doc_texts)

        # Compute semantic embeddings
        logger.info("Computing sentence embeddings (this may take a moment on first run)...")
        self.semantic_embeddings = encode_texts(self.doc_texts)

        self._initialized = True
        elapsed = time.time() - start
        logger.info(f"Pipeline initialized in {elapsed:.2f}s")

    def rank(
        self,
        job_description: str,
        job_title: str = None,
        preferred_skills: list[str] = None,
        required_experience_min: int = None,
        required_experience_max: int = None,
        required_education: str = None,
        preferred_location: str = None,
        top_k: int = 20
    ) -> dict:
        """
        Rank all candidates against a job description.
        
        Args:
            job_description: Full job description text
            job_title: Optional job title for additional context
            preferred_skills: List of preferred skill names
            required_experience_min/max: Experience range
            required_education: Minimum education level
            preferred_location: Preferred candidate location
            top_k: Number of top candidates to return
            
        Returns:
            Dictionary with ranked candidates, processing time, and insights
        """
        if not self._initialized:
            raise RuntimeError("Pipeline must be initialized before ranking")

        if not self.candidates:
            return {
                'ranked_candidates': [],
                'total_candidates_evaluated': 0,
                'processing_time_ms': 0.0,
                'job_insights': {
                    'detected_key_terms': [],
                    'total_candidates_pool': 0,
                    'avg_match_score': 0.0,
                    'max_match_score': 0.0,
                    'min_match_score': 0.0,
                    'score_std_dev': 0.0,
                }
            }

        start = time.time()

        # Build query text (combine title + description for richer matching)
        query_text = job_description
        if job_title:
            query_text = f"{job_title}. {job_title}. {query_text}"
        if preferred_skills:
            query_text += " " + " ".join(preferred_skills)

        # ── Stage 1: Lexical Scoring ──
        logger.info("Computing BM25 scores...")
        bm25_scores = self.bm25_scorer.score_normalized(query_text)

        logger.info("Computing TF-IDF scores...")
        tfidf_scores = self.tfidf_vectorizer.similarity(query_text, self.tfidf_vectors)

        # ── Stage 2: Semantic Scoring ──
        logger.info("Computing semantic similarity...")
        semantic_scores = semantic_search(query_text, self.semantic_embeddings)

        # ── Stage 3: Metadata Scoring ──
        logger.info("Computing metadata scores...")
        metadata_scores = compute_metadata_scores(
            self.candidates,
            required_experience_min=required_experience_min,
            required_experience_max=required_experience_max,
            required_education=required_education,
            preferred_skills=preferred_skills,
            preferred_location=preferred_location
        )

        # ── Stage 4: Behavioral Scoring ──
        logger.info("Computing behavioral scores...")
        behavioral_scores = compute_behavioral_scores(self.candidates)

        # ── Stage 5: Fusion ──
        logger.info("Fusing all signals...")
        final_scores, breakdowns = self.fusion_ranker.fuse(
            bm25_scores=bm25_scores,
            tfidf_scores=tfidf_scores,
            semantic_scores=semantic_scores,
            experience_scores=metadata_scores['experience'],
            education_scores=metadata_scores['education'],
            skill_overlap_scores=metadata_scores['skill_overlap'],
            behavioral_scores=behavioral_scores,
            location_scores=metadata_scores['location']
        )

        # Sort by score (descending)
        ranked_indices = np.argsort(-final_scores)[:top_k]

        # Build results
        results = []
        for rank, idx in enumerate(ranked_indices, 1):
            idx = int(idx)
            candidate = self.candidates[idx]
            breakdown = breakdowns[idx]
            reasons = self.fusion_ranker.generate_match_reasons(
                candidate, breakdown, preferred_skills
            )

            results.append({
                'candidate': candidate,
                'match_score': float(final_scores[idx]),
                'rank': rank,
                'score_breakdown': breakdown,
                'match_reasons': reasons
            })

        elapsed_ms = (time.time() - start) * 1000

        # Extract job insights
        from .tokenizer import tokenize
        job_tokens = tokenize(job_description, stem=False)
        top_terms = {}
        for t in job_tokens:
            top_terms[t] = top_terms.get(t, 0) + 1
        sorted_terms = sorted(top_terms.items(), key=lambda x: -x[1])[:15]

        job_insights = {
            'detected_key_terms': [t[0] for t in sorted_terms],
            'total_candidates_pool': len(self.candidates),
            'avg_match_score': round(float(np.mean(final_scores)), 1),
            'max_match_score': round(float(np.max(final_scores)), 1),
            'min_match_score': round(float(np.min(final_scores)), 1),
            'score_std_dev': round(float(np.std(final_scores)), 1),
        }

        logger.info(f"Ranking completed in {elapsed_ms:.1f}ms")

        return {
            'ranked_candidates': results,
            'total_candidates_evaluated': len(self.candidates),
            'processing_time_ms': round(elapsed_ms, 1),
            'job_insights': job_insights
        }
