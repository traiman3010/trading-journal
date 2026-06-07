# TOR — Trading Journal (โปรเจกต์ที่ 1)

> เอกสารนี้เขียนในรูปแบบ Terms of Reference / Scope of Work จำลองงานจริง
> ใช้เป็น input ให้ Claude Code / CLI ได้โดยตรง — แต่ละ Phase คือ 1 รอบงานที่ส่งให้ AI ช่วย implement ได้

---

## 1. ภาพรวมโปรเจกต์ (Project Overview)

**ชื่อ:** Trading Journal — สมุดบันทึกการเทรดพร้อมการวิเคราะห์สถิติ

**ปัญหาที่แก้:** เทรดเดอร์ส่วนใหญ่จดการเทรดใน Excel หรือไม่จดเลย ทำให้ไม่รู้ว่าตัวเองเทรดดีจริงไหม ขาดข้อมูลในการปรับกลยุทธ์ เครื่องมือนี้บันทึกทุกการเทรดและสรุปสถิติให้เห็นภาพ (win rate, R:R, ผลตอบแทนรายเดือน)

**กลุ่มผู้ใช้:** นักเทรดรายย่อย (หุ้น/คริปโต/forex) ที่อยากพัฒนาวินัยและวิเคราะห์ผลงานตัวเอง

**สิ่งที่โปรเจกต์นี้ฝึก (เป้าหมายการเรียนรู้):**
- CRUD ที่มี business logic (คำนวณ P&L, R:R จากข้อมูลที่กรอก)
- Aggregation query ที่ซับซ้อน (group by เดือน, คำนวณ win rate)
- Authentication และการแยกข้อมูลรายผู้ใช้
- Validation ฝั่ง server (Zod)
- การออกแบบ data model ที่มี relation

---

## 2. ขอบเขตงาน (Scope of Work)

### อยู่ในขอบเขต (In Scope)
- ระบบสมาชิก (สมัคร / เข้าสู่ระบบ / ออกจากระบบ)
- บันทึก แก้ไข ลบ การเทรด (trade entry)
- แท็ก/หมวดหมู่กลยุทธ์ (เช่น "breakout", "swing")
- หน้า dashboard สรุปสถิติพร้อมกราฟ
- ค้นหา/กรองการเทรด (ตามวันที่, สินทรัพย์, ผล กำไร/ขาดทุน)

### นอกขอบเขต (Out of Scope) — อย่าเพิ่งทำ
- ดึงราคา real-time จาก exchange (โปรเจกต์ Portfolio Tracker จะทำ)
- การแจ้งเตือน (โปรเจกต์ Price Alert จะทำ)
- มือถือ native app
- การแชร์/social features

---

## 3. User Stories และ Acceptance Criteria

### US-1: สมัครและเข้าสู่ระบบ
**ในฐานะ** ผู้ใช้ใหม่ **ฉันต้องการ** สมัครและเข้าสู่ระบบ **เพื่อ** เก็บข้อมูลการเทรดของฉันเป็นส่วนตัว

**Acceptance Criteria:**
- [ ] สมัครด้วย email + password ได้
- [ ] password ถูก hash ก่อนเก็บ (ห้ามเก็บ plain text)
- [ ] เข้าสู่ระบบแล้วได้ session ที่คงอยู่
- [ ] ผู้ใช้ A มองไม่เห็นข้อมูลของผู้ใช้ B เด็ดขาด
- [ ] หน้าที่ต้อง login เข้าถึงไม่ได้ถ้ายังไม่ login (redirect ไปหน้า login)

### US-2: บันทึกการเทรด
**ในฐานะ** เทรดเดอร์ **ฉันต้องการ** บันทึกการเทรดแต่ละครั้ง **เพื่อ** เก็บประวัติไว้วิเคราะห์

