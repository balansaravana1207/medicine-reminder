"""
Database configuration — SQLAlchemy engine, session factory, and Base.
Uses SQLite for the prototype. Swap DATABASE_URL for PostgreSQL in production.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./medicines.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Required for SQLite with FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    Dependency that provides a DB session per request.
    Always closes the session in the finally block — no leaked connections.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
