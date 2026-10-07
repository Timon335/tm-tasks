# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH
from app.db.models import Booking


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_successful_booking(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: บันทึกสำเร็จ
    assert res.status_code == 201
    assert db.query(Booking).count() == 1
    # Then: แสดงหมายเลขคิว (ยังไม่ตรวจเพราะรอ Q-02)
    # Then: ที่นั่งว่างของช่วงนั้นเป็น 0
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_2_booking_when_slot_becomes_full(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 0 ที่
    selected = make_slot(start="09:00", remaining=0)
    make_slot(start="08:30", remaining=1, days_from_today=1)
    make_slot(start="09:30", remaining=1, days_from_today=1)
    make_slot(start="10:00", remaining=1, days_from_today=2)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": selected.id}, headers=AUTH)

    # Then: แจ้ง "ช่วงเวลาเต็ม"
    assert res.status_code == 409
    assert res.json()["detail"] == "ช่วงเวลาเต็ม"
    # Then: แสดง 3 ช่วงที่ว่างและใกล้ 09.00 น. ที่สุด
    # ยังตรวจจำนวนและรูปแบบตัวเลือกไม่ได้ เพราะสัญญา response ไม่ได้ระบุฟิลด์
    # Then: ภายในวันเดียวกันและวันถัดไป
    # ยังตรวจรายละเอียดตัวเลือกไม่ได้ เพราะสัญญา response ไม่ได้ระบุฟิลด์
    # Then: ไม่มีรายการจองซ้อนเกิดขึ้น
    assert db.query(Booking).count() == 0


def test_TC_BKG_01_3_booking_without_identity_verification(client, db, make_slot):
    # Given: ยังไม่ได้ยืนยันตัวตน และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id})

    # Then: ระบบต้องตรวจยืนยันตัวตนตาม IF-IDP-01
    assert res.status_code == 401