**Acceptance Criteria:**
- [ ] กรอกข้อมูลได้: สินทรัพย์, ทิศทาง (long/short), ราคาเข้า, ราคาออก, จำนวน, วันที่เข้า, วันที่ออก, ค่าธรรมเนียม, โน้ต, แท็กกลยุทธ์
- [ ] ระบบคำนวณ P&L ให้อัตโนมัติ (ไม่ให้ผู้ใช้กรอกเอง)
- [ ] ระบบคำนวณ % ผลตอบแทนให้
- [ ] validate: ราคาต้องเป็นค่าบวก, วันที่ออกต้องไม่ก่อนวันที่เข้า
- [ ] ถ้ากรอกข้อมูลผิด แสดง error ที่อ่านเข้าใจได้ (ไม่ใช่ stack trace)

### US-3: แก้ไข/ลบการเทรด
**Acceptance Criteria:**
- [ ] แก้ไขการเทรดที่บันทึกไว้ได้ และ P&L คำนวณใหม่
- [ ] ลบได้ พร้อมยืนยันก่อนลบ
- [ ] แก้/ลบได้เฉพาะการเทรดของตัวเอง (ผู้ใช้อื่นทำไม่ได้แม้รู้ ID)

### US-4: ดู Dashboard สถิติ
**ในฐานะ** เทรดเดอร์ **ฉันต้องการ** เห็นสถิติรวม **เพื่อ** ประเมินว่ากลยุทธ์ไหนได้ผล

**Acceptance Criteria:**
- [ ] แสดง win rate (% การเทรดที่กำไร)
- [ ] แสดงกำไร-ขาดทุนรวม
- [ ] แสดง average R:R (risk:reward)
- [ ] กราฟผลตอบแทนสะสมตามเวลา (equity curve)
- [ ] กราฟกำไร-ขาดทุนแยกตามแท็กกลยุทธ์
- [ ] สถิติคำนวณจากข้อมูลของผู้ใช้คนนั้นเท่านั้น

### US-5: ค้นหาและกรอง
**Acceptance Criteria:**
- [ ] กรองตามช่วงวันที่
- [ ] กรองตามสินทรัพย์
- [ ] กรองเฉพาะที่กำไร / เฉพาะที่ขาดทุน
- [ ] กรองตามแท็ก
- [ ] รองรับ pagination เมื่อมีการเทรดเยอะ

---

## 4. Data Model (Schema เริ่มต้น)

```
User
  id          uuid (PK)
  email       string (unique)
  password    string (hashed)
  createdAt   datetime

Trade
  id          uuid (PK)
  userId      uuid (FK -> User)
  symbol      string          // เช่น "BTCUSDT", "AAPL"
  direction   enum(LONG, SHORT)
  entryPrice  decimal
  exitPrice   decimal (nullable — ถ้ายังไม่ปิด)
  quantity    decimal
  fee         decimal (default 0)
  entryAt     datetime
  exitAt      datetime (nullable)
  pnl         decimal         // คำนวณจาก backend ไม่รับจาก client
  notes       text (nullable)
  createdAt   datetime

Tag
  id          uuid (PK)
  userId      uuid (FK -> User)
  name        string

TradeTag    // many-to-many ระหว่าง Trade กับ Tag
  tradeId     uuid (FK)
  tagId       uuid (FK)
```

**โจทย์ให้คิดเอง:** ควรคำนวณ `pnl` ตอนบันทึก (เก็บลง DB) หรือคำนวณตอนดึงข้อมูล (computed)? ลองชั่งน้ำหนักข้อดีข้อเสีย แล้วเขียนเหตุผลที่เลือกไว้ใน README — นี่คือคำถามที่อาจถูกถามในห้องสัมภาษณ์

---

## 5. API Specification (ตัวอย่าง endpoint หลัก)

