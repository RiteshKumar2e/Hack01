"""
Synthetic Candidate Data Generator
Generates realistic candidate profiles with diverse career paths,
skills, behavioral signals, and metadata.
"""

import json
import random
import os
from datetime import datetime, timedelta

# ─── Configuration ───────────────────────────────────────────────
CANDIDATE_COUNT = 200

FIRST_NAMES = [
    "Aarav", "Aditi", "Aiden", "Aisha", "Alex", "Amara", "Amit", "Ana",
    "Andrew", "Angela", "Arjun", "Bella", "Benjamin", "Carlos", "Charlotte",
    "Chen", "Chloe", "Daniel", "David", "Diana", "Elena", "Elijah",
    "Emily", "Ethan", "Fatima", "Gabriel", "Grace", "Hassan", "Hiroshi",
    "Isabella", "James", "Jasmine", "Jayden", "Jessica", "Jordan", "Julia",
    "Kai", "Karen", "Kavya", "Liam", "Lily", "Lucas", "Luna", "Maria",
    "Maya", "Michael", "Mila", "Mohammed", "Nadia", "Nathan", "Neha",
    "Noah", "Nora", "Oliver", "Olivia", "Omar", "Priya", "Quinn",
    "Rachel", "Raj", "Ryan", "Sakura", "Samuel", "Sara", "Sasha",
    "Sofia", "Sophia", "Suki", "Tanya", "Thomas", "Uma", "Victor",
    "Wei", "William", "Xander", "Yara", "Yuki", "Zara", "Zoe"
]

LAST_NAMES = [
    "Anderson", "Bhat", "Brown", "Carter", "Chang", "Chen", "Cohen",
    "Das", "Davis", "Fernandez", "Garcia", "Gupta", "Harris", "Ito",
    "Jackson", "Johnson", "Jones", "Kapoor", "Kim", "Kumar", "Lee",
    "Li", "Lopez", "Martin", "Martinez", "Miller", "Moore", "Mukherjee",
    "Nakamura", "Nguyen", "Patel", "Perez", "Petrov", "Rahman", "Rao",
    "Robinson", "Rodriguez", "Sato", "Sharma", "Singh", "Smith",
    "Tanaka", "Taylor", "Thomas", "Thompson", "Wang", "White",
    "Williams", "Wilson", "Wong", "Wright", "Yamamoto", "Zhang"
]

LOCATIONS = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
    "Boston, MA", "Chicago, IL", "Denver, CO", "Los Angeles, CA",
    "Portland, OR", "Miami, FL", "Atlanta, GA", "Bangalore, India",
    "London, UK", "Berlin, Germany", "Toronto, Canada", "Singapore",
    "Sydney, Australia", "Tel Aviv, Israel", "Remote", "Hyderabad, India",
    "Dublin, Ireland", "Amsterdam, Netherlands", "Stockholm, Sweden",
    "Paris, France", "Tokyo, Japan"
]

EDUCATION_LEVELS = ["High School", "Associate", "Bachelor's", "Master's", "PhD", "MBA"]

UNIVERSITIES = [
    "MIT", "Stanford University", "Carnegie Mellon", "UC Berkeley",
    "Georgia Tech", "University of Michigan", "IIT Bombay", "IIT Delhi",
    "University of Toronto", "Oxford University", "ETH Zurich",
    "National University of Singapore", "University of Washington",
    "Caltech", "Columbia University", "Harvard University",
    "University of Illinois", "Purdue University", "UCLA",
    "University of Texas Austin", "BITS Pilani", "NIT Trichy",
    "Imperial College London", "TU Munich", "University of Waterloo"
]

# ─── Career Archetypes ──────────────────────────────────────────

