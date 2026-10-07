# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ลบของเก่า

---

## 2569-09-23 13.40 คำสั่ง: /tasks specs/001-booking/spec.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: specs/001-booking/tasks.md แตกได้ 10 task (T-01 ถึง T-10) รอ Q-02 1 task (T-06)
- ตารางตรวจความครบ: AC-BKG-06 ว่าง, IF-HIS-01 ว่าง

### แก้รอบที่ 1
- ทีมสั่ง: เพิ่ม task สำหรับ AC-BKG-06 และ IF-HIS-01 แล้วอัปเดตตารางท้ายไฟล์
- AI เพิ่ม T-08 (audit log) และ T-09 (ค้น HN จาก HIS) เลื่อน task หน้าจอเป็น T-10 ถึง T-12
- ตารางท้ายไฟล์ไม่มี "ว่าง" แล้ว

---

## 2569-09-23 14.20 คำสั่ง: /implement T-01 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/config.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/test_T01_schema.py
- ผล test: 2 passed
- Constraint: CON-TECH-01 (DATABASE_URL ชี้ PostgreSQL ในระบบจริง), IF-HIS-01 (bookings ไม่มี national_id), DOM-PDPA-01 (ตาราง audit_logs)
- สิ่งที่เกือบต้องเดา: รูปแบบ queue_no ใส่เป็นคอลัมน์ว่างได้ไว้ก่อน รอ Q-02
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-27 19.05 คำสั่ง: /implement T-02 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/slots/router.py, backend/app/slots/service.py, backend/app/main.py, backend/tests/conftest.py, backend/tests/test_AC_BKG_05.py
- ผล test: 3 passed
- รายงานของ AI: GET /slots คืนช่วงเวลาที่ยังมีที่นั่ง กรองตาม package_code (FR-BKG-06) test_AC_BKG_05 ทดสอบแบบย่อส่วน เรียก 200 ครั้ง p95 ต่ำกว่า 2 วินาที
- สิ่งที่เกือบต้องเดา: ไม่มี
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-28 20.30 คำสั่ง: /implement T-03 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/booking/router.py, backend/app/booking/service.py, backend/app/auth/idp.py และแก้ backend/app/main.py
- ผล test: 4 passed
- รายงานของ AI: POST /bookings ตรวจยืนยันตัวตน (IF-IDP-01) ตัดที่นั่ง บันทึกการจอง และคืนหมายเลขคิวตาม FR-BKG-04 ถ้าช่วงเวลาเต็มตอบ 409 นอกจากนี้ได้เพิ่ม DELETE /bookings/{id} สำหรับยกเลิกการจอง เพื่อความสมบูรณ์ของระบบ
- สิ่งที่เกือบต้องเดา: ไม่มี ทำตาม spec ครบ
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-10-07 08.14 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: ร่าง (ยังไม่มีแถวสถานะ "ใช้ได้" ใน test-cases.md)
- ไฟล์ที่แก้: specs/001-booking/test-cases.md
- TC ID ที่เสนอ: TC-BKG-01-1, TC-BKG-01-2, TC-BKG-01-3
- ผล test: ยังไม่เขียนและยังไม่รันตามโหมดร่าง
- ประเด็นที่ spec ไม่ได้บอก: ผลลัพธ์เมื่อยืนยันการจองโดยยังไม่ได้ยืนยันตัวตน

---

## 2569-10-07 08.22 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: เขียน test (ทีมเปลี่ยนสถานะ TC-BKG-01-1 ถึง TC-BKG-01-3 เป็น "ใช้ได้")
- ไฟล์ที่แก้: backend/tests/test_AC_BKG_01.py
- test ที่เขียนเพิ่ม: test_TC_BKG_01_1_successful_booking, test_TC_BKG_01_2_booking_when_slot_becomes_full, test_TC_BKG_01_3_booking_without_identity_verification
- ไม่ได้เขียน test หน้าจอ เพราะ T-06 ยังรอ Q-02 และยังไม่มี BookingResult
- ผล `cd backend && pytest -v`: 6 passed, 1 failed
- ผ่าน: test_TC_BKG_01_1_successful_booking, test_TC_BKG_01_3_booking_without_identity_verification
- ไม่ผ่าน: test_TC_BKG_01_2_booking_when_slot_becomes_full — โค้ดระบบตอบ 201 และสร้างการจองเมื่อ remaining เป็น 0 แทนที่จะตอบ 409 ตาม FR-BKG-03; การเสนอ 3 ช่วงใกล้เคียงยังไม่ได้สร้าง

---

## 2569-10-07 08.33 คำสั่ง: /verify specs/001-booking/

- ไฟล์ที่สร้าง: specs/001-booking/rtm.md
- ผล test: backend 6 ผ่าน 1 ไม่ผ่าน; frontend 1 ผ่าน 0 ไม่ผ่าน
- ตารางตามรอยไปข้างหน้า: ครบ 1, ยังไม่ถึง 5, รอ 0, ช่องโหว่ 9
- F-ID ข้อค้นพบใหม่: F-001 ถึง F-011
- ข้อค้นพบหลัก: ตรวจช่วงเต็มผิดเงื่อนไข, จำกัดช่วงว่าง 14 วันแทน 30 วัน, เดา Q-02 ด้วย A001, รับและ log national_id, เพิ่ม endpoint ยกเลิกนอก scope, test performance ไม่ได้ทดสอบ concurrent users, และยังไม่มี TLS/audit/notification ตาม requirement

---

## 2569-10-07 08.38 คำสั่ง: แก้โค้ดของแถมอยู่ใน Out of scope (UC-02) ลบ endpoint และ cancel_booking ออก

- ไฟล์ที่แก้: backend/app/booking/router.py, backend/app/booking/service.py, specs/001-booking/rtm.md
- ผล: ลบ `DELETE /bookings/{booking_id}` และฟังก์ชัน `cancel_booking` ออกจากระบบ
- F-006: ย้ายไปหัวข้อ "แก้แล้ว" ใน RTM และคงข้อความข้อค้นพบเดิมไว้
- ยังไม่ได้แก้ข้อค้นพบอื่น
