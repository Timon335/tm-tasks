from sqlalchemy.engine import Engine

from app.db.models import Base


def upgrade(engine: Engine) -> None:
    """สร้างตารางฐานข้อมูลทั้งหมดตาม CON-TECH-01 และ IF-HIS-01."""
    Base.metadata.create_all(engine)
