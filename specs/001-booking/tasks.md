# Tasks: จองคิวตรวจสุขภาพ (Booking)

- Feature: จองคิวตรวจสุขภาพ (Booking)
- Spec ID: SPEC-BKG-001
- อ้างอิง: [plan.md](plan.md)
- วันที่: 2569-09-23

มีทั้งหมด 16 tasks และมี 3 tasks ที่ต้องรอ Open Question Q-02 เรื่องรูปแบบและวิธีออกหมายเลขคิว
Tasks ที่รอ Q-02 จะยังไม่ตัดสินใจรูปแบบหมายเลขคิวหรือสร้าง logic ที่เกี่ยวข้อง

### T-01 สร้างโมเดลและ migration ฐานข้อมูล
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05, T-08 และ T-09
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/conftest.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง slots, bookings และ audit_logs ได้ และตาราง bookings ไม่มีคอลัมน์เลขบัตรประชาชน
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 เชื่อมการยืนยันตัวตนและค้น HN
- รองรับ: IF-IDP-01, IF-HIS-01, ASM-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05 และ T-06
- ไฟล์ที่แตะ: backend/app/auth/idp.py, backend/app/his/client.py, backend/app/booking/router.py, backend/tests/test_auth_his.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: endpoint ที่เข้าถึงข้อมูลผู้รับบริการตรวจผลยืนยันตัวตนก่อน และ lookup ส่งเลขบัตรไป HIS แล้วคืน HN โดยไม่บันทึกเลขบัตร
- สถานะ: พร้อมทำ

### T-03 สร้าง API ค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04 และ T-11
- ไฟล์ที่แตะ: backend/app/slots/service.py, backend/app/slots/router.py, backend/app/main.py, backend/tests/test_slots.py
- ต้องทำหลัง: T-01 และ T-02
- เสร็จเมื่อ: GET /slots รับ date_from กับ package_code และคืนวันภายใน 30 วัน ช่วงเวลา และจำนวนที่นั่งคงเหลือ โดยเปลี่ยนแพ็กเกจแล้วคำนวณข้อมูลใหม่
- สถานะ: พร้อมทำ

### T-04 วัดและปรับประสิทธิภาพการค้นหา
- รองรับ: NFR-PERF-01, FR-BKG-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: backend/app/slots/service.py, backend/app/slots/router.py, backend/tests/test_AC_BKG_05.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: test_AC_BKG_05 ยิงคำขอพร้อมกัน 200 ครั้งและยืนยันค่า p95 ไม่เกิน 2 วินาทีในสภาพแวดล้อมทดสอบที่กำหนด
- สถานะ: พร้อมทำ

### T-05 บันทึกการจองและตัดที่นั่งแบบธุรกรรม
- รองรับ: FR-BKG-04, IF-IDP-01, IF-HIS-01, IF-NOT-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06, T-07 และ T-08
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/booking/router.py, backend/app/notify/queue.py, backend/tests/test_booking_create.py
- ต้องทำหลัง: T-01, T-02 และ T-03
- เสร็จเมื่อ: POST /bookings บันทึก booking และลด remaining ของ slot เดียวกันอย่างสอดคล้องกัน พร้อมวางคำขอแจ้งเตือนแบบ asynchronous โดยไม่รอผลส่ง
- สถานะ: พร้อมทำ

### T-06 ปฏิเสธการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, ASM-02, IF-IDP-01
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/booking/router.py, backend/tests/test_AC_BKG_02.py
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: test_AC_BKG_02 ผ่าน โดยการจองซ้ำวันเดียวกันถูกปฏิเสธและ response แสดงหมายเลขคิวเดิมตามข้อมูลที่มี
- สถานะ: พร้อมทำ

### T-07 เสนอช่วงเวลาใกล้เคียงเมื่อ slot เต็ม
- รองรับ: FR-BKG-03, ASM-02
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: backend/app/slots/service.py, backend/app/booking/service.py, backend/app/booking/router.py, backend/tests/test_AC_BKG_03.py
- ต้องทำหลัง: T-03 และ T-05
- เสร็จเมื่อ: test_AC_BKG_03 ผ่าน โดย response เป็น 409 แสดงช่วงว่าง 3 ช่วงที่ใกล้ที่สุดในวันเดียวกันหรือวันถัดไป และไม่มี booking ซ้อน
- สถานะ: พร้อมทำ

### T-08 จัดคิวส่งข้อความและส่งซ้ำ
- รองรับ: FR-BKG-05, NFR-REL-02, IF-NOT-01, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: backend/app/notify/queue.py, backend/app/booking/service.py, backend/tests/test_AC_BKG_04.py
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: test_AC_BKG_04 ผ่าน โดยการจองยังคงอยู่เมื่อระบบแจ้งเตือนไม่ตอบสนอง และงานส่งซ้ำถูกกำหนดภายใน 5 นาทีตามจำนวนครั้งที่กำหนด
- สถานะ: พร้อมทำ

### T-09 บันทึก audit log ทุกการเข้าถึงข้อมูล
- รองรับ: DOM-PDPA-01, IF-IDP-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/audit/middleware.py, backend/app/main.py, backend/tests/test_AC_BKG_06.py
- ต้องทำหลัง: T-01 และ T-02
- เสร็จเมื่อ: test_AC_BKG_06 ผ่าน โดยการเปิดดู booking สร้าง audit log ที่มีผู้เข้าถึง เวลา และ HN และข้อมูลถูกเก็บตามอายุขั้นต่ำที่กำหนด
- สถานะ: พร้อมทำ

