"""
BM25 Scorer — Built from Scratch
Implements the Okapi BM25 ranking function with configurable parameters.
"""

import math
import numpy as np
from collections import Counter
from .tokenizer import tokenize


class BM25Scorer:
    """
    From-scratch implementation of the Okapi BM25 algorithm.
    
    BM25(q, d) = Σ IDF(qi) * (f(qi,d) * (k1 + 1)) / (f(qi,d) + k1 * (1 - b + b * |d|/avgdl))
    
    Where:
    - f(qi,d) = frequency of term qi in document d
    - |d| = length of document d
    - avgdl = average document length
    - k1 = term frequency saturation parameter (default 1.5)
    - b = length normalization parameter (default 0.75)
    """

    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.doc_count = 0
        self.avg_doc_len = 0.0
        self.doc_freqs: dict[str, int] = {}  # term → number of docs containing it
        self.doc_tokens: list[list[str]] = []
        self.doc_lengths: list[int] = []
        self._fitted = False

    def fit(self, documents: list[str]) -> 'BM25Scorer':
        """
        Index a corpus of documents for BM25 scoring.
        
        Args:
            documents: List of raw text documents
        """
        self.doc_count = len(documents)
        self.doc_tokens = []
        self.doc_lengths = []
        self.doc_freqs = {}

        for doc in documents:
            tokens = tokenize(doc)
            self.doc_tokens.append(tokens)
            self.doc_lengths.append(len(tokens))

            # Update document frequency
            unique_tokens = set(tokens)
            for token in unique_tokens:
                self.doc_freqs[token] = self.doc_freqs.get(token, 0) + 1

        self.avg_doc_len = sum(self.doc_lengths) / max(self.doc_count, 1)
        self._fitted = True
        return self

    def _idf(self, term: str) -> float:
        """
        Compute IDF for a term using the BM25 IDF formula.
        IDF(qi) = log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)
        """
        df = self.doc_freqs.get(term, 0)
        return math.log((self.doc_count - df + 0.5) / (df + 0.5) + 1)

    def score(self, query: str) -> np.ndarray:
        """
        Score all documents against a query using BM25.
        
        Args:
            query: Raw query text
            
        Returns:
            Array of BM25 scores for each document
        """
        if not self._fitted:
            raise RuntimeError("BM25 must be fitted before scoring")

        query_tokens = tokenize(query)
        scores = np.zeros(self.doc_count)

        for q_term in query_tokens:
            idf = self._idf(q_term)

            for i, doc_tokens in enumerate(self.doc_tokens):
                # Term frequency in this document
                tf = doc_tokens.count(q_term)
                if tf == 0:
                    continue

                # BM25 formula
                doc_len = self.doc_lengths[i]
                numerator = tf * (self.k1 + 1)
                denominator = tf + self.k1 * (1 - self.b + self.b * doc_len / self.avg_doc_len)
                scores[i] += idf * numerator / denominator

        return scores

    def score_normalized(self, query: str) -> np.ndarray:
        """
        Score and normalize to 0-1 range using min-max normalization.
        """
        scores = self.score(query)
        if scores.max() == scores.min():
            return np.zeros_like(scores)
        return (scores - scores.min()) / (scores.max() - scores.min())
