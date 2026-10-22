import os
from dotenv import load_dotenv

load_dotenv()

# MySQL Database configuration with configurable fallback
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "task_flow_db")

# Default MySQL connection string
DEFAULT_MYSQL_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_MYSQL_URL)

# Allows running unit tests or quick evaluation with SQLite if requested
USE_SQLITE = os.getenv("USE_SQLITE", "false").lower() in ("true", "1", "yes")

PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

