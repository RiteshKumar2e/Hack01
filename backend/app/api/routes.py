"""
API Routes for the Intelligent Candidate Discovery system.
"""

from fastapi import APIRouter, HTTPException
from ..schemas import (
    SearchRequest, SearchResponse, RankedCandidate, ScoreBreakdown,
    Candidate, Education, ExperienceEntry, BehavioralSignals, JobDescription,
    CandidateInput
)
from ..db import save_candidate, clear_all_candidates, get_all_candidates

router = APIRouter(prefix="/api", tags=["ranking"])

# Reference to the global pipeline (set by main.py)
_pipeline = None
_candidates = None
_sample_jobs = None


def set_pipeline(pipeline, candidates, sample_jobs):
    """Set global references to the pipeline and data."""
    global _pipeline, _candidates, _sample_jobs
    _pipeline = pipeline
    _candidates = candidates
    _sample_jobs = sample_jobs


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "pipeline_ready": _pipeline is not None and _pipeline._initialized,
        "total_candidates": len(_candidates) if _candidates else 0
    }


@router.post("/rank", response_model=SearchResponse)
async def rank_candidates(request: SearchRequest):
    """
    Main ranking endpoint.
    Accepts a job description and returns ranked candidates with score breakdowns.
    """
    if not _pipeline or not _pipeline._initialized:
        raise HTTPException(status_code=503, detail="Pipeline not initialized yet")

    try:
        result = _pipeline.rank(
            job_description=request.job_description,
            job_title=request.job_title,
            preferred_skills=request.preferred_skills,
            required_experience_min=request.required_experience_min,
            required_experience_max=request.required_experience_max,
            required_education=request.required_education,
            preferred_location=request.preferred_location,
            top_k=request.top_k
        )

        # Convert to response models
        ranked = []
        for item in result['ranked_candidates']:
            cand_data = item['candidate']
            breakdown_data = item['score_breakdown']

            candidate = Candidate(
                id=cand_data['id'],
                name=cand_data['name'],
                title=cand_data['title'],
                career_path=cand_data['career_path'],
                location=cand_data['location'],
                summary=cand_data['summary'],
                skills=cand_data['skills'],
                years_of_experience=cand_data['years_of_experience'],
                education=Education(**cand_data['education']),
                experience=[ExperienceEntry(**e) for e in cand_data['experience']],
                certifications=cand_data['certifications'],
                behavioral_signals=BehavioralSignals(**cand_data['behavioral_signals'])
            )

            ranked.append(RankedCandidate(
                candidate=candidate,
                match_score=item['match_score'],
                rank=item['rank'],
                score_breakdown=ScoreBreakdown(**breakdown_data),
                match_reasons=item['match_reasons']
            ))

        return SearchResponse(
            ranked_candidates=ranked,
            total_candidates_evaluated=result['total_candidates_evaluated'],
            processing_time_ms=result['processing_time_ms'],
            job_insights=result['job_insights']
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ranking error: {str(e)}")


@router.get("/candidates")
async def list_candidates(skip: int = 0, limit: int = 50):
    """List all candidates with pagination."""
    global _candidates
    _candidates = get_all_candidates()
    if not _candidates:
        return {"candidates": [], "total": 0}

    total = len(_candidates)
    page = _candidates[skip:skip + limit]
    return {
        "candidates": page,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/candidates/{candidate_id}")
async def get_candidate(candidate_id: str):
    """Get a single candidate by ID."""
    global _candidates
    _candidates = get_all_candidates()
    if not _candidates:
        raise HTTPException(status_code=404, detail="No candidates loaded")

    for cand in _candidates:
        if cand['id'] == candidate_id:
            return cand

    raise HTTPException(status_code=404, detail=f"Candidate {candidate_id} not found")


@router.get("/sample-jobs", response_model=list[JobDescription])
async def get_sample_jobs():
    """Return sample job descriptions for testing."""
    if not _sample_jobs:
        return []
    return [JobDescription(**j) for j in _sample_jobs]


@router.post("/candidates", response_model=Candidate)
async def add_candidate(cand_input: CandidateInput):
    """Add a new candidate to the pool and re-index."""
    import datetime
    
    global _candidates
    if _candidates is None:
        _candidates = []
        
    # Generate unique ID
    new_id = f"CAND-{(len(_candidates) + 1):04d}"
    
    # Generate default behavioral signals
    now_str = datetime.datetime.now().isoformat()
    default_signals = {
        "last_active": now_str,
        "days_since_active": 0,
        "publications": 0,
        "github_contributions": 50,
        "profile_completeness": 1.0,
        "has_portfolio": True,
        "has_recommendations": True,
        "promotions": 0,
        "avg_tenure_years": float(cand_input.years_of_experience),
        "open_to_work": True
    }
    
    new_cand = {
        "id": new_id,
        "name": cand_input.name,
        "title": cand_input.title,
        "career_path": cand_input.career_path,
        "location": cand_input.location,
        "summary": cand_input.summary,
        "skills": cand_input.skills,
        "years_of_experience": cand_input.years_of_experience,
        "education": cand_input.education.model_dump(),
        "experience": [exp.model_dump() for exp in cand_input.experience] if cand_input.experience else [],
        "certifications": cand_input.certifications if cand_input.certifications else [],
        "behavioral_signals": default_signals
    }
    
    # Persist to Turso Database
    save_candidate(new_cand)
    
    # Reload candidates to keep in-memory list synchronized
    _candidates = get_all_candidates()
        
    # Re-initialize ML pipeline
    if _pipeline:
        try:
            _pipeline.initialize(_candidates)
        except Exception as e:
            pass
            
    return new_cand


@router.post("/candidates/clear")
async def clear_candidates():
    """Clear all candidates from the pool and re-index."""
    global _candidates
    
    # Clear Turso Database
    clear_all_candidates()
    
    _candidates = []
        
    # Re-initialize ML pipeline with 0 candidates
    if _pipeline:
        try:
            _pipeline.initialize([])
        except Exception as e:
            pass
            
    return {"status": "success", "message": "Candidate pool cleared"}