CAREER_PATHS = {
    "ml_engineer": {
        "titles": [
            "Machine Learning Engineer", "ML Engineer", "AI/ML Engineer",
            "Deep Learning Engineer", "Applied ML Engineer", "MLOps Engineer",
            "ML Infrastructure Engineer"
        ],
        "skills": [
            "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Deep Learning",
            "NLP", "Computer Vision", "MLOps", "Docker", "Kubernetes",
            "AWS SageMaker", "Feature Engineering", "Model Deployment",
            "A/B Testing", "Data Pipelines", "Spark", "SQL", "Git",
            "Transformers", "BERT", "GPT", "Neural Networks", "CNNs", "RNNs",
            "Reinforcement Learning", "GANs", "AutoML", "Hugging Face",
            "ONNX", "TensorRT", "Triton", "MLflow", "Kubeflow", "Airflow"
        ],
        "summary_templates": [
            "Experienced ML engineer with {years}+ years building production-grade machine learning systems. Specialized in {spec1} and {spec2}. Passionate about scaling ML models from research to production.",
            "AI/ML engineer focused on {spec1} with deep expertise in {spec2}. Built end-to-end ML pipelines serving millions of predictions daily. Strong background in distributed systems.",
            "Machine learning practitioner with {years}+ years of experience in {spec1}. Led teams building {spec2} solutions that improved key business metrics by 30%+. Published research at top-tier venues."
        ],
        "specializations": [
            "natural language processing", "computer vision", "recommendation systems",
            "time series forecasting", "speech recognition", "generative AI",
            "search and ranking", "fraud detection", "autonomous systems"
        ]
    },
    "data_scientist": {
        "titles": [
            "Data Scientist", "Senior Data Scientist", "Staff Data Scientist",
            "Lead Data Scientist", "Principal Data Scientist",
            "Data Scientist - NLP", "Data Scientist - Analytics"
        ],
        "skills": [
            "Python", "R", "SQL", "Pandas", "NumPy", "Scikit-learn",
            "Statistics", "A/B Testing", "Hypothesis Testing", "Bayesian Methods",
            "Time Series Analysis", "Regression", "Classification", "Clustering",
            "Tableau", "Power BI", "Jupyter", "Feature Engineering", "EDA",
            "Causal Inference", "Experimental Design", "XGBoost", "LightGBM",
            "Data Visualization", "Matplotlib", "Seaborn", "Plotly",
            "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch"
        ],
        "summary_templates": [
            "Data scientist with {years}+ years driving business decisions through data. Expert in {spec1} and {spec2}. Track record of translating complex analyses into actionable insights.",
            "Analytical data scientist specializing in {spec1}. Built predictive models for {spec2} that generated $10M+ in revenue impact. Strong communicator bridging technical and business teams.",
            "Full-stack data scientist with {years}+ years experience in {spec1} and {spec2}. Proficient in end-to-end project lifecycle from data collection to model deployment."
        ],
        "specializations": [
            "customer analytics", "product analytics", "marketing analytics",
            "pricing optimization", "demand forecasting", "churn prediction",
            "user behavior modeling", "experimentation platforms", "causal inference"
        ]
    },
    "frontend_engineer": {
        "titles": [
            "Frontend Engineer", "Senior Frontend Developer", "UI Engineer",
            "React Developer", "Frontend Architect", "Web Developer",
            "Full-Stack Developer"
        ],
        "skills": [
            "JavaScript", "TypeScript", "React", "Vue.js", "Angular",
            "Next.js", "HTML5", "CSS3", "Tailwind CSS", "SASS",
            "Redux", "GraphQL", "REST APIs", "Node.js", "Webpack",
            "Vite", "Jest", "Cypress", "Storybook", "Figma",
            "Responsive Design", "Accessibility", "Web Performance",
            "PWA", "WebSockets", "Service Workers", "D3.js",
            "Three.js", "Animation", "Micro-frontends"
        ],
        "summary_templates": [
            "Frontend engineer with {years}+ years crafting performant, accessible web applications. Deep expertise in {spec1} and {spec2}. Passionate about user experience and design systems.",
            "UI engineer specializing in {spec1} with extensive experience in {spec2}. Built component libraries serving 50+ engineers. Strong eye for design and performance optimization.",
            "Full-stack developer with frontend focus, {years}+ years experience. Expert in {spec1} and {spec2}. Advocate for web accessibility and modern development practices."
        ],
        "specializations": [
            "React ecosystem", "design systems", "web performance optimization",
            "accessibility (a11y)", "real-time applications", "data visualization",
            "progressive web apps", "micro-frontend architecture", "animation and interaction"
        ]
    },
    "backend_engineer": {
        "titles": [
            "Backend Engineer", "Senior Backend Developer", "Platform Engineer",
            "Server-Side Engineer", "API Engineer", "Systems Engineer",
            "Distributed Systems Engineer"
        ],
        "skills": [
            "Python", "Java", "Go", "Rust", "Node.js", "C++",
            "PostgreSQL", "MongoDB", "Redis", "Kafka", "RabbitMQ",
            "Docker", "Kubernetes", "AWS", "GCP", "Azure",
            "Microservices", "REST", "gRPC", "GraphQL", "SQL",
            "System Design", "CI/CD", "Terraform", "Linux",
            "Nginx", "Load Balancing", "Caching", "Message Queues",
            "Elasticsearch", "Prometheus", "Grafana"
        ],
        "summary_templates": [
            "Backend engineer with {years}+ years building scalable distributed systems. Expert in {spec1} and {spec2}. Experience handling systems processing millions of requests per second.",
            "Platform engineer specializing in {spec1}. Built {spec2} serving 100M+ users. Strong advocate for clean architecture, observability, and reliability engineering.",
            "Systems engineer with {years}+ years of experience in {spec1} and {spec2}. Designed and implemented core infrastructure powering high-traffic applications."
        ],
        "specializations": [
            "microservices architecture", "distributed databases", "event-driven systems",
            "API design", "cloud infrastructure", "real-time data processing",
            "high-availability systems", "security and authentication", "DevOps"
        ]
    },
    "product_manager": {
        "titles": [
            "Product Manager", "Senior Product Manager", "Group Product Manager",
            "Technical Product Manager", "Product Lead", "Director of Product",
            "VP of Product"
        ],
        "skills": [
            "Product Strategy", "Roadmap Planning", "User Research",
            "A/B Testing", "Data Analysis", "SQL", "Agile", "Scrum",
            "Jira", "Figma", "Stakeholder Management", "OKRs",
            "Market Analysis", "Competitive Analysis", "PRDs",
            "Cross-functional Leadership", "Go-to-Market Strategy",
            "Pricing Strategy", "Customer Discovery", "Wireframing",
            "Analytics", "Metrics-Driven Development", "Python",
            "Tableau", "Growth Hacking", "User Stories"
        ],
        "summary_templates": [
            "Product manager with {years}+ years driving 0-to-1 products in {spec1}. Expert in {spec2}. Track record of launching products used by millions of users worldwide.",
            "Technical PM with engineering background, {years}+ years in {spec1}. Led cross-functional teams building {spec2} products. Data-driven decision maker with strong user empathy.",
            "Strategic product leader with {years}+ years experience in {spec1} and {spec2}. Grew product revenue by 300% through data-driven experimentation and customer insight."
        ],
        "specializations": [
            "SaaS platforms", "mobile applications", "marketplace products",
            "developer tools", "enterprise software", "consumer apps",
            "fintech products", "healthcare technology", "AI/ML products"
        ]
    },
    "devops_engineer": {
        "titles": [
            "DevOps Engineer", "Site Reliability Engineer", "SRE",
            "Cloud Engineer", "Infrastructure Engineer", "Platform Engineer",
            "Release Engineer"
        ],
        "skills": [
            "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
            "Ansible", "Jenkins", "GitHub Actions", "GitLab CI",
            "Linux", "Bash", "Python", "Go", "Prometheus", "Grafana",
            "ELK Stack", "Datadog", "PagerDuty", "Helm", "ArgoCD",
            "Istio", "Consul", "Vault", "CloudFormation", "Pulumi",
            "Networking", "Security", "IAM", "Cost Optimization"
        ],
        "summary_templates": [
            "DevOps engineer with {years}+ years building and maintaining cloud infrastructure at scale. Expert in {spec1} and {spec2}. Reduced deployment times by 80% through automation.",
            "SRE with {years}+ years ensuring 99.99% uptime for mission-critical systems. Specialized in {spec1} and {spec2}. Built observability platforms from the ground up.",
            "Cloud infrastructure engineer with deep expertise in {spec1}. Managed {spec2} serving petabytes of data. Passionate about infrastructure-as-code and GitOps."
        ],
        "specializations": [
            "Kubernetes orchestration", "CI/CD pipelines", "cloud migration",
            "observability and monitoring", "infrastructure as code", "cost optimization",
            "security hardening", "disaster recovery", "multi-cloud strategy"
        ]
    },
    "data_engineer": {
        "titles": [
            "Data Engineer", "Senior Data Engineer", "Staff Data Engineer",
            "Analytics Engineer", "Data Platform Engineer", "ETL Developer",
            "Big Data Engineer"
        ],
        "skills": [
            "Python", "SQL", "Spark", "Airflow", "Kafka", "dbt",
            "Snowflake", "BigQuery", "Redshift", "Databricks",
            "AWS", "GCP", "Azure", "Hadoop", "Hive", "Presto",
            "Data Modeling", "ETL", "ELT", "Data Warehousing",
            "Data Lakes", "Streaming", "Flink", "Delta Lake",
            "Parquet", "Avro", "Schema Registry", "Great Expectations",
            "Docker", "Kubernetes", "Terraform"
        ],
        "summary_templates": [
            "Data engineer with {years}+ years building data platforms processing terabytes daily. Expert in {spec1} and {spec2}. Enabled self-serve analytics for 200+ business users.",
            "Analytics engineer specializing in {spec1}. Built {spec2} pipelines reducing data latency from hours to minutes. Strong advocate for data quality and governance.",
            "Big data engineer with {years}+ years experience in {spec1} and {spec2}. Designed data architectures serving ML teams and business analysts across the organization."
        ],
        "specializations": [
            "real-time streaming", "data warehousing", "data lake architecture",
            "ETL/ELT pipelines", "data quality frameworks", "data governance",
            "analytics engineering", "ML feature stores", "cost-efficient data processing"
        ]
    },
    "ux_designer": {
        "titles": [
            "UX Designer", "Senior UX Designer", "Product Designer",
            "UI/UX Designer", "Design Lead", "Interaction Designer",
            "UX Researcher"
        ],
        "skills": [
            "Figma", "Sketch", "Adobe XD", "InVision", "Prototyping",
            "User Research", "Usability Testing", "Wireframing",
            "Information Architecture", "Design Systems", "HTML/CSS",
            "Accessibility", "Typography", "Color Theory",
            "Motion Design", "Interaction Design", "Visual Design",
            "User Interviews", "Journey Mapping", "Persona Development",
            "A/B Testing", "Analytics", "Miro", "FigJam",
            "Design Thinking", "Responsive Design"
        ],
        "summary_templates": [
            "UX designer with {years}+ years creating intuitive digital experiences. Specialized in {spec1} and {spec2}. Designed products used by 50M+ users with measurable UX improvements.",
            "Product designer with a human-centered approach, {years}+ years in {spec1}. Led redesigns achieving {spec2}. Passionate about accessibility and inclusive design.",
            "Design leader with {years}+ years experience in {spec1} and {spec2}. Built and mentored design teams. Advocate for research-driven design and systematic approaches."
        ],
        "specializations": [
            "mobile app design", "enterprise UX", "design systems",
            "user research", "accessibility", "data visualization design",
            "conversational UI", "e-commerce experiences", "SaaS platforms"
        ]
    },
    "security_engineer": {
        "titles": [
            "Security Engineer", "Application Security Engineer",
            "Cloud Security Engineer", "Cybersecurity Analyst",
            "Penetration Tester", "Security Architect", "InfoSec Engineer"
        ],
        "skills": [
            "Penetration Testing", "OWASP", "Burp Suite", "Nmap",
            "Python", "Bash", "Network Security", "Cryptography",
            "IAM", "Zero Trust", "SIEM", "SOC", "Incident Response",
            "Threat Modeling", "Vulnerability Assessment", "AWS Security",
            "GCP Security", "Container Security", "SAST", "DAST",
            "Compliance (SOC2, ISO27001)", "Security Automation",
            "Forensics", "Malware Analysis", "Kubernetes Security",
            "API Security", "OAuth", "SAML", "PKI"
        ],
        "summary_templates": [
            "Security engineer with {years}+ years protecting critical infrastructure. Expert in {spec1} and {spec2}. Identified and remediated vulnerabilities saving millions in potential losses.",
            "AppSec engineer specializing in {spec1}. Built {spec2} programs from scratch. Led security reviews for Fortune 500 companies and high-growth startups.",
            "Cybersecurity professional with {years}+ years experience in {spec1} and {spec2}. Designed security architectures for regulated industries. Active contributor to open-source security tools."
        ],
        "specializations": [
            "application security", "cloud security", "penetration testing",
            "incident response", "security automation", "compliance and governance",
            "container security", "API security", "threat intelligence"
        ]
    },
    "mobile_developer": {
        "titles": [
            "Mobile Developer", "iOS Developer", "Android Developer",
            "React Native Developer", "Flutter Developer",
            "Senior Mobile Engineer", "Mobile Architect"
        ],
        "skills": [
            "Swift", "Kotlin", "React Native", "Flutter", "Dart",
            "iOS", "Android", "Xcode", "Android Studio", "SwiftUI",
            "Jetpack Compose", "UIKit", "Core Data", "Room",
            "REST APIs", "GraphQL", "Firebase", "Push Notifications",
            "App Store Optimization", "CI/CD", "Fastlane", "TestFlight",
            "Unit Testing", "UI Testing", "Accessibility",
            "Performance Optimization", "Offline-first", "Bluetooth/BLE"
        ],
        "summary_templates": [
            "Mobile developer with {years}+ years building high-quality apps. Expert in {spec1} and {spec2}. Published apps with 5M+ downloads and 4.8+ star ratings.",
            "Cross-platform mobile engineer specializing in {spec1}. Built {spec2} applications for Fortune 500 clients. Passionate about smooth animations and pixel-perfect UI.",
            "Native mobile developer with {years}+ years experience in {spec1} and {spec2}. Led mobile teams shipping bi-weekly releases with zero critical bugs."
        ],
        "specializations": [
            "iOS native development", "Android native development", "cross-platform (Flutter)",
            "cross-platform (React Native)", "mobile performance optimization",
            "offline-first architecture", "real-time communication apps",
            "fintech mobile apps", "health and fitness apps"
        ]
    }
}