```
POST   /api/auth/register      สมัครสมาชิก
POST   /api/auth/login         เข้าสู่ระบบ
POST   /api/auth/logout        ออกจากระบบ

GET    /api/trades             ดึงรายการเทรด (รองรับ query: ?from=&to=&symbol=&result=&tag=&page=)
POST   /api/trades             สร้างการเทรดใหม่
GET    /api/trades/:id         ดึงการเทรดเดียว
PATCH  /api/trades/:id         แก้ไข
DELETE /api/trades/:id         ลบ

GET    /api/stats/summary      สรุปสถิติรวม (win rate, total pnl, avg R:R)
GET    /api/stats/equity-curve ข้อมูลกราฟผลตอบแทนสะสม
GET    /api/stats/by-tag       กำไร-ขาดทุนแยกตามแท็ก

GET    /api/tags               ดึงแท็กทั้งหมดของผู้ใช้
POST   /api/tags               สร้างแท็ก
```

**กฎความปลอดภัยที่ทุก endpoint ต้องมี:**
- ทุก endpoint (ยกเว้น register/login) ต้องตรวจ session ก่อน
- ทุก query ต้อง scope ด้วย `userId` ของคนที่ login เสมอ
- validate ทุก input ที่รับจาก client ด้วย Zod ก่อนแตะ database

---

## 6. Tech Stack ที่กำหนด

- **Framework:** Next.js (App Router) + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** Auth.js (NextAuth)
- **Validation:** Zod
- **UI:** shadcn/ui + Tailwind
- **Chart:** Recharts
- **Deploy:** Vercel + Neon (Postgres ฟรี)

---

## 7. แผนการทำงานแบบ Phase (ใช้กับ Claude Code ทีละ Phase)

> วิธีใช้: เริ่ม session ใหม่กับ Claude Code แล้ววางเนื้อหา Phase นั้นพร้อมบอกว่า
> "นี่คือ requirement, ช่วย implement Phase นี้ และอธิบายสิ่งที่ทำให้ฉันเข้าใจด้วย เพราะฉันมาจากสาย frontend"

**Phase 0 — Setup (สัปดาห์ 1)**
- ตั้งโปรเจกต์ Next.js + TypeScript
- ตั้ง Prisma + เชื่อม Postgres (local ก่อน)
- สร้าง schema ตามข้อ 4 และ run migration
- *เป้าหมายเข้าใจ:* migration คืออะไร, Prisma client ทำงานยังไง

**Phase 1 — Auth (สัปดาห์ 2)**
- ทำ register/login/logout ด้วย Auth.js
- protect route ที่ต้อง login
- *เป้าหมายเข้าใจ:* session vs token, password hashing, ทำไมห้ามเก็บ password ดิบ

**Phase 2 — Trade CRUD (สัปดาห์ 3)**
- API + UI สำหรับ สร้าง/อ่าน/แก้/ลบ การเทรด
- ใส่ Zod validation
- คำนวณ P&L ฝั่ง server
- *เป้าหมายเข้าใจ:* ทำไม validate ฝั่ง server แม้ frontend validate แล้ว

**Phase 3 — Stats + Dashboard (สัปดาห์ 4-5)**
- เขียน aggregation query สำหรับสถิติ
- ทำหน้า dashboard + กราฟ
- *เป้าหมายเข้าใจ:* การ group by / aggregate ใน SQL, N+1 problem

**Phase 4 — Filter + Polish (สัปดาห์ 5-6)**
- ค้นหา/กรอง + pagination
- จัดการ error และ edge case

**Phase 5 — Deploy + Test + README (สัปดาห์ 6-7)**
- deploy ขึ้น Vercel + Neon
- เขียน test สำหรับ logic คำนวณ P&L และ stats
- เขียน README + architecture diagram + decision log

---

## 8. Definition of Done (เกณฑ์ว่าโปรเจกต์เสร็จ)

- [ ] ทุก user story ผ่าน acceptance criteria
- [ ] deploy แล้วมี live demo link
- [ ] มี test อย่างน้อยสำหรับ business logic (P&L, win rate)
- [ ] README มี: วิธีรัน, architecture diagram, เหตุผลการเลือก tech, decision log
- [ ] ไม่มี secret (password, API key) อยู่ใน git history
- [ ] commit สม่ำเสมอตลอดการทำ (ไม่ใช่ push ครั้งเดียวจบ)
