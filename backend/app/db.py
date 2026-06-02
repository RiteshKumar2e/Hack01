import os
import json
import logging
import libsql

logger = logging.getLogger(__name__)

# Global database connection reference
_conn = None

def get_db_connection():
    """Establish and return a connection to the Turso/libSQL database."""
    global _conn
    if _conn is not None:
        return _conn

    url = os.getenv("TURSO_DATABASE_URL")
    token = os.getenv("TURSO_AUTH_TOKEN")

    if not url or not token:
        # Fall back to a local SQLite database
        local_db_dir = os.path.join(os.path.dirname(__file__), 'data')
        os.makedirs(local_db_dir, exist_ok=True)
        local_db_path = os.path.join(local_db_dir, 'local.db')
        logger.info(f"Connecting to local SQLite database at: {local_db_path}")
        # For local SQLite database, standard sqlite3 or libsql connect works.
        # Use libsql.connect with local path
        _conn = libsql.connect(local_db_path)
    else:
        logger.info(f"Connecting to remote Turso database: {url}")
        _conn = libsql.connect(url, auth_token=token)

    return _conn


def init_db():
    """Create the database tables if they do not exist."""
    try:
        conn = get_db_connection()
        
        # Create candidates table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS candidates (
                id TEXT PRIMARY KEY,
                name TEXT,
                title TEXT,
                career_path TEXT,
                location TEXT,
                years_of_experience INTEGER,
                data TEXT
            )
        """)
        
        # Create sample_jobs table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sample_jobs (
                id TEXT PRIMARY KEY,
                title TEXT,
                company TEXT,
                location TEXT,
                description TEXT,
                data TEXT
            )
        """)
        
        # In libsql connection, commits are automatic or we can call sync if needed.
        # Standard libsql connection object doesn't strictly require commit() for DDL
        # but let's call it if supported to be safe.
        if hasattr(conn, "commit"):
            conn.commit()
            
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database tables: {str(e)}")
        raise e


def get_all_candidates():
    """Fetch all candidates from the database and parse their data JSON."""
    try:
        conn = get_db_connection()
        result = conn.execute("SELECT data FROM candidates")
        rows = result.fetchall()
        
        candidates = []
        for row in rows:
            # row might be a tuple/list or a row object. Row contains data JSON in index 0.
            data_str = row[0]
            try:
                candidates.append(json.loads(data_str))
            except Exception as parse_err:
                logger.error(f"Error parsing candidate JSON data: {parse_err}")
                
        return candidates
    except Exception as e:
        logger.error(f"Error fetching candidates from database: {str(e)}")
        return []


def save_candidate(candidate_dict):
    """Insert or update a candidate in the database."""
    try:
        conn = get_db_connection()
        
        cand_id = candidate_dict.get("id")
        name = candidate_dict.get("name")
        title = candidate_dict.get("title")
        career_path = candidate_dict.get("career_path")
        location = candidate_dict.get("location")
        years_of_exp = candidate_dict.get("years_of_experience")
        data_str = json.dumps(candidate_dict)

        conn.execute(
            """
            INSERT OR REPLACE INTO candidates (id, name, title, career_path, location, years_of_experience, data)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            [cand_id, name, title, career_path, location, years_of_exp, data_str]
        )
        
        if hasattr(conn, "commit"):
            conn.commit()
            
        logger.info(f"Saved candidate {cand_id} to database.")
        return True
    except Exception as e:
        logger.error(f"Error saving candidate {candidate_dict.get('id')} to database: {str(e)}")
        return False


def clear_all_candidates():
    """Delete all candidate records from the database."""
    try:
        conn = get_db_connection()
        conn.execute("DELETE FROM candidates")
        
        if hasattr(conn, "commit"):
            conn.commit()
            
        logger.info("Cleared all candidates from database.")
        return True
    except Exception as e:
        logger.error(f"Error clearing candidates from database: {str(e)}")
        return False


def get_all_sample_jobs():
    """Fetch all sample jobs from the database and parse their data JSON."""
    try:
        conn = get_db_connection()
        result = conn.execute("SELECT data FROM sample_jobs")
        rows = result.fetchall()
        
        jobs = []
        for row in rows:
            data_str = row[0]
            try:
                jobs.append(json.loads(data_str))
            except Exception as parse_err:
                logger.error(f"Error parsing job JSON data: {parse_err}")
                
        return jobs
    except Exception as e:
        logger.error(f"Error fetching sample jobs from database: {str(e)}")
        return []


def save_sample_job(job_dict):
    """Insert or update a sample job in the database."""
    try:
        conn = get_db_connection()
        
        job_id = job_dict.get("id")
        title = job_dict.get("title")
        company = job_dict.get("company")
        location = job_dict.get("location")
        description = job_dict.get("description")
        data_str = json.dumps(job_dict)

        conn.execute(
            """
            INSERT OR REPLACE INTO sample_jobs (id, title, company, location, description, data)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            [job_id, title, company, location, description, data_str]
        )
        
        if hasattr(conn, "commit"):
            conn.commit()
            
        logger.info(f"Saved sample job {job_id} to database.")
        return True
    except Exception as e:
        logger.error(f"Error saving sample job {job_dict.get('id')} to database: {str(e)}")
        return False
