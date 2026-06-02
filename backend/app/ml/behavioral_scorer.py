"""
Behavioral Signal Scorer
Evaluates candidate engagement and activity signals:
- Profile completeness
- Activity recency (exponential decay)
- Engagement metrics (publications, contributions, certs)
- Career trajectory (promotion velocity)

All algorithms built from scratch.
"""

import math
import numpy as np
from datetime import datetime


def profile_completeness_score(signals: dict) -> float:
    """
    Score based on how complete the candidate's profile is.
    Already pre-computed in data but we can re-weight.
    
    Returns: Score between 0 and 1
    """
    return signals.get('profile_completeness', 0.5)


def activity_recency_score(days_since_active: int) -> float:
    """
    Score activity recency using exponential decay.
    More recently active candidates score higher.
    
    f(d) = exp(-λ * d) where λ = 0.02 (half-life ~35 days)
    
    Returns: Score between 0 and 1
    """
    lambda_decay = 0.02
    score = math.exp(-lambda_decay * days_since_active)
    return max(0.05, score)  # floor at 0.05


def engagement_score(signals: dict) -> float:
    """
    Composite engagement score from publications, GitHub, certs, portfolio.
    
    Uses log-scaled scoring to prevent outliers from dominating.
    
    Returns: Score between 0 and 1
    """
    components = []

    # Publications (0 → 0, 1 → 0.4, 3 → 0.7, 8+ → 1.0)
    pubs = signals.get('publications', 0)
    pub_score = min(1.0, math.log1p(pubs) / math.log1p(8))
    components.append(pub_score * 0.3)

    # GitHub contributions (0 → 0, 100 → 0.5, 500 → 0.8, 2000 → 1.0)
    github = signals.get('github_contributions', 0)
    github_score = min(1.0, math.log1p(github) / math.log1p(2000))
    components.append(github_score * 0.3)

    # Certifications (binary: has any cert → boost)
    has_portfolio = signals.get('has_portfolio', False)
    components.append(0.15 if has_portfolio else 0.0)

    # Recommendations
    has_recs = signals.get('has_recommendations', False)
    components.append(0.15 if has_recs else 0.0)

    # Open to work bonus
    open_to_work = signals.get('open_to_work', False)
    components.append(0.1 if open_to_work else 0.0)

    return min(1.0, sum(components))


def career_trajectory_score(signals: dict, years_of_experience: int) -> float:
    """
    Score career trajectory based on promotion velocity and tenure stability.
    
    - Fast promotions → higher score
    - Reasonable tenure (2-4 years avg) → optimal
    - Too short (<1 year) or too long (>6 years) → lower score
    
    Returns: Score between 0 and 1
    """
    promotions = signals.get('promotions', 0)
    avg_tenure = signals.get('avg_tenure_years', 3.0)

    # Promotion velocity: promotions per year (ideal ~0.3-0.5)
    if years_of_experience > 0:
        promo_rate = promotions / years_of_experience
    else:
        promo_rate = 0

    # Gaussian around ideal promo rate (0.3)
    promo_score = math.exp(-((promo_rate - 0.35) ** 2) / (2 * 0.15 ** 2))

    # Tenure stability: gaussian around ideal (2.5-3.5 years)
    tenure_score = math.exp(-((avg_tenure - 3.0) ** 2) / (2 * 1.5 ** 2))

    return 0.5 * promo_score + 0.5 * tenure_score


def compute_behavioral_scores(candidates: list[dict]) -> np.ndarray:
    """
    Compute composite behavioral scores for all candidates.
    
    Returns:
        numpy array of scores (0-1) for each candidate
    """
    n = len(candidates)
    scores = np.zeros(n)

    for i, cand in enumerate(candidates):
        signals = cand.get('behavioral_signals', {})
        years = cand.get('years_of_experience', 1)

        # Component scores
        completeness = profile_completeness_score(signals)
        recency = activity_recency_score(signals.get('days_since_active', 365))
        engage = engagement_score(signals)
        trajectory = career_trajectory_score(signals, years)

        # Weighted composite
        scores[i] = (
            0.20 * completeness +
            0.30 * recency +
            0.25 * engage +
            0.25 * trajectory
        )

    return scores
