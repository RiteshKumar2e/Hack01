"""
Pydantic schemas for the Intelligent Candidate Discovery API.
"""

from pydantic import BaseModel, Field
from typing import Optional


class Education(BaseModel):
    level: str
    university: str
    field: str


class ExperienceEntry(BaseModel):
    company: str
    title: str
    duration_years: int
    skills_used: list[str]


class BehavioralSignals(BaseModel):
    last_active: str
    days_since_active: int
    publications: int
    github_contributions: int
    profile_completeness: float
    has_portfolio: bool
    has_recommendations: bool
    promotions: int
    avg_tenure_years: float
    open_to_work: bool


class Candidate(BaseModel):
    id: str
    name: str
    title: str
    career_path: str
    location: str
    summary: str
    skills: list[str]
    years_of_experience: int
    education: Education
    experience: list[ExperienceEntry]
    certifications: list[str]
    behavioral_signals: BehavioralSignals


class ScoreBreakdown(BaseModel):
    """Interpretable breakdown of how the match score was computed."""
    bm25_score: float = Field(ge=0, le=100, description="Lexical BM25 relevance")
    tfidf_score: float = Field(ge=0, le=100, description="TF-IDF vector similarity")
    semantic_score: float = Field(ge=0, le=100, description="Sentence-BERT semantic similarity")
    experience_score: float = Field(ge=0, le=100, description="Experience level match")
    education_score: float = Field(ge=0, le=100, description="Education alignment")
    skill_overlap_score: float = Field(ge=0, le=100, description="Skill overlap (Jaccard)")
    behavioral_score: float = Field(ge=0, le=100, description="Behavioral engagement signals")
    location_score: float = Field(ge=0, le=100, description="Location preference match")


class RankedCandidate(BaseModel):
    """A candidate with their computed match score and breakdown."""
    candidate: Candidate
    match_score: float = Field(ge=0, le=100, description="Overall composite match score (0-100)")
    rank: int
    score_breakdown: ScoreBreakdown
    match_reasons: list[str] = Field(description="Human-readable reasons for this ranking")


class SearchRequest(BaseModel):
    """Request body for the ranking endpoint."""
    job_description: str = Field(min_length=20, description="Full job description text")
    job_title: Optional[str] = None
    preferred_skills: Optional[list[str]] = None
    required_experience_min: Optional[int] = None
    required_experience_max: Optional[int] = None
    required_education: Optional[str] = None
    preferred_location: Optional[str] = None
    top_k: int = Field(default=20, ge=1, le=200, description="Number of top candidates to return")


class SearchResponse(BaseModel):
    """Response from the ranking endpoint."""
    ranked_candidates: list[RankedCandidate]
    total_candidates_evaluated: int
    processing_time_ms: float
    job_insights: dict = Field(default_factory=dict, description="Extracted job requirements")


class JobDescription(BaseModel):
    """Sample job description model."""
    id: str
    title: str
    company: str
    location: str
    description: str
    required_experience_min: Optional[int] = None
    required_experience_max: Optional[int] = None
    required_education: Optional[str] = None
    preferred_skills: Optional[list[str]] = None
    seniority: Optional[str] = None


class CandidateInput(BaseModel):
    """Schema for adding a new candidate."""
    name: str
    title: str
    career_path: str
    location: str
    summary: str
    skills: list[str]
    years_of_experience: int
    education: Education
    experience: Optional[list[ExperienceEntry]] = []
    certifications: Optional[list[str]] = []

