# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08.33 | test: 6 ผ่าน 1 ไม่ผ่าน (backend), 1 ผ่าน 0 ไม่ผ่าน (frontend)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 | T-02 เสร็จ | `backend/app/slots/service.py:list_available_slots`, `backend/app/slots/router.py:get_slots` | `test_AC_BKG_05` ผ่าน แต่ตรวจหลัก ๆ แค่ status/p95 | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ยังไม่มีโค้ดเฉพาะสำหรับกันจองซ้ำ | ยังไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05 พร้อมทำ, T-11/T-12 พร้อมทำ | มีเพียง `POST /bookings` ที่ตอบ 409 โดยไม่ส่งตัวเลือก | `test_TC_BKG_01_2_booking_when_slot_becomes_full` ไม่ผ่าน; ไม่มี test AC-BKG-03 | ช่องโหว่ |
| FR-BKG-04 | AC-BKG-01 | T-03 เสร็จ, T-06 รอ Q-02 | `backend/app/booking/service.py:create_booking`, `backend/app/booking/router.py:create_booking` | `test_TC_BKG_01_1_successful_booking` ผ่าน; ไม่ตรวจ queue_no เพราะรอ Q-02; test เดิมตรวจแค่ 201 | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีคิวแจ้งเตือนหรือการส่งซ้ำ | ยังไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 เสร็จ, T-10/T-12 พร้อมทำ | `list_available_slots` กรอง `package_code`; ยังไม่มีหน้าจอเปลี่ยนแพ็กเกจ | ไม่มี test เฉพาะ | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 เสร็จ | `backend/app/slots/service.py:list_available_slots` | `test_AC_BKG_05` ผ่าน แต่ยิงทีละคำขอ ไม่ใช่ผู้ใช้พร้อมกัน 200 คน | ช่องโหว่ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มี TLS configuration หรือการบังคับ HTTPS ในโค้ด | ไม่มี | ช่องโหว่ |
| NFR-REL-02 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีโค้ดส่งซ้ำ | ยังไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มีหน้าจอ booking จริงหรือการทดสอบผู้ใช้ 8 ใน 10 คน | มีเฉพาะ `setup.test.jsx` ซึ่งไม่ใช่ AC | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC โดยตรง | T-01 เสร็จ | `backend/app/config.py:DATABASE_URL`, `backend/app/db/session.py:engine` | `test_T01_tables_created` ผ่าน แต่ใช้ SQLite และไม่ตรวจ PostgreSQL runtime | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 พร้อมทำ | มีโมเดล `AuditLog` แต่ไม่มี middleware/การเขียน log | ยังไม่มี | ยังไม่ถึง |
| IF-IDP-01 | AC-BKG-01 (กรณีทางผิด) | T-03 เสร็จ | `backend/app/auth/idp.py:get_verified_hn` | `test_TC_BKG_01_3_booking_without_identity_verification` ผ่าน | ครบ |
| IF-HIS-01 | ไม่มี AC โดยตรง | T-01 เสร็จ, T-09 พร้อมทำ | ไม่มี `/patients/lookup`; `BookingRequest` ยังรับ `national_id` และ log ค่า | `test_T01_no_national_id` ผ่านเฉพาะ schema | ช่องโหว่ |
| IF-NOT-01 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีการ enqueue แจ้งเตือน | ยังไม่มี | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/slots/router.py:get_slots` (`GET /slots`) | FR-BKG-01, FR-BKG-06 | บางส่วน | คืนช่วงเวลาและ remaining และกรองแพ็กเกจ แต่ service จำกัดล่วงหน้า 14 วัน ขณะที่ spec ระบุ 30 วัน |
| `backend/app/slots/service.py:list_available_slots` | FR-BKG-01, FR-BKG-06 | ไม่ครบ | `DAYS_AHEAD = 14` ไม่ตรง 30 วัน และไม่มีการเชื่อมกับหน้าจอเปลี่ยนแพ็กเกจ |
| `backend/app/booking/router.py:create_booking` (`POST /bookings`) | FR-BKG-04, IF-IDP-01 | ไม่ครบ | ตรวจ auth และเรียกบันทึก แต่ไม่มีการส่ง notification; กรณีเต็มตอบ 409 โดยไม่มี 3 ตัวเลือกตาม FR-BKG-03 |
| `backend/app/booking/service.py:create_booking` | FR-BKG-04 | ไม่ตรงทั้งหมด | เงื่อนไข `remaining < 0` ทำให้ `remaining == 0` ยังจองได้; `next_queue_no` ใช้รูปแบบ A001 ทั้งที่ Q-02 ยังไม่ตอบ |
| `backend/app/booking/service.py:next_queue_no` | FR-BKG-04, Q-02 | ไม่ตรง | ตัดสินรูปแบบและการ reset หมายเลขคิวแทนคำถามเปิด |
| `backend/app/auth/idp.py:get_verified_hn` | IF-IDP-01 | เป็น mock เท่านั้น | ตรวจ prefix token จำลอง ไม่ได้เชื่อมระบบยืนยันตัวตนจริง; ใช้ได้เฉพาะเป็นโครงของ T-03 |
| `backend/app/db/models.py:Booking` | IF-HIS-01, FR-BKG-04 | บางส่วน | ไม่มีคอลัมน์ `national_id` แต่มีการรับและเขียนเลขบัตรลง log ที่ router |
| `backend/app/db/models.py:AuditLog` | DOM-PDPA-01 | ไม่ครบ | มี schema แต่ไม่มีการสร้าง audit log และไม่มีการรับประกันเก็บไม่น้อยกว่า 1 ปี |
| `frontend/src/api/client.js:api.getSlots` | FR-BKG-01, FR-BKG-06 | ยังไม่ถึง | มี client แต่ไม่มีหน้าจอเรียกใช้จริงหรือ test ของ flow |
| `frontend/src/api/client.js:api.createBooking` | FR-BKG-03, FR-BKG-04 | ยังไม่ถึง | มี client แต่ไม่มีหน้าจอยืนยัน/ผลการจอง และไม่แปลง 409 เป็นตัวเลือก |
| `frontend/src/App.jsx:App` | Goal, NFR-USE-01 | ไม่ครบ | เป็นเพียงหน้าจอโครง ยังไม่มี flow เลือกแพ็กเกจ/วัน/เวลาและยืนยัน |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | เงื่อนไขไม่ตรง spec | `backend/app/booking/service.py:26-30` | FR-BKG-03, AC-BKG-01-2 | ตรวจ `remaining < 0` จึงยังลดจาก 0 เป็น -1 และตอบ 201 แทนการปฏิเสธช่วงเต็ม; test `test_TC_BKG_01_2_booking_when_slot_becomes_full` ไม่ผ่าน | |
| F-002 | FR ไม่มี AC | `spec.md` FR-BKG-06 และ `test-cases.md` | FR-BKG-06 | FR-BKG-06 ไม่มี AC เฉพาะ และไม่มี test ตรวจว่าการเปลี่ยนแพ็กเกจทำให้รายการช่วงเวลาว่างเปลี่ยนจริง | |
| F-003 | ตัวเลขไม่ตรง spec | `backend/app/slots/service.py:10` | FR-BKG-01 | `DAYS_AHEAD = 14` แต่ requirement ระบุช่วงเวลาภายใน 30 วันข้างหน้า | |
| F-004 | เดา Q-02 | `backend/app/booking/service.py:13-18` | Q-02, FR-BKG-04 | โค้ดกำหนดรูปแบบ `A001` และนับใหม่รายวัน ทั้งที่ Q-02 ยังรอคำตอบ | |
| F-005 | ละเมิด Constraint | `backend/app/booking/router.py:17-25` | IF-HIS-01 | `national_id` รับเข้าคำขอและถูกเขียนลง log แม้ constraint กำหนดให้ค้นผ่าน HIS และไม่เก็บเลขบัตรประชาชนในบริบทการจอง | |
| F-007 | AC ไม่มี test / test อ่อน | `backend/tests/test_AC_BKG_01.py:7-13,16-29` | AC-BKG-01 | test เดิมตรวจเพียง 201; test ใหม่ยังไม่ตรวจหมายเลขคิวเพราะ Q-02 และไม่มี vitest สำหรับส่วน “แสดงหมายเลขคิว” | |
| F-008 | AC ไม่มี test | `specs/001-booking/test-cases.md` และ `backend/tests/test_AC_BKG_01.py` | AC-BKG-01-2 | แถวระบุให้แสดง 3 ช่วงใกล้เคียงและอยู่ในวันเดียวกัน/วันถัดไป แต่ test ทำได้เพียงตรวจ 409 และไม่มี field ตัวเลือกให้ assert; ระบบก็ยังไม่ส่งตัวเลือก | |
| F-009 | NFR ไม่มี test ที่ตรง | `backend/tests/test_AC_BKG_05.py:11-19` | NFR-PERF-01 | วนยิง request แบบ sequential ไม่ใช่ผู้ใช้พร้อมกัน 200 คน จึงไม่ยืนยัน p95 ตามเงื่อนไข concurrency ของ spec | |
| F-010 | NFR ไม่มีโค้ด | repository backend/frontend | NFR-SEC-01 | ไม่พบการตั้งค่า TLS 1.2+ หรือการบังคับ HTTPS สำหรับข้อมูลการจอง | |
| F-011 | Constraint ยังไม่ทำ | `backend/app/db/models.py:38-46` | DOM-PDPA-01 | มีเพียงตาราง `audit_logs`; ไม่มี middleware/การสร้างรายการเมื่อเปิดดูข้อมูล และไม่มีหลักฐาน retention ไม่น้อยกว่า 1 ปี | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-006 | โค้ดอยู่นอก scope | `backend/app/booking/router.py`, `backend/app/booking/service.py` | Out of scope UC-02 | ลบ `DELETE /bookings/{booking_id}` และ `cancel_booking` ออกแล้ว ตรวจด้วยการค้นไม่พบ endpoint/ฟังก์ชันดังกล่าว | |
