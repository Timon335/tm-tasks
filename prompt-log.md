# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ต้องลบของเก่า

---

## 2569-09-23 คำสั่ง: /tasks

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์: specs/001-booking/spec.md
- ผลลัพธ์: สร้าง specs/001-booking/tasks.md จำนวน 16 tasks ตามลำดับ dependency
- Tasks ที่รอ Open Question: T-10, T-13, T-14 รอ Q-02 เรื่องรูปแบบและวิธีออกหมายเลขคิว
- การตรวจความครบ: AC-BKG-01 ถึง AC-BKG-06 มี task ตรวจครบ และ Constraint CON-TECH-01, DOM-PDPA-01, IF-IDP-01, IF-HIS-01, IF-NOT-01 มี task รองรับครบ
- ยังไม่เริ่มทำ task ใด ๆ และยังไม่มีการเขียนโค้ด

---

## 2569-09-23 คำสั่ง: /implement T-01

- ไฟล์ที่สร้าง: backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/conftest.py
- ผล test: `pytest` รันได้แต่ยังไม่มี test; smoke test ของ migration ผ่าน โดยสร้างตาราง slots, bookings, audit_logs และไม่พบคอลัมน์ national_id ใน bookings
- Diagnostics: ไม่พบข้อผิดพลาดในไฟล์ที่สร้าง
- สิ่งที่เกือบต้องเดา: ไม่ได้กำหนดรูปแบบหรือวิธีออกหมายเลขคิว จึงคง queue_no เป็น nullable ตาม Q-02 และไม่สร้าง logic การออกเลขคิว

---

## 2569-09-23 คำสั่ง: /implement T-11

- ไฟล์ที่สร้างหรือแก้: frontend/src/pages/SlotPicker.jsx, frontend/src/App.jsx, frontend/src/api/client.js, frontend/src/__tests__/SlotPicker.test.jsx
- ผล test: รอบแรกพบปัญหา timezone ในการคำนวณวันที่; หลังแก้แล้ว `npm test` ผ่าน 2 test files และ 2 tests
- Diagnostics: ไม่พบข้อผิดพลาดในไฟล์ที่แตะ
- สิ่งที่เกือบต้องเดา: spec ไม่ระบุรายการหรือรหัสแพ็กเกจ จึงใช้ช่องกรอกรหัสแพ็กเกจและไม่สร้างรายการแพ็กเกจขึ้นเอง
