"""
Metadata Feature Scorer
Scores candidates based on structured profile metadata:
experience match, education alignment, skill overlap, location.
All scoring functions built from scratch.
"""

import math
import numpy as np


# Education hierarchy for comparison
EDUCATION_HIERARCHY = {
    "High School": 1,
    "Associate": 2,
    "Bachelor's": 3,
    "Master's": 4,
    "MBA": 4.5,
    "PhD": 5
}


def experience_score(
    candidate_years: int,
    required_min: int = None,
    required_max: int = None
) -> float:
    """
    Score experience match using gaussian decay around the ideal range.
    Perfect score within the range, exponential decay outside.
    
    Returns: Score between 0 and 1
    """
    if required_min is None and required_max is None:
        # No requirement specified — neutral score
        return 0.5

    if required_min is None:
        required_min = 0
    if required_max is None:
        required_max = required_min + 5

    # Perfect score within range
    if required_min <= candidate_years <= required_max:
        return 1.0

    # Gaussian decay outside range
    if candidate_years < required_min:
        diff = required_min - candidate_years
        sigma = 3.0  # decay rate
        return math.exp(-(diff ** 2) / (2 * sigma ** 2))
    else:  # candidate_years > required_max
        diff = candidate_years - required_max
        sigma = 5.0  # more lenient for over-qualified
        return math.exp(-(diff ** 2) / (2 * sigma ** 2))


def education_score(
    candidate_education: str,
    required_education: str = None
) -> float:
    """
    Score education alignment.
    Meeting or exceeding requirement = full score.
    Below = proportional penalty.
    
    Returns: Score between 0 and 1
    """
    if required_education is None:
        return 0.5

    candidate_level = EDUCATION_HIERARCHY.get(candidate_education, 2)
    required_level = EDUCATION_HIERARCHY.get(required_education, 2)

    if candidate_level >= required_level:
        return 1.0

    # Proportional score for lower education
    return max(0.2, candidate_level / required_level)


def skill_overlap_score(
    candidate_skills: list[str],
    preferred_skills: list[str] = None
) -> float:
    """
    Compute skill overlap using Jaccard-inspired similarity.
    Uses case-insensitive matching with fuzzy partial matching.
    
    Returns: Score between 0 and 1
    """
    if not preferred_skills:
        return 0.5

    # Normalize skills to lowercase
    candidate_set = {s.lower().strip() for s in candidate_skills}
    preferred_set = {s.lower().strip() for s in preferred_skills}

    if not preferred_set:
        return 0.5

    # Exact matches
    exact_matches = candidate_set & preferred_set

    # Fuzzy partial matches (substring matching)
    fuzzy_matches = set()
    for pref_skill in preferred_set - exact_matches:
        for cand_skill in candidate_set:
            if pref_skill in cand_skill or cand_skill in pref_skill:
                fuzzy_matches.add(pref_skill)
                break

    total_matches = len(exact_matches) + 0.7 * len(fuzzy_matches)
    
    # Score: proportion of preferred skills matched (not Jaccard to avoid penalizing extra skills)
    score = total_matches / len(preferred_set)
    return min(1.0, score)


def location_score(
    candidate_location: str,
    preferred_location: str = None
) -> float:
    """
    Score location match.
    Exact match or remote candidates score highest.
    Same-country gets partial credit.
    
    Returns: Score between 0 and 1
    """
    if not preferred_location:
        return 0.5

    cand = candidate_location.lower().strip()
    pref = preferred_location.lower().strip()

    # Remote is always a match
    if 'remote' in cand or 'remote' in pref:
        return 1.0

    # Exact match
    if cand == pref:
        return 1.0

    # Same city
    cand_city = cand.split(',')[0].strip()
    pref_city = pref.split(',')[0].strip()
    if cand_city == pref_city:
        return 0.9

    # Same state/country
    cand_parts = [p.strip() for p in cand.split(',')]
    pref_parts = [p.strip() for p in pref.split(',')]
    if len(cand_parts) > 1 and len(pref_parts) > 1:
        if cand_parts[-1] == pref_parts[-1]:
            return 0.6

    # Different location entirely
    return 0.3


def compute_metadata_scores(
    candidates: list[dict],
    required_experience_min: int = None,
    required_experience_max: int = None,
    required_education: str = None,
    preferred_skills: list[str] = None,
    preferred_location: str = None
) -> dict[str, np.ndarray]:
    """
    Compute all metadata-based scores for a list of candidates.
    
    Returns:
        Dictionary with numpy arrays for each score type
    """
    n = len(candidates)

    exp_scores = np.zeros(n)
    edu_scores = np.zeros(n)
    skill_scores = np.zeros(n)
    loc_scores = np.zeros(n)

    for i, cand in enumerate(candidates):
        exp_scores[i] = experience_score(
            cand.get('years_of_experience', 0),
            required_experience_min,
            required_experience_max
        )
        edu_scores[i] = education_score(
            cand.get('education', {}).get('level', 'Bachelor\'s'),
            required_education
        )
        skill_scores[i] = skill_overlap_score(
            cand.get('skills', []),
            preferred_skills
        )
        loc_scores[i] = location_score(
            cand.get('location', ''),
            preferred_location
        )

    return {
        'experience': exp_scores,
        'education': edu_scores,
        'skill_overlap': skill_scores,
        'location': loc_scores
    }