CERTIFICATIONS = [
    "AWS Solutions Architect", "AWS Machine Learning Specialty",
    "Google Cloud Professional Data Engineer", "Google Cloud ML Engineer",
    "Azure Data Scientist Associate", "CKA (Kubernetes Admin)",
    "Terraform Associate", "PMP", "Scrum Master (CSM)",
    "CISSP", "CEH", "CompTIA Security+", "CKAD",
    "Google Analytics", "HubSpot Inbound", "Databricks Certified",
    "dbt Analytics Engineering", "Meta Frontend Developer",
    "Google UX Design", "IBM Data Science Professional"
]

COMPANIES = [
    "Google", "Meta", "Amazon", "Apple", "Microsoft", "Netflix",
    "Stripe", "Airbnb", "Uber", "Spotify", "Shopify", "Salesforce",
    "Adobe", "LinkedIn", "Twitter/X", "Snap", "Pinterest", "Dropbox",
    "Slack", "Atlassian", "Datadog", "Snowflake", "Databricks",
    "Palantir", "Coinbase", "Robinhood", "Square/Block", "Instacart",
    "DoorDash", "Lyft", "MongoDB", "Elastic", "Confluent",
    "HashiCorp", "Cloudflare", "CrowdStrike", "Zscaler",
    "Accenture", "Deloitte", "McKinsey", "TCS", "Infosys", "Wipro",
    "Thoughtworks", "Nvidia", "Intel", "AMD", "Samsung", "Siemens"
]


