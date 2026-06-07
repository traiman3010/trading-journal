# TOR — Production-Grade Guide (Tier 3)

> Tier 3 ไม่ใช่ project ใหม่ แต่คือการ "ยกระดับ project เดิมให้เป็นระดับ production"
> เลือก 1-2 project ที่ดีที่สุดจาก Tier 1-2 มายกระดับ ไม่ต้องทำทุกตัว
> ความยาก: ⭐⭐⭐⭐ | นี่คือ tier ที่แยกคุณจาก junior ทั่วไป
>
> ⚠️ FUTURE-PROOF NOTE: เครื่องมือ DevOps เปลี่ยนเร็วมาก ตรวจสอบ best practice และเครื่องมือปัจจุบันก่อนทุกครั้ง
> รายการด้านล่างคือ "ประเภทของสิ่งที่ต้องมี" ไม่ใช่ "เครื่องมือตายตัว" — ปรับตามยุค

---

## ทำไม Tier นี้สำคัญ

คนจำนวนมากทำ project ได้ แต่ deploy แบบเล่นๆ การแสดงว่าคุณคิดเรื่อง production (สิ่งที่เกิดขึ้นเมื่อมีผู้ใช้จริง, traffic จริง, ปัญหาจริง) คือสัญญาณว่าคุณคิดแบบ engineer ไม่ใช่แค่ coder

เป้าหมาย: หยิบ 1 project ที่ภูมิใจที่สุด แล้วทำให้มัน "พร้อมใช้งานจริง"

---

## Checklist การยกระดับ (เรียงตามลำดับที่ควรทำ)

### 1. Containerization
- [ ] เขียน Dockerfile ให้ app
- [ ] เขียน docker-compose สำหรับ dev (app + database + cache)
- [ ] *เป้าหมายเข้าใจ:* ทำไม container แก้ปัญหา "มันรันได้บนเครื่องผม"

### 2. CI/CD Pipeline
- [ ] ตั้ง pipeline (เช่น GitHub Actions) ที่: run test → build → deploy อัตโนมัติ
- [ ] block การ merge ถ้า test ไม่ผ่าน
- [ ] *เป้าหมายเข้าใจ:* automation ลด human error ยังไง

### 3. Caching Layer ของจริง
- [ ] เพิ่ม Redis (หรือเทียบเท่า) แทนการ cache ใน database
- [ ] cache ข้อมูลที่เรียกบ่อย / เปลี่ยนน้อย
- [ ] *เป้าหมายเข้าใจ:* cache strategy, TTL, cache invalidation

### 4. Background Jobs / Queue
- [ ] เพิ่ม job queue (เช่น BullMQ) สำหรับงานหนัก/ช้า
- [ ] แยกงานที่ไม่ต้องตอบทันทีออกจาก request flow
- [ ] *เป้าหมายเข้าใจ:* ทำไมไม่ควรทำงานหนักใน HTTP request

### 5. Observability (Logging + Monitoring)
- [ ] structured logging (ไม่ใช่ console.log มั่ว)
- [ ] error tracking (เช่น Sentry)
- [ ] basic metrics (response time, error rate)
- [ ] *เป้าหมายเข้าใจ:* จะรู้ได้ยังไงว่า production มีปัญหา ก่อนผู้ใช้บ่น

### 6. Security Hardening
- [ ] rate limiting (กัน abuse)
- [ ] input sanitization ครบทุก endpoint
- [ ] security headers (CORS, CSP)
- [ ] ตรวจ dependency vulnerabilities
- [ ] *เป้าหมายเข้าใจ:* attack surface คืออะไร

### 7. Testing ครบระดับ
- [ ] unit test (logic)
- [ ] integration test (API + database)
- [ ] e2e test (เช่น Playwright) สำหรับ flow สำคัญ
- [ ] *เป้าหมายเข้าใจ:* test pyramid, แต่ละระดับจับ bug คนละแบบ

### 8. Performance
- [ ] หาและแก้ N+1 query
- [ ] เพิ่ม database index ที่จำเป็น
- [ ] วัด performance ก่อน-หลัง (มีตัวเลขพิสูจน์)
- [ ] *เป้าหมายเข้าใจ:* วัดก่อนแก้ อย่าเดา

---

## วิธีใช้กับ Claude Code

ทำทีละข้อ ไม่ต้องรวดเดียว แต่ละข้อบอก Claude Code ว่า:
> "ช่วยอธิบาย concept นี้ก่อน แล้วแนะนำว่าจะเพิ่มเข้า project เดิมยังไง ฉันอยากเข้าใจว่าทำไมต้องมี ไม่ใช่แค่ทำตาม"

⚠️ **ตรวจสอบเครื่องมือปัจจุบันก่อนทุกข้อ** — ตัวอย่างเครื่องมือในเอกสารนี้ (Redis, BullMQ, Sentry, Playwright, GitHub Actions) อาจมีตัวเลือกใหม่ที่ดีกว่าในอนาคต ให้ Claude search หา best practice ปัจจุบัน

---

## Definition of Done (Tier 3)
- [ ] project ที่เลือกรันใน container ได้
- [ ] มี CI/CD ที่ deploy อัตโนมัติ
- [ ] มี caching, monitoring, test ครบระดับ
- [ ] README มีหัวข้อ "Production considerations" อธิบายสิ่งที่ทำและเหตุผล
- [ ] อธิบายได้ว่า "ถ้า traffic เพิ่ม 100 เท่า ระบบจะพังตรงไหนและแก้ยังไง"

**คุณค่าต่อ portfolio:** การมี project ที่ "คิดเรื่อง production" จริง = สัญญาณ senior mindset ที่ recruiter มองหา และเป็นจุดที่ทำให้คุณโดดเด่นกว่าคนที่มีแต่ project demo
