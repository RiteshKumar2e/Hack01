import React, { useState, useEffect } from 'react';
import { fetchSampleJobs } from '../services/api';

const DEFAULT_SAMPLE_JOBS = [
  {
    "id": "JOB-001",
    "title": "Senior Machine Learning Engineer",
    "company": "TechCorp AI",
    "location": "San Francisco, CA / Remote",
    "description": "We are looking for a Senior Machine Learning Engineer to join our AI platform team. \nYou will design, build, and deploy production ML systems that serve millions of users.\n\nRequirements:\n- 5+ years of experience in machine learning engineering\n- Strong proficiency in Python, TensorFlow or PyTorch\n- Experience with NLP, transformer models, and large language models\n- Expertise in ML system design, model serving, and MLOps\n- Experience with cloud platforms (AWS/GCP) and containerization (Docker, Kubernetes)\n- Strong understanding of distributed systems and data pipelines\n- Published research or significant open-source contributions preferred\n\nNice to have:\n- Experience with recommendation systems or search ranking\n- Knowledge of reinforcement learning\n- Experience leading technical projects and mentoring junior engineers\n\nWe offer competitive compensation, equity, and the chance to work on cutting-edge AI problems.",
    "required_experience_min": 5,
    "required_experience_max": 12,
    "required_education": "Master's",
    "preferred_skills": [
      "Python",
      "TensorFlow",
      "PyTorch",
      "NLP",
      "Transformers",
      "MLOps",
      "Docker",
      "Kubernetes",
      "AWS",
      "Deep Learning"
    ],
    "seniority": "Senior"
  },
  {
    "id": "JOB-002",
    "title": "Data Scientist - Product Analytics",
    "company": "GrowthMetrics Inc",
    "location": "New York, NY",
    "description": "Join our data science team to drive product decisions through rigorous analysis and experimentation.\n\nYou will:\n- Design and analyze A/B tests to measure product feature impact\n- Build predictive models for user behavior, churn, and LTV\n- Partner with product managers to define metrics and KPIs\n- Create dashboards and automated reports for stakeholders\n- Develop causal inference models to understand user engagement\n\nRequirements:\n- 3+ years in data science or analytics role\n- Expert SQL skills and proficiency in Python (Pandas, NumPy, Scikit-learn)\n- Strong foundation in statistics, hypothesis testing, and experimental design\n- Experience with visualization tools (Tableau, Looker, or similar)\n- Excellent communication skills for presenting to non-technical audiences\n\nNice to have:\n- Experience with Bayesian methods and causal inference\n- Knowledge of machine learning for recommendation or personalization\n- MBA or business analytics background",
    "required_experience_min": 3,
    "required_experience_max": 8,
    "required_education": "Bachelor's",
    "preferred_skills": [
      "Python",
      "SQL",
      "Statistics",
      "A/B Testing",
      "Pandas",
      "Scikit-learn",
      "Tableau",
      "Hypothesis Testing",
      "Data Visualization"
    ],
    "seniority": "Mid"
  },
  {
    "id": "JOB-003",
    "title": "Staff Frontend Engineer - Design Systems",
    "company": "DesignFlow",
    "location": "Remote",
    "description": "We're seeking a Staff Frontend Engineer to lead our design system initiative and drive frontend architecture across the organization.\n\nResponsibilities:\n- Architect and maintain a company-wide design system and component library\n- Set technical standards for frontend development across 10+ product teams\n- Drive performance optimization initiatives (Core Web Vitals, bundle optimization)\n- Mentor senior and mid-level frontend engineers\n- Collaborate with UX designers to create accessible, responsive interfaces\n\nRequirements:\n- 7+ years of frontend development experience\n- Expert-level React and TypeScript skills\n- Deep knowledge of CSS architecture, design tokens, and component APIs\n- Experience building and maintaining design systems at scale\n- Strong understanding of web accessibility (WCAG 2.1 AA)\n- Experience with testing frameworks (Jest, Cypress, Playwright)\n\nNice to have:\n- Experience with micro-frontend architecture\n- Contributions to open-source design systems\n- Experience with Storybook and documentation tooling",
    "required_experience_min": 7,
    "required_experience_max": 15,
    "required_education": "Bachelor's",
    "preferred_skills": [
      "React",
      "TypeScript",
      "CSS3",
      "Design Systems",
      "Accessibility",
      "Jest",
      "Storybook",
      "Web Performance",
      "Responsive Design",
      "JavaScript"
    ],
    "seniority": "Staff"
  },
  {
    "id": "JOB-004",
    "title": "Cloud Security Engineer",
    "company": "SecureNet Solutions",
    "location": "Austin, TX",
    "description": "We need a Cloud Security Engineer to protect our multi-cloud infrastructure and ensure compliance across all environments.\n\nYou will:\n- Design and implement security controls across AWS and GCP environments\n- Conduct threat modeling and security architecture reviews\n- Build automated security scanning pipelines (SAST, DAST, container scanning)\n- Manage identity and access management (IAM) policies\n- Lead incident response and forensic investigations\n- Ensure compliance with SOC2, ISO 27001, and GDPR requirements\n\nRequirements:\n- 4+ years in security engineering with cloud focus\n- Deep expertise in AWS or GCP security services\n- Experience with container security (Docker, Kubernetes)\n- Knowledge of infrastructure-as-code security (Terraform, CloudFormation)\n- Familiarity with SIEM tools and security monitoring\n- CISSP, CEH, or equivalent certification preferred\n\nNice to have:\n- Experience with zero-trust architecture\n- Penetration testing skills\n- Programming experience in Python or Go",
    "required_experience_min": 4,
    "required_experience_max": 10,
    "required_education": "Bachelor's",
    "preferred_skills": [
      "AWS Security",
      "GCP Security",
      "Container Security",
      "IAM",
      "Terraform",
      "SIEM",
      "Penetration Testing",
      "Incident Response",
      "Compliance (SOC2, ISO27001)",
      "Python"
    ],
    "seniority": "Mid-Senior"
  },
  {
    "id": "JOB-005",
    "title": "Senior Data Engineer - Real-Time Platform",
    "company": "StreamData Inc",
    "location": "Seattle, WA / Remote",
    "description": "Build the next generation of our real-time data platform processing billions of events daily.\n\nResponsibilities:\n- Design and implement streaming data pipelines using Kafka and Flink\n- Build and maintain data lake architecture on cloud platforms\n- Develop data quality frameworks and monitoring solutions\n- Optimize query performance and cost across Snowflake and Spark clusters\n- Collaborate with ML teams to build feature stores and training pipelines\n\nRequirements:\n- 5+ years in data engineering\n- Expert-level SQL and Python skills\n- Deep experience with Apache Kafka, Spark, or Flink\n- Proficiency with cloud data warehouses (Snowflake, BigQuery, or Redshift)\n- Experience with workflow orchestration (Airflow, Dagster, or Prefect)\n- Strong understanding of data modeling and warehousing concepts\n\nNice to have:\n- Experience with dbt and analytics engineering\n- Knowledge of Delta Lake or Apache Iceberg\n- Experience building ML feature stores",
    "required_experience_min": 5,
    "required_experience_max": 12,
    "required_education": "Bachelor's",
    "preferred_skills": [
      "Python",
      "SQL",
      "Kafka",
      "Spark",
      "Flink",
      "Snowflake",
      "Airflow",
      "Data Modeling",
      "Docker",
      "AWS"
    ],
    "seniority": "Senior"
  },
  {
    "id": "JOB-006",
    "title": "Product Manager - AI/ML Platform",
    "company": "InnovateTech",
    "location": "Boston, MA",
    "description": "Lead the product vision for our AI/ML platform serving internal data science and engineering teams.\n\nYou will:\n- Define product strategy and roadmap for ML infrastructure tools\n- Partner with ML engineers to understand workflow pain points\n- Design intuitive interfaces for model training, deployment, and monitoring\n- Drive adoption metrics and measure platform impact on ML team velocity\n- Manage stakeholder relationships across engineering, data science, and leadership\n\nRequirements:\n- 5+ years of product management experience\n- Technical background (CS degree or engineering experience)\n- Understanding of ML/AI workflows and infrastructure\n- Experience with developer tools or platform products\n- Strong data analysis skills (SQL, basic Python)\n- Excellent written and verbal communication\n\nNice to have:\n- Hands-on ML or data science experience\n- Experience with MLOps tools (MLflow, Kubeflow, SageMaker)\n- Track record of launching 0-to-1 products",
    "required_experience_min": 5,
    "required_experience_max": 12,
    "required_education": "Bachelor's",
    "preferred_skills": [
      "Product Strategy",
      "Roadmap Planning",
      "SQL",
      "Python",
      "Agile",
      "Stakeholder Management",
      "Data Analysis",
      "User Research",
      "A/B Testing",
      "OKRs"
    ],
    "seniority": "Senior"
  },
  {
    "id": "JOB-007",
    "title": "Junior Frontend Developer (Fresher)",
    "company": "DesignFlow",
    "location": "Remote",
    "description": "We are seeking a Junior Frontend Developer to join our UI engineering team. This is an entry-level position perfect for freshers who want to build high-performance web applications using modern technologies.\n\nResponsibilities:\n- Build clean, interactive user interfaces with React and JavaScript\n- Collaborate with senior developers to implement design mockups using HTML and CSS\n- Learn frontend best practices, tooling, and version control (Git)\n\nRequirements:\n- 0-2 years of frontend experience (personal projects, bootcamps, or internships)\n- Good knowledge of HTML, CSS, and basic JavaScript\n- Familiarity with React and Git is a plus",
    "required_experience_min": 0,
    "required_experience_max": 2,
    "required_education": "Bachelor's",
    "preferred_skills": [
      "React",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Git",
      "Responsive Design"
    ],
    "seniority": "Junior (Fresher)"
  },
  {
    "id": "JOB-008",
    "title": "Associate Data Analyst (Fresher)",
    "company": "GrowthMetrics Inc",
    "location": "Austin, TX / Remote",
    "description": "We are looking for an Associate Data Analyst to join our product operations team. This entry-level role is ideal for freshers with strong analytical skills who want to translate data into actionable product decisions.\n\nResponsibilities:\n- Write SQL queries to extract data from our warehouses\n- Build dashboards and reports using Tableau or Excel\n- Assist in data cleaning, basic statistical analyses, and reporting\n\nRequirements:\n- 0-1 years of experience in data analysis or statistics\n- Basic SQL skills and familiarity with Excel\n- Familiarity with Python (Pandas) or R is a plus\n- Strong problem-solving skills",
    "required_experience_min": 0,
    "required_experience_max": 2,
    "required_education": "Bachelor's",
    "preferred_skills": [
      "SQL",
      "Excel",
      "Tableau",
      "Python",
      "Pandas",
      "Data Analysis"
    ],
    "seniority": "Junior (Fresher)"
  },
  {
    "id": "JOB-009",
    "title": "Junior Machine Learning Engineer (Fresher)",
    "company": "TechCorp AI",
    "location": "San Francisco, CA",
    "description": "We are looking for a Junior Machine Learning Engineer to support our AI model training and deployment pipelines. Ideal for freshers and entry-level practitioners with strong theoretical ML foundations.\n\nResponsibilities:\n- Prepare, clean, and preprocess large datasets for ML models\n- Help implement, train, and evaluate baseline ML and NLP models\n- Support senior engineers in model containerization and cloud operations\n\nRequirements:\n- 0-2 years of experience in Python and machine learning\n- Strong understanding of ML fundamentals (scikit-learn, regression, classification)\n- Academic or project experience with PyTorch or TensorFlow",
    "required_experience_min": 0,
    "required_experience_max": 2,
    "required_education": "Bachelor's",
    "preferred_skills": [
      "Python",
      "PyTorch",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Machine Learning"
    ],
    "seniority": "Junior (Fresher)"
  },
  {
    "id": "JOB-010",
    "title": "Full Stack Engineer (Experienced)",
    "company": "SaaSify Solutions",
    "location": "Chicago, IL / Remote",
    "description": "We are looking for a Full Stack Engineer with 2-5 years of industry experience. You will build and maintain robust end-to-end web features, from secure relational databases and RESTful APIs to fast React user interfaces.\n\nResponsibilities:\n- Architect and implement server-side APIs in Python (FastAPI/Django) or Node.js\n- Develop responsive web pages using React and TailwindCSS\n- Design relational database schemas and optimize SQL query performance\n\nRequirements:\n- 2-5 years of professional full-stack development experience\n- Strong proficiency in JavaScript/React and Python or Node.js\n- Experience with Docker and relational databases (PostgreSQL/MySQL)",
    "required_experience_min": 2,
    "required_experience_max": 5,
    "required_education": "Bachelor's",
    "preferred_skills": [
      "React",
      "Node.js",
      "Python",
      "PostgreSQL",
      "Docker",
      "REST APIs",
      "Git"
    ],
    "seniority": "Mid (Experienced)"
  }
];

