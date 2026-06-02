"""
TF-IDF Vectorizer — Built from Scratch
Implements Term Frequency - Inverse Document Frequency scoring
using only numpy, no sklearn.
"""

import math
import numpy as np
from collections import Counter
from .tokenizer import tokenize


class TFIDFVectorizer:
    """
    From-scratch TF-IDF vectorizer using numpy.
    
    TF(t,d) = count(t in d) / len(d)
    IDF(t) = log(N / (1 + df(t)))
    TF-IDF(t,d) = TF(t,d) * IDF(t)
    """

    def __init__(self):
        self.vocabulary: dict[str, int] = {}
        self.idf_values: np.ndarray = None
        self.doc_count: int = 0
        self._fitted = False

    def fit(self, documents: list[str]) -> 'TFIDFVectorizer':
        """
        Learn vocabulary and IDF values from a corpus of documents.
        
        Args:
            documents: List of raw text documents
        """
        self.doc_count = len(documents)

        # Tokenize all documents
        tokenized_docs = [tokenize(doc) for doc in documents]

        # Build vocabulary from all tokens
        all_tokens = set()
        for tokens in tokenized_docs:
            all_tokens.update(tokens)

        self.vocabulary = {token: idx for idx, token in enumerate(sorted(all_tokens))}
        vocab_size = len(self.vocabulary)

        # Compute document frequency for each term
        df = np.zeros(vocab_size)
        for tokens in tokenized_docs:
            seen = set(tokens)
            for token in seen:
                if token in self.vocabulary:
                    df[self.vocabulary[token]] += 1

        # Compute IDF: log(N / (1 + df)) + 1  (smoothed)
        self.idf_values = np.log(self.doc_count / (1 + df)) + 1

        self._fitted = True
        return self

    def transform(self, documents: list[str]) -> np.ndarray:
        """
        Transform documents into TF-IDF vectors.
        
        Args:
            documents: List of raw text documents
            
        Returns:
            numpy array of shape (n_documents, vocab_size)
        """
        if not self._fitted:
            raise RuntimeError("Vectorizer must be fitted before transform")

        vocab_size = len(self.vocabulary)
        n_docs = len(documents)
        tfidf_matrix = np.zeros((n_docs, vocab_size))

        for i, doc in enumerate(documents):
            tokens = tokenize(doc)
            if not tokens:
                continue

            # Compute term frequency
            token_counts = Counter(tokens)
            doc_len = len(tokens)

            for token, count in token_counts.items():
                if token in self.vocabulary:
                    idx = self.vocabulary[token]
                    tf = count / doc_len
                    tfidf_matrix[i, idx] = tf * self.idf_values[idx]

        return tfidf_matrix

    def fit_transform(self, documents: list[str]) -> np.ndarray:
        """Fit and transform in one step."""
        self.fit(documents)
        return self.transform(documents)

    def similarity(self, query: str, document_vectors: np.ndarray) -> np.ndarray:
        """
        Compute cosine similarity between a query and document vectors.
        
        Args:
            query: Raw query text
            document_vectors: Pre-computed TF-IDF vectors for corpus
            
        Returns:
            Array of similarity scores (0-1) for each document
        """
        query_vector = self.transform([query])[0]

        # Cosine similarity
        query_norm = np.linalg.norm(query_vector)
        if query_norm == 0:
            return np.zeros(len(document_vectors))

        doc_norms = np.linalg.norm(document_vectors, axis=1)
        doc_norms[doc_norms == 0] = 1  # avoid division by zero

        similarities = np.dot(document_vectors, query_vector) / (doc_norms * query_norm)
        return np.clip(similarities, 0, 1)
