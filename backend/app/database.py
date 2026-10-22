import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import DATABASE_URL, USE_SQLITE

logger = logging.getLogger("taskflow")

Base = declarative_base()

def get_engine():
    if USE_SQLITE:
        logger.info("Using SQLite database as configured by USE_SQLITE=true")
        return create_engine(
            "sqlite:///./tasks.db",
            connect_args={"check_same_thread": False}
        )
    
    try:
        # Attempt connecting to MySQL with pool_pre_ping
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=3600
        )
        # Test connection
        with engine.connect() as conn:
            pass
        logger.info(f"Connected successfully to MySQL at {DATABASE_URL.split('@')[-1]}")
        return engine
    except Exception as e:
        logger.warning(
            f"Could not connect to MySQL ({e}). "
            f"Falling back to local SQLite database 'tasks.db' for seamless setup & testing."
        )
        return create_engine(
            "sqlite:///./tasks.db",
            connect_args={"check_same_thread": False}
        )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.models.task import Task  # noqa: F401
    Base.metadata.create_all(bind=engine)

