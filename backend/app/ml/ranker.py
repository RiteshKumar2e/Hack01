"""
Learning-to-Rank Fusion Model
Combines all scoring signals into a final composite ranking.
Produces interpretable match scores with human-readable explanations.

Built from scratch — no off-the-shelf ranking libraries.
"""

import numpy as np


# Signal weights — tuned for optimal candidate ranking
# These weights determine how much each signal contributes to the final score
SIGNAL_WEIGHTS = {
    'semantic':       0.28,   # Semantic understanding is the most important signal
    'bm25':           0.15,   # Lexical relevance
    'tfidf':          0.07,   # Baseline text similarity
    'skill_overlap':  0.20,   # Direct skill matching
    'experience':     0.12,   # Experience level fit
    'education':      0.05,   # Education alignment
    'behavioral':     0.08,   # Engagement and activity
    'location':       0.05,   # Location preference
}


class FusionRanker:
    """
    Multi-signal fusion ranker that combines lexical, semantic,
    metadata, and behavioral scores into a final ranking.
    
    Features:
    - Configurable signal weights
    - Score normalization
    - Interpretable match reasons
    - Percentile-based final scoring
    """

    def __init__(self, weights: dict = None):
        self.weights = weights or SIGNAL_WEIGHTS
        # Ensure weights sum to 1.0
        total = sum(self.weights.values())
        self.weights = {k: v / total for k, v in self.weights.items()}

    def _normalize_scores(self, scores: np.ndarray) -> np.ndarray:
        """Min-max normalize scores to 0-1 range."""
        if scores.max() == scores.min():
            return np.full_like(scores, 0.5)
        return (scores - scores.min()) / (scores.max() - scores.min())

    def fuse(
        self,
        bm25_scores: np.ndarray,
        tfidf_scores: np.ndarray,
        semantic_scores: np.ndarray,
        experience_scores: np.ndarray,
        education_scores: np.ndarray,
        skill_overlap_scores: np.ndarray,
        behavioral_scores: np.ndarray,
        location_scores: np.ndarray
    ) -> tuple[np.ndarray, list[dict]]:
        """
        Fuse all signals into a final composite score.
        
        Returns:
            Tuple of (final_scores, score_breakdowns)
            - final_scores: numpy array of scores (0-100)
            - score_breakdowns: list of dicts with individual signal scores
        """
        n = len(bm25_scores)

        # Normalize all signals to 0-1
        norm_bm25 = self._normalize_scores(bm25_scores)
        norm_tfidf = self._normalize_scores(tfidf_scores)
        norm_semantic = self._normalize_scores(semantic_scores)
        norm_experience = experience_scores  # already 0-1
        norm_education = education_scores    # already 0-1
        norm_skill = skill_overlap_scores    # already 0-1
        norm_behavioral = behavioral_scores  # already 0-1
        norm_location = location_scores      # already 0-1

        # Weighted sum
        composite = (
            self.weights['bm25'] * norm_bm25 +
            self.weights['tfidf'] * norm_tfidf +
            self.weights['semantic'] * norm_semantic +
            self.weights['experience'] * norm_experience +
            self.weights['education'] * norm_education +
            self.weights['skill_overlap'] * norm_skill +
            self.weights['behavioral'] * norm_behavioral +
            self.weights['location'] * norm_location
        )

        # Scale to 0-100 using percentile-based mapping
        # This ensures nice spread across the score range
        if composite.max() > composite.min():
            final_scores = 15 + 85 * (composite - composite.min()) / (composite.max() - composite.min())
        else:
            final_scores = np.full(n, 50.0)

        # Build score breakdowns
        breakdowns = []
        for i in range(n):
            breakdowns.append({
                'bm25_score': round(float(norm_bm25[i]) * 100, 1),
                'tfidf_score': round(float(norm_tfidf[i]) * 100, 1),
                'semantic_score': round(float(norm_semantic[i]) * 100, 1),
                'experience_score': round(float(norm_experience[i]) * 100, 1),
                'education_score': round(float(norm_education[i]) * 100, 1),
                'skill_overlap_score': round(float(norm_skill[i]) * 100, 1),
                'behavioral_score': round(float(norm_behavioral[i]) * 100, 1),
                'location_score': round(float(norm_location[i]) * 100, 1),
            })

        return np.round(final_scores, 1), breakdowns

    def generate_match_reasons(
        self,
        candidate: dict,
        breakdown: dict,
        preferred_skills: list[str] = None
    ) -> list[str]:
        """
        Generate human-readable reasons for why this candidate ranks well.
        Uses the score breakdown to identify top contributing factors.
        """
        reasons = []

        # Semantic match
        if breakdown['semantic_score'] >= 70:
            reasons.append("🎯 Strong semantic match — profile aligns closely with job requirements")
        elif breakdown['semantic_score'] >= 50:
            reasons.append("📊 Moderate semantic relevance to the role description")

        # Skill overlap
        if breakdown['skill_overlap_score'] >= 80:
            if preferred_skills:
                cand_skills = {s.lower() for s in candidate.get('skills', [])}
                matched = [s for s in preferred_skills if s.lower() in cand_skills]
                if matched:
                    reasons.append(f"💡 {len(matched)}/{len(preferred_skills)} required skills matched: {', '.join(matched[:5])}")
            else:
                reasons.append("💡 Excellent skill overlap with requirements")
        elif breakdown['skill_overlap_score'] >= 50:
            reasons.append("🔧 Good skill coverage for this position")

        # Experience
        if breakdown['experience_score'] >= 80:
            years = candidate.get('years_of_experience', 0)
            reasons.append(f"📈 {years} years of experience — ideal fit for seniority level")
        elif breakdown['experience_score'] >= 60:
            reasons.append("📊 Experience level is a reasonable match")

        # Education
        if breakdown['education_score'] >= 80:
            edu = candidate.get('education', {})
            reasons.append(f"🎓 {edu.get('level', '')} in {edu.get('field', '')} meets/exceeds requirements")

        # Behavioral signals
        if breakdown['behavioral_score'] >= 70:
            signals = candidate.get('behavioral_signals', {})
            signal_parts = []
            if signals.get('days_since_active', 999) < 14:
                signal_parts.append("recently active")
            if signals.get('publications', 0) > 0:
                signal_parts.append(f"{signals['publications']} publications")
            if signals.get('github_contributions', 0) > 100:
                signal_parts.append(f"{signals['github_contributions']} GitHub contributions")
            if signals.get('open_to_work', False):
                signal_parts.append("open to opportunities")
            if signal_parts:
                reasons.append(f"🚀 Strong engagement: {', '.join(signal_parts)}")

        # BM25 / keyword match
        if breakdown['bm25_score'] >= 70:
            reasons.append("🔍 High keyword relevance — profile uses terminology matching the job description")

        # Location
        if breakdown['location_score'] >= 80:
            reasons.append(f"📍 Location match: {candidate.get('location', 'N/A')}")

        # Ensure at least one reason
        if not reasons:
            reasons.append("📋 Candidate profile has some relevance to this position")

        return reasons
