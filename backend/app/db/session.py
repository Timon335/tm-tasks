import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker


def get_engine(database_url: str | None = None) -> Engine:
    """สร้าง engine จาก DATABASE_URL เพื่อใช้ PostgreSQL ในระบบจริงตาม CON-TECH-01."""
    url = database_url or os.getenv("DATABASE_URL", "sqlite:///:memory:")
    connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
    return create_engine(url, connect_args=connect_args, pool_pre_ping=True)


def get_session(engine: Engine) -> Generator[Session, None, None]:
    """เปิดและปิด session สำหรับการเข้าถึงข้อมูลการจองตาม FR-BKG-04."""
    session_factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    session = session_factory()
    try:
        yield session
    finally:
        session.close()
