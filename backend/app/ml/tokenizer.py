"""
Custom Text Tokenizer
Built from scratch for the candidate ranking pipeline.
Handles text preprocessing, stopword removal, stemming, and n-gram extraction.
"""

import re
import math

# Common English stopwords
STOPWORDS = frozenset({
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'must',
    'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my',
    'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
    'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'how',
    'where', 'when', 'why', 'all', 'each', 'every', 'both', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about',
    'above', 'after', 'again', 'also', 'any', 'because', 'before',
    'below', 'between', 'during', 'if', 'into', 'through', 'until',
    'up', 'down', 'out', 'off', 'over', 'under', 'then', 'here',
    'there', 'once', 'as', 'while', 'then', 'able', 'etc', 'like',
    'well', 'get', 'got', 'make', 'made', 'work', 'working'
})

# Simple suffix rules for lightweight stemming (Porter-lite)
SUFFIX_RULES = [
    ('ational', 'ate'), ('tional', 'tion'), ('enci', 'ence'),
    ('anci', 'ance'), ('izer', 'ize'), ('isation', 'ize'),
    ('ization', 'ize'), ('ation', 'ate'), ('ator', 'ate'),
    ('alism', 'al'), ('iveness', 'ive'), ('fulness', 'ful'),
    ('ousness', 'ous'), ('aliti', 'al'), ('iviti', 'ive'),
    ('biliti', 'ble'), ('ement', 'e'), ('ment', ''),
    ('ness', ''), ('ling', ''), ('ing', ''), ('ies', 'y'),
    ('ied', 'y'), ('ses', 's'), ('ers', 'er'), ('tion', 'te'),
    ('sion', 'se'), ('ly', ''), ('ed', ''), ('er', ''),
    ('es', ''), ('s', '')
]


def simple_stem(word: str) -> str:
    """Apply lightweight suffix-stripping stemming."""
    if len(word) <= 3:
        return word
    for suffix, replacement in SUFFIX_RULES:
        if word.endswith(suffix) and len(word) - len(suffix) + len(replacement) >= 3:
            return word[:-len(suffix)] + replacement
    return word


def tokenize(text: str, remove_stopwords: bool = True, stem: bool = True) -> list[str]:
    """
    Tokenize text into a list of processed tokens.
    
    Steps:
    1. Lowercase
    2. Replace special chars (keep alphanumeric, +, #, .)
    3. Split on whitespace
    4. Remove stopwords
    5. Apply stemming
    """
    # Lowercase
    text = text.lower()

    # Keep meaningful tech chars: C++, C#, .NET, Node.js
    text = re.sub(r'[^a-z0-9+#.\-/]', ' ', text)

    # Split on whitespace and filter empty
    tokens = [t.strip('.-') for t in text.split() if len(t.strip('.-')) > 0]

    # Remove stopwords
    if remove_stopwords:
        tokens = [t for t in tokens if t not in STOPWORDS]

    # Stem
    if stem:
        tokens = [simple_stem(t) for t in tokens]

    return tokens


def extract_ngrams(tokens: list[str], n: int = 2) -> list[str]:
    """Extract n-grams from a token list."""
    if len(tokens) < n:
        return []
    return ['_'.join(tokens[i:i+n]) for i in range(len(tokens) - n + 1)]


def build_document_text(candidate: dict) -> str:
    """
    Build a single text representation of a candidate for text-based scoring.
    Combines title, summary, skills, experience, education into one document.
    """
    parts = []

    # Title (weighted by repetition)
    parts.append(candidate.get('title', '') + ' ' + candidate.get('title', ''))

    # Summary
    parts.append(candidate.get('summary', ''))

    # Skills (repeated for emphasis)
    skills = candidate.get('skills', [])
    parts.append(' '.join(skills))
    parts.append(' '.join(skills))  # double-weight skills

    # Experience
    for exp in candidate.get('experience', []):
        parts.append(f"{exp.get('title', '')} at {exp.get('company', '')}")
        parts.append(' '.join(exp.get('skills_used', [])))

    # Education
    edu = candidate.get('education', {})
    parts.append(f"{edu.get('level', '')} {edu.get('field', '')} {edu.get('university', '')}")

    # Certifications
    parts.append(' '.join(candidate.get('certifications', [])))

    return ' '.join(parts)