def _generate_experience(career_path: str, years: int) -> list:
    """Generate realistic work experience entries."""
    path_config = CAREER_PATHS[career_path]
    experiences = []
    remaining_years = years

    while remaining_years > 0:
        duration = min(random.randint(1, 4), remaining_years)
        company = random.choice(COMPANIES)
        title = random.choice(path_config["titles"])
        skills_used = random.sample(path_config["skills"], min(5, len(path_config["skills"])))

        experiences.append({
            "company": company,
            "title": title,
            "duration_years": duration,
            "skills_used": skills_used
        })
        remaining_years -= duration

    return experiences


def _generate_candidate(candidate_id: int) -> dict:
    """Generate a single synthetic candidate profile."""
    career_path = random.choice(list(CAREER_PATHS.keys()))
    path_config = CAREER_PATHS[career_path]

    years_of_experience = random.randint(1, 20)
    education = random.choice(EDUCATION_LEVELS)
    num_skills = random.randint(5, 15)
    skills = random.sample(path_config["skills"], min(num_skills, len(path_config["skills"])))

    # Add some cross-domain skills occasionally
    if random.random() > 0.6:
        other_path = random.choice(list(CAREER_PATHS.keys()))
        cross_skills = random.sample(CAREER_PATHS[other_path]["skills"], min(3, len(CAREER_PATHS[other_path]["skills"])))
        skills = list(set(skills + cross_skills))

    spec1, spec2 = random.sample(path_config["specializations"], 2)
    summary_template = random.choice(path_config["summary_templates"])
    summary = summary_template.format(years=years_of_experience, spec1=spec1, spec2=spec2)

    # Behavioral signals
    days_since_active = random.choices(
        [random.randint(0, 7), random.randint(8, 30), random.randint(31, 90), random.randint(91, 365)],
        weights=[40, 30, 20, 10]
    )[0]

    last_active = (datetime.now() - timedelta(days=days_since_active)).isoformat()

    publications = random.choices([0, 0, 0, 1, 2, 3, 5, 8], weights=[40, 15, 10, 10, 8, 7, 5, 5])[0]
    github_contributions = random.choices(
        [0, random.randint(1, 50), random.randint(51, 200), random.randint(201, 500), random.randint(501, 2000)],
        weights=[20, 25, 25, 20, 10]
    )[0]
    num_certs = random.choices([0, 1, 2, 3, 4], weights=[30, 30, 20, 15, 5])[0]
    certs = random.sample(CERTIFICATIONS, min(num_certs, len(CERTIFICATIONS)))

    # Profile completeness factors
    has_summary = True
    has_photo = random.random() > 0.15
    has_portfolio = random.random() > 0.4
    has_recommendations = random.random() > 0.3
    profile_completeness = (
        0.25 * has_summary +
        0.15 * has_photo +
        0.25 * has_portfolio +
        0.20 * has_recommendations +
        0.15 * min(1.0, len(skills) / 10.0)
    )

    # Career trajectory — promotions
    promotions = max(0, years_of_experience // 3 + random.randint(-1, 1))
    avg_tenure = years_of_experience / max(1, promotions + 1)

    experience = _generate_experience(career_path, years_of_experience)

    return {
        "id": f"CAND-{candidate_id:04d}",
        "name": f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
        "title": random.choice(path_config["titles"]),
        "career_path": career_path,
        "location": random.choice(LOCATIONS),
        "summary": summary,
        "skills": skills,
        "years_of_experience": years_of_experience,
        "education": {
            "level": education,
            "university": random.choice(UNIVERSITIES),
            "field": random.choice([
                "Computer Science", "Data Science", "Software Engineering",
                "Electrical Engineering", "Mathematics", "Statistics",
                "Information Technology", "Physics", "Business Administration",
                "Design", "Cognitive Science", "Bioinformatics"
            ])
        },
        "experience": experience,
        "certifications": certs,
        "behavioral_signals": {
            "last_active": last_active,
            "days_since_active": days_since_active,
            "publications": publications,
            "github_contributions": github_contributions,
            "profile_completeness": round(profile_completeness, 2),
            "has_portfolio": has_portfolio,
            "has_recommendations": has_recommendations,
            "promotions": promotions,
            "avg_tenure_years": round(avg_tenure, 1),
            "open_to_work": random.random() > 0.3
        }
    }


def generate_candidates(count: int = CANDIDATE_COUNT) -> list:
    """Generate a list of synthetic candidates."""
    candidates = []
    for i in range(1, count + 1):
        candidates.append(_generate_candidate(i))
    return candidates


def generate_sample_jobs() -> list:
    """Generate sample job descriptions for demo/testing."""
    return [
        {
            "id": "JOB-001",
            "title": "Senior Machine Learning Engineer",
            "company": "TechCorp AI",
            "location": "San Francisco, CA / Remote",
            "description": """We are looking for a Senior Machine Learning Engineer to join our AI platform team. 
You will design, build, and deploy production ML systems that serve millions of users.

Requirements:
- 5+ years of experience in machine learning engineering
- Strong proficiency in Python, TensorFlow or PyTorch
- Experience with NLP, transformer models, and large language models
- Expertise in ML system design, model serving, and MLOps
- Experience with cloud platforms (AWS/GCP) and containerization (Docker, Kubernetes)
- Strong understanding of distributed systems and data pipelines
- Published research or significant open-source contributions preferred

Nice to have:
- Experience with recommendation systems or search ranking
- Knowledge of reinforcement learning
- Experience leading technical projects and mentoring junior engineers

We offer competitive compensation, equity, and the chance to work on cutting-edge AI problems.""",
            "required_experience_min": 5,
            "required_experience_max": 12,
            "required_education": "Master's",
            "preferred_skills": ["Python", "TensorFlow", "PyTorch", "NLP", "Transformers", "MLOps", "Docker", "Kubernetes", "AWS", "Deep Learning"],
            "seniority": "Senior"
        },
        {
            "id": "JOB-002",
            "title": "Data Scientist - Product Analytics",
            "company": "GrowthMetrics Inc",
            "location": "New York, NY",
            "description": """Join our data science team to drive product decisions through rigorous analysis and experimentation.

You will:
- Design and analyze A/B tests to measure product feature impact
- Build predictive models for user behavior, churn, and LTV
- Partner with product managers to define metrics and KPIs
- Create dashboards and automated reports for stakeholders
- Develop causal inference models to understand user engagement

Requirements:
- 3+ years in data science or analytics role
- Expert SQL skills and proficiency in Python (Pandas, NumPy, Scikit-learn)
- Strong foundation in statistics, hypothesis testing, and experimental design
- Experience with visualization tools (Tableau, Looker, or similar)
- Excellent communication skills for presenting to non-technical audiences

Nice to have:
- Experience with Bayesian methods and causal inference
- Knowledge of machine learning for recommendation or personalization
- MBA or business analytics background""",
            "required_experience_min": 3,
            "required_experience_max": 8,
            "required_education": "Bachelor's",
            "preferred_skills": ["Python", "SQL", "Statistics", "A/B Testing", "Pandas", "Scikit-learn", "Tableau", "Hypothesis Testing", "Data Visualization"],
            "seniority": "Mid"
        },
        {
            "id": "JOB-003",
            "title": "Staff Frontend Engineer - Design Systems",
            "company": "DesignFlow",
            "location": "Remote",
            "description": """We're seeking a Staff Frontend Engineer to lead our design system initiative and drive frontend architecture across the organization.

Responsibilities:
- Architect and maintain a company-wide design system and component library
- Set technical standards for frontend development across 10+ product teams
- Drive performance optimization initiatives (Core Web Vitals, bundle optimization)
- Mentor senior and mid-level frontend engineers
- Collaborate with UX designers to create accessible, responsive interfaces

Requirements:
- 7+ years of frontend development experience
- Expert-level React and TypeScript skills
- Deep knowledge of CSS architecture, design tokens, and component APIs
- Experience building and maintaining design systems at scale
- Strong understanding of web accessibility (WCAG 2.1 AA)
- Experience with testing frameworks (Jest, Cypress, Playwright)

Nice to have:
- Experience with micro-frontend architecture
- Contributions to open-source design systems
- Experience with Storybook and documentation tooling""",
            "required_experience_min": 7,
            "required_experience_max": 15,
            "required_education": "Bachelor's",
            "preferred_skills": ["React", "TypeScript", "CSS3", "Design Systems", "Accessibility", "Jest", "Storybook", "Web Performance", "Responsive Design", "JavaScript"],
            "seniority": "Staff"
        },
        {
            "id": "JOB-004",
            "title": "Cloud Security Engineer",
            "company": "SecureNet Solutions",
            "location": "Austin, TX",
            "description": """We need a Cloud Security Engineer to protect our multi-cloud infrastructure and ensure compliance across all environments.

You will:
- Design and implement security controls across AWS and GCP environments
- Conduct threat modeling and security architecture reviews
- Build automated security scanning pipelines (SAST, DAST, container scanning)
- Manage identity and access management (IAM) policies
- Lead incident response and forensic investigations
- Ensure compliance with SOC2, ISO 27001, and GDPR requirements

Requirements:
- 4+ years in security engineering with cloud focus
- Deep expertise in AWS or GCP security services
- Experience with container security (Docker, Kubernetes)
- Knowledge of infrastructure-as-code security (Terraform, CloudFormation)
- Familiarity with SIEM tools and security monitoring
- CISSP, CEH, or equivalent certification preferred

Nice to have:
- Experience with zero-trust architecture
- Penetration testing skills
- Programming experience in Python or Go""",
            "required_experience_min": 4,
            "required_experience_max": 10,
            "required_education": "Bachelor's",
            "preferred_skills": ["AWS Security", "GCP Security", "Container Security", "IAM", "Terraform", "SIEM", "Penetration Testing", "Incident Response", "Compliance (SOC2, ISO27001)", "Python"],
            "seniority": "Mid-Senior"
        },
        {
            "id": "JOB-005",
            "title": "Senior Data Engineer - Real-Time Platform",
            "company": "StreamData Inc",
            "location": "Seattle, WA / Remote",
            "description": """Build the next generation of our real-time data platform processing billions of events daily.

Responsibilities:
- Design and implement streaming data pipelines using Kafka and Flink
- Build and maintain data lake architecture on cloud platforms
- Develop data quality frameworks and monitoring solutions
- Optimize query performance and cost across Snowflake and Spark clusters
- Collaborate with ML teams to build feature stores and training pipelines

Requirements:
- 5+ years in data engineering
- Expert-level SQL and Python skills
- Deep experience with Apache Kafka, Spark, or Flink
- Proficiency with cloud data warehouses (Snowflake, BigQuery, or Redshift)
- Experience with workflow orchestration (Airflow, Dagster, or Prefect)
- Strong understanding of data modeling and warehousing concepts

Nice to have:
- Experience with dbt and analytics engineering
- Knowledge of Delta Lake or Apache Iceberg
- Experience building ML feature stores""",
            "required_experience_min": 5,
            "required_experience_max": 12,
            "required_education": "Bachelor's",
            "preferred_skills": ["Python", "SQL", "Kafka", "Spark", "Flink", "Snowflake", "Airflow", "Data Modeling", "Docker", "AWS"],
            "seniority": "Senior"
        },
        {
            "id": "JOB-006",
            "title": "Product Manager - AI/ML Platform",
            "company": "InnovateTech",
            "location": "Boston, MA",
            "description": """Lead the product vision for our AI/ML platform serving internal data science and engineering teams.

You will:
- Define product strategy and roadmap for ML infrastructure tools
- Partner with ML engineers to understand workflow pain points
- Design intuitive interfaces for model training, deployment, and monitoring
- Drive adoption metrics and measure platform impact on ML team velocity
- Manage stakeholder relationships across engineering, data science, and leadership

Requirements:
- 5+ years of product management experience
- Technical background (CS degree or engineering experience)
- Understanding of ML/AI workflows and infrastructure
- Experience with developer tools or platform products
- Strong data analysis skills (SQL, basic Python)
- Excellent written and verbal communication

Nice to have:
- Hands-on ML or data science experience
- Experience with MLOps tools (MLflow, Kubeflow, SageMaker)
- Track record of launching 0-to-1 products""",
            "required_experience_min": 5,
            "required_experience_max": 12,
            "required_education": "Bachelor's",
            "preferred_skills": ["Product Strategy", "Roadmap Planning", "SQL", "Python", "Agile", "Stakeholder Management", "Data Analysis", "User Research", "A/B Testing", "OKRs"],
            "seniority": "Senior"
        }
    ]


if __name__ == "__main__":
    # Generate and save data
    data_dir = os.path.dirname(os.path.abspath(__file__))

    print("Generating synthetic candidates...")
    candidates = generate_candidates()
    with open(os.path.join(data_dir, "candidates.json"), "w") as f:
        json.dump(candidates, f, indent=2)
    print(f"Generated {len(candidates)} candidates -> candidates.json")

    print("Generating sample jobs...")
    jobs = generate_sample_jobs()
    with open(os.path.join(data_dir, "sample_jobs.json"), "w") as f:
        json.dump(jobs, f, indent=2)
    print(f"Generated {len(jobs)} sample jobs -> sample_jobs.json")