export default function JobInput({ onSearch, loading }) {
  const [sampleJobs, setSampleJobs] = useState(DEFAULT_SAMPLE_JOBS);
  const [selectedJobId, setSelectedJobId] = useState('');
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [experienceMin, setExperienceMin] = useState('');
  const [experienceMax, setExperienceMax] = useState('');
  const [education, setEducation] = useState("Bachelor's");
  const [location, setLocation] = useState('');
  const [topK, setTopK] = useState(15);

  useEffect(() => {
    async function loadSamples() {
      try {
        const jobs = await fetchSampleJobs();
        if (jobs && jobs.length > 0) {
          setSampleJobs(jobs);
        }
      } catch (err) {
        console.error("Error loading sample jobs from API, using defaults:", err);
      }
    }
    loadSamples();
  }, []);

  const handleSampleChange = (e) => {
    const id = e.target.value;
    setSelectedJobId(id);
    if (!id) return;
    
    const selected = sampleJobs.find(j => j.id === id);
    if (selected) {
      setJobTitle(selected.title || '');
      setJobDescription(selected.description || '');
      setPreferredSkills(selected.preferred_skills ? selected.preferred_skills.join(', ') : '');
      setExperienceMin(selected.required_experience_min || '');
      setExperienceMax(selected.required_experience_max || '');
      setEducation(selected.required_education || "Bachelor's");
      setLocation(selected.location || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobDescription || jobDescription.trim().length < 20) {
      alert("Please enter a detailed job description (minimum 20 characters).");
      return;
    }
    
    const skillsList = preferredSkills
      ? preferredSkills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    onSearch({
      job_description: jobDescription,
      job_title: jobTitle,
      preferred_skills: skillsList,
      required_experience_min: experienceMin ? parseInt(experienceMin, 10) : null,
      required_experience_max: experienceMax ? parseInt(experienceMax, 10) : null,
      required_education: education,
      preferred_location: location,
      top_k: topK
    });
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <h3 style={styles.title}>Job Details</h3>
      <p style={styles.subtitle}>Enter job details or select a pre-configured template below.</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Template selector */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Template</label>
          <select 
            className="text-input" 
            value={selectedJobId} 
            onChange={handleSampleChange}
            style={styles.select}
          >
            <option value="">-- Choose a template --</option>
            {sampleJobs.map(job => (
              <option key={job.id} value={job.id}>{job.title} ({job.company})</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Target Job Title</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. Lead Deep Learning Specialist"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Detailed Job Description *</label>
          <textarea
            className="text-input"
            rows="7"
            placeholder="Paste complete job requirements, context, responsibilities here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            style={styles.textarea}
            required
          />
        </div>

        {/* Preferred Skills */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Preferred Skills (Comma separated)</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. PyTorch, MLOps, Docker, Transformers"
            value={preferredSkills}
            onChange={(e) => setPreferredSkills(e.target.value)}
          />
        </div>

        {/* Flex layout for experience */}
        <div style={styles.gridFields}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Min Exp (Years)</label>
            <input
              type="number"
              className="text-input"
              placeholder="e.g. 5"
              value={experienceMin}
              onChange={(e) => setExperienceMin(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Max Exp (Years)</label>
            <input
              type="number"
              className="text-input"
              placeholder="e.g. 10"
              value={experienceMax}
              onChange={(e) => setExperienceMax(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.gridFields}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Required Education</label>
            <select
              className="text-input"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              style={styles.select}
            >
              <option value="High School">High School</option>
              <option value="Associate">Associate</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="MBA">MBA</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Job Location</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. San Francisco, CA / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Top K */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Return Top Candidates</label>
          <input
            type="number"
            className="text-input"
            min="1"
            max="100"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value, 10))}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={styles.submitBtn} 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ marginRight: '0.5rem', width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }}></span>
              Analyzing & Ranking...
            </>
          ) : (
            'Analyze & Discover'
          )}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
    height: 'fit-content',
  },
  title: {
    fontSize: '1.1rem',
    marginBottom: '0.2rem',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    minHeight: '2.2rem',
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '0.2rem',
  },
  select: {
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238a8068' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.6rem center',
    backgroundSize: '0.9rem',
    paddingRight: '2rem',
  },
  textarea: {
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.4',
  },
  gridFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  submitBtn: {
    marginTop: '0.4rem',
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.9rem',
  }
};
