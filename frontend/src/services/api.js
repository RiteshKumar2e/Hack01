const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Backend health check failed');
  }
  return response.json();
}

export async function fetchSampleJobs() {
  const response = await fetch(`${API_BASE_URL}/sample-jobs`);
  if (!response.ok) {
    throw new Error('Failed to load sample jobs');
  }
  return response.json();
}

export async function rankCandidates({
  job_description,
  job_title,
  preferred_skills,
  required_experience_min,
  required_experience_max,
  required_education,
  preferred_location,
  top_k = 20
}) {
  const payload = {
    job_description,
    job_title: job_title || undefined,
    preferred_skills: preferred_skills && preferred_skills.length > 0 ? preferred_skills : undefined,
    required_experience_min: required_experience_min !== null && required_experience_min !== undefined ? parseInt(required_experience_min, 10) : undefined,
    required_experience_max: required_experience_max !== null && required_experience_max !== undefined ? parseInt(required_experience_max, 10) : undefined,
    required_education: required_education || undefined,
    preferred_location: preferred_location || undefined,
    top_k
  };

  const response = await fetch(`${API_BASE_URL}/rank`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to rank candidates');
  }

  return response.json();
}

export async function fetchCandidates(skip = 0, limit = 50) {
  const response = await fetch(`${API_BASE_URL}/candidates?skip=${skip}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch candidates');
  }
  return response.json();
}

export async function fetchCandidateDetails(id) {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch candidate details for ${id}`);
  }
  return response.json();
}

export async function addCandidate(candidateData) {
  const response = await fetch(`${API_BASE_URL}/candidates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(candidateData)
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to add candidate');
  }
  return response.json();
}

export async function clearCandidates() {
  const response = await fetch(`${API_BASE_URL}/candidates/clear`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to clear candidate pool');
  }
  return response.json();
}

