"""
Semantic Similarity Module
Uses Sentence-BERT (all-MiniLM-L6-v2) for dense vector embeddings
and cosine similarity for semantic matching.
"""

import numpy as np
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Lazy-loaded model
_model = None


def _get_model():
    """Lazy-load the sentence transformer model."""
    global _model
    if _model is None:
        logger.info("Loading Sentence-BERT model (all-MiniLM-L6-v2)...")
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Model loaded successfully.")
    return _model


def encode_texts(texts: list[str], batch_size: int = 64, show_progress: bool = True) -> np.ndarray:
    """
    Encode a list of texts into dense vector embeddings.
    
    Args:
        texts: List of text strings to encode
        batch_size: Batch size for encoding
        show_progress: Whether to show progress bar
        
    Returns:
        numpy array of shape (n_texts, 384) — embeddings
    """
    model = _get_model()
    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=show_progress,
        convert_to_numpy=True,
        normalize_embeddings=True  # L2 normalize for cosine similarity via dot product
    )
    return embeddings


def cosine_similarity(query_embedding: np.ndarray, corpus_embeddings: np.ndarray) -> np.ndarray:
    """
    Compute cosine similarity between a query and corpus embeddings.
    Since embeddings are L2-normalized, dot product = cosine similarity.
    
    Args:
        query_embedding: Shape (384,) — single query vector
        corpus_embeddings: Shape (n, 384) — corpus vectors
        
    Returns:
        Array of similarity scores (shape n)
    """
    # Dot product on normalized vectors = cosine similarity
    similarities = np.dot(corpus_embeddings, query_embedding)
    return np.clip(similarities, 0, 1)


def semantic_search(query: str, corpus_embeddings: np.ndarray) -> np.ndarray:
    """
    Perform semantic search: encode query and compute similarity against corpus.
    
    Args:
        query: Raw query text
        corpus_embeddings: Pre-computed corpus embeddings
        
    Returns:
        Array of semantic similarity scores (0-1)
    """
    query_embedding = encode_texts([query], show_progress=False)[0]
    return cosine_similarity(query_embedding, corpus_embeddings)