### T-10 กำหนดการออกหมายเลขคิวและผลลัพธ์การจอง
- รองรับ: FR-BKG-04, FR-BKG-05, AC-BKG-01, AC-BKG-04
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/booking/router.py, frontend/src/pages/BookingResult.jsx, backend/tests/test_queue_number.py
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: test_AC_BKG_01 ผ่านหลังทีมตอบ Q-02 โดยการจองสำเร็จ แสดงหมายเลขคิว และ remaining ของ slot เป็น 0
- สถานะ: รอ Q-02

### T-11 สร้างหน้าจอเลือกแพ็กเกจและเวลา
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-12 และ T-14
- ไฟล์ที่แตะ: frontend/src/pages/SlotPicker.jsx, frontend/src/App.jsx, frontend/src/api/client.js, frontend/src/__tests__/SlotPicker.test.jsx
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอใช้ API จำลอง แสดงช่วงเวลาพร้อมที่นั่งคงเหลือภายใน 30 วัน และโหลดช่วงเวลาใหม่เมื่อเปลี่ยนแพ็กเกจ
- สถานะ: เสร็จ รอทีมตรวจ

### T-12 สร้างหน้าจอยืนยันและทางเลือกเมื่อเต็ม
- รองรับ: FR-BKG-03, FR-BKG-04
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: frontend/src/pages/ConfirmBooking.jsx, frontend/src/App.jsx, frontend/src/__tests__/AC-BKG-03.test.jsx
- ต้องทำหลัง: T-11
- เสร็จเมื่อ: AC-BKG-03.test.jsx ผ่าน โดย API จำลองตอบ 409 แล้วหน้าจอแสดงข้อความช่วงเวลาเต็มและตัวเลือก 3 ช่วง
- สถานะ: พร้อมทำ

### T-13 สร้างหน้าจอผลการจองและการแจ้งเตือนล้มเหลว
- รองรับ: FR-BKG-04, FR-BKG-05, NFR-REL-02
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: frontend/src/pages/BookingResult.jsx, frontend/src/App.jsx, frontend/src/__tests__/AC-BKG-04.test.jsx
- ต้องทำหลัง: T-11 และ T-12
- เสร็จเมื่อ: AC-BKG-04.test.jsx ผ่านหลังทีมตอบ Q-02 โดยหน้าจอแสดงหมายเลขคิวแม้การส่งข้อความไม่สำเร็จ และแสดงสถานะงานส่งซ้ำ
- สถานะ: รอ Q-02

### T-14 ต่อหน้าจอกับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05, IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานรวมระบบของ AC-BKG-01, AC-BKG-03 และ AC-BKG-04
- ไฟล์ที่แตะ: frontend/src/api/client.js, frontend/src/App.jsx, frontend/src/pages/SlotPicker.jsx, frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx, frontend/vite.config.js
- ต้องทำหลัง: T-03, T-07, T-10, T-11, T-12 และ T-13
- เสร็จเมื่อ: หน้าจอเรียก API จริงผ่าน /api ได้ครบตั้งแต่เลือก slot ยืนยันการจอง จนถึงแสดงผลลัพธ์ตามสัญญา API ใน plan.md
- สถานะ: รอ Q-02

### T-15 บังคับใช้การรับส่งข้อมูลด้วย TLS
- รองรับ: NFR-SEC-01, IF-IDP-01, IF-HIS-01, IF-NOT-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานด้านความปลอดภัยของระบบ
- ไฟล์ที่แตะ: backend/app/config.py, backend/app/main.py, frontend/vite.config.js, backend/tests/test_tls_config.py
- ต้องทำหลัง: T-02 และ T-05
- เสร็จเมื่อ: test_tls_config.py ยืนยันการตั้งค่า production ให้รับส่งข้อมูลด้วย TLS 1.2 ขึ้นไป และไม่มี endpoint ที่ข้ามการตั้งค่าความปลอดภัยที่กำหนด
- สถานะ: พร้อมทำ

### T-16 ทดสอบความสำเร็จของผู้ใช้ใหม่
- รองรับ: NFR-USE-01, ASM-05, FR-BKG-01, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานตรวจ NFR-USE-01
- ไฟล์ที่แตะ: frontend/src/__tests__/usability-booking.test.jsx, docs/srs/README.md
- ต้องทำหลัง: T-11, T-12, T-13 และ T-14
- เสร็จเมื่อ: รายงานการทดสอบผู้ใช้ใหม่ 10 คนแสดงว่ามีอย่างน้อย 8 คนจองสำเร็จภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ
- สถานะ: พร้อมทำ

## ตารางตรวจความครบ: Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-10 |
| AC-BKG-02 | T-06 |
| AC-BKG-03 | T-07, T-12 |
| AC-BKG-04 | T-08, T-13 |
| AC-BKG-05 | T-04 |
| AC-BKG-06 | T-09 |

## ตารางตรวจความครบ: Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-09 |
| IF-IDP-01 | T-02, T-05, T-06, T-09, T-14, T-15 |
| IF-HIS-01 | T-01, T-02, T-05, T-15 |
| IF-NOT-01 | T-05, T-08, T-15 |

## สิ่งที่ยังไม่ทำ

- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร เช่น `A001` ให้ถามเจ้าหน้าที่เวชระเบียนก่อนสร้างวิธีออกเลขคิวและการแสดงเลขคิว
- Tasks ที่รอ Q-02: T-10, T-13 และ T-14
