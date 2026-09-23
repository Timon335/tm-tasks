from collections.abc import Generator
from importlib import import_module

import pytest
from sqlalchemy import Engine
from sqlalchemy.orm import Session

from app.db.models import Base
from app.db.session import get_engine, get_session


@pytest.fixture(scope="session")
def db_engine() -> Generator[Engine, None, None]:
    """เตรียมฐานข้อมูล SQLite ในหน่วยความจำสำหรับ test ของฟีเจอร์ Booking."""
    engine = get_engine("sqlite:///:memory:")
    migration = import_module("app.db.migrations.001_init")
    migration.upgrade(engine)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
def db_session(db_engine: Engine) -> Generator[Session, None, None]:
    """จัดหา session แยกให้แต่ละ test และ rollback เมื่อ test จบ."""
    session = next(get_session(db_engine))
    try:
        yield session
    finally:
        session.rollback()
        session.close()
