# TOR — Price Alert System (โปรเจกต์ที่ 3)

> โปรเจกต์ที่ท้าทายที่สุดในชุด — เพิ่มทักษะ background job / scheduled task
> ความยาก: ⭐⭐⭐⭐ | ทำหลังเข้าใจ external API + caching แล้ว (ต่อยอดจากโปรเจกต์ 2 ได้)

---

## 1. ภาพรวมโปรเจกต์

**ชื่อ:** Price Alert System — ระบบแจ้งเตือนเมื่อราคาถึงเป้า

**ปัญหาที่แก้:** นักเทรดต้องเฝ้าหน้าจอเพื่อรอราคาถึงจุดที่สนใจ เครื่องมือนี้ให้ตั้งเงื่อนไขไว้ แล้วระบบเช็คให้เองเป็นรอบ ส่งแจ้งเตือนเมื่อเงื่อนไขเป็นจริง

**สิ่งที่โปรเจกต์นี้ฝึก (concept ใหม่ที่ frontend dev ไม่ค่อยได้แตะ):**
- **Background job / scheduled task** — งานที่รันเองเป็นรอบโดยไม่มีคนกดปุ่ม
- การส่ง notification (email หรือ LINE Notify)
- **Idempotency** — ไม่แจ้งเตือนซ้ำเมื่อเงื่อนไขยังเป็นจริงต่อเนื่อง
- Rate limiting การเรียก external API เมื่อมี alert หลายอัน

---

## 2. ขอบเขตงาน

### In Scope
- ระบบสมาชิก (reuse)
- สร้าง/แก้/ลบ alert (สินทรัพย์ + เงื่อนไข + ราคาเป้า)
- background job เช็คราคาเทียบเงื่อนไขเป็นรอบ
- ส่งแจ้งเตือนเมื่อเงื่อนไขเป็นจริง (email หรือ LINE)
- ประวัติการแจ้งเตือนที่เคยส่ง

### Out of Scope
- แจ้งเตือนแบบ real-time millisecond (รอบทุก 1-5 นาทีพอ)
- เงื่อนไขซับซ้อน (เช่น indicator RSI) — เริ่มจากเทียบราคาตรงๆ ก่อน

---

## 3. User Stories และ Acceptance Criteria

### US-1: สร้าง Alert
**Acceptance Criteria:**
- [ ] ตั้ง alert: symbol, เงื่อนไข (ราคา >= หรือ <=), ราคาเป้า, ช่องทางแจ้งเตือน
- [ ] เปิด/ปิด alert ได้โดยไม่ต้องลบ
- [ ] validate ราคาเป้าเป็นค่าบวก

### US-2: ระบบเช็คและแจ้งเตือน (หัวใจ)
**Acceptance Criteria:**
- [ ] background job รันเป็นรอบ (เช่น ทุก 5 นาที)
- [ ] ดึงราคาปัจจุบันของทุก symbol ที่มี alert active (ดึงทีเดียวต่อ symbol แม้มีหลาย alert — ประหยัด API call)
- [ ] เมื่อเงื่อนไขเป็นจริง → ส่งแจ้งเตือน
- [ ] **ไม่แจ้งซ้ำ**: ถ้าแจ้งไปแล้วและเงื่อนไขยังจริงต่อเนื่อง ต้องไม่ส่งซ้ำทุกรอบ (ใช้ flag triggered)
- [ ] บันทึกประวัติว่าแจ้งเมื่อไหร่ ราคาเท่าไหร่

### US-3: ดูประวัติการแจ้งเตือน
**Acceptance Criteria:**
- [ ] แสดงรายการ alert ที่เคย trigger พร้อมเวลาและราคา ณ ตอนนั้น

---

## 4. Data Model

```
User                 // reuse

Alert
  id            uuid (PK)
  userId        uuid (FK)
  symbol        string
  condition     enum(ABOVE, BELOW)
  targetPrice   decimal
  channel       enum(EMAIL, LINE)
  isActive      boolean (default true)
  isTriggered   boolean (default false)   // กัน notification ซ้ำ
  createdAt     datetime

AlertHistory
  id            uuid (PK)
  alertId       uuid (FK)
  triggeredAt   datetime
  priceAtTrigger decimal
```

**โจทย์ให้คิดเอง:** เมื่อราคา trigger แล้วกลับไปอีกฝั่งของเงื่อนไข ควร reset `isTriggered` ให้แจ้งได้อีกครั้งไหม? ออกแบบ logic นี้และอธิบายใน README

---

## 5. API + Job Specification

```
GET    /api/alerts             ดึง alert ทั้งหมด
POST   /api/alerts             สร้าง alert
PATCH  /api/alerts/:id          แก้ไข / เปิด-ปิด
DELETE /api/alerts/:id          ลบ
GET    /api/alerts/history      ประวัติการแจ้งเตือน

// Background job (ไม่ใช่ HTTP endpoint ปกติ)
JOB    checkAlerts()           รันทุก 5 นาที — เช็คทุก alert active
```

**วิธีทำ background job บน Vercel:**
- ใช้ Vercel Cron Jobs (ตั้งใน `vercel.json`) เรียก endpoint `/api/cron/check-alerts` เป็นรอบ
- endpoint นี้ต้องมี secret ป้องกันคนนอกเรียก (เช็ค header)
- *ทางเลือกอื่น:* GitHub Actions schedule, หรือ service อย่าง Upstash QStash

---

## 6. Tech Stack
เหมือนโปรเจกต์ 2 + เพิ่ม:
- **Cron:** Vercel Cron Jobs
- **Email:** Resend (free tier ดี) หรือ **LINE Notify** (ถ้าอยากได้แจ้งเตือนเข้า LINE — เหมาะกับผู้ใช้ไทย)

---

## 7. แผนการทำงานแบบ Phase

**Phase 0 — Setup + reuse (สัปดาห์ 1)**
**Phase 1 — Alert CRUD (สัปดาห์ 2)**
**Phase 2 — Background job เช็คราคา (สัปดาห์ 3-4)** ← หัวใจ
ทำ cron endpoint, ดึงราคา (reuse cache จากโปรเจกต์ 2), เทียบเงื่อนไข
*เป้าหมายเข้าใจ:* cron ทำงานยังไง, ทำไม endpoint ต้องมี secret
**Phase 3 — Notification + idempotency (สัปดาห์ 4-5)**
ส่ง email/LINE, ทำ logic กันแจ้งซ้ำ
*เป้าหมายเข้าใจ:* idempotency คืออะไร ทำไมสำคัญ
**Phase 4 — History + Deploy + README (สัปดาห์ 5-6)**

---

## 8. Definition of Done
- [ ] background job รันเองได้จริงบน production
- [ ] ไม่แจ้งเตือนซ้ำเมื่อเงื่อนไขจริงต่อเนื่อง
- [ ] cron endpoint มีการป้องกันคนนอกเรียก
- [ ] ส่งแจ้งเตือนถึงจริง (ทดสอบได้)
- [ ] live demo + README + decision log

---
---

# ภาคผนวก — อีก 4 โปรเจกต์ถ้าอยากต่อยอด

ถ้าทำ 3 ตัวบนจบแล้วและอยากฝึก concept อื่นเพิ่ม นี่คือแนวทางสั้นๆ:

## Job Application Tracker (⭐⭐)
ติดตามใบสมัครงาน — ฝึก state machine (applied→interview→offer→rejected), file upload (resume)
**concept เด่น:** การจัดการ status workflow, การเก็บไฟล์

## URL Shortener + Analytics (⭐⭐)
ย่อ URL + นับสถิติคลิก — ฝึกการ generate short code ไม่ชนกัน, redirect, เก็บ metadata, rate limiting
**concept เด่น:** การออกแบบ unique ID, การเก็บ analytics

## Mini E-commerce Backend (⭐⭐⭐)
สินค้า + cart + order — ฝึก database transaction (ตัด stock แบบ atomic ไม่ให้ขายเกิน)
**concept เด่น:** transaction, ACID, race condition — สำคัญมากในงานจริง

## Realtime Kanban Board (⭐⭐⭐⭐)
บอร์ดงานแบบ Trello sync หลาย client — ฝึก WebSocket/SSE, optimistic update, conflict handling
**concept เด่น:** realtime communication — เก็บไว้เป็น project โชว์ตัวเด่น

---

## วิธีใช้ TOR เหล่านี้กับ Claude Code

1. เริ่มจากโปรเจกต์ 1 (Trading Journal) ก่อนเสมอ — อย่าข้าม
2. เปิด session Claude Code ใหม่ต่อ 1 Phase แล้ววาง requirement ของ Phase นั้น
3. บอก Claude Code เสมอว่า: *"ฉันมาจากสาย frontend ไม่เคยทำ backend ช่วยอธิบายสิ่งที่ทำและเหตุผลด้วย อย่าเขียนโค้ดให้เฉยๆ"*
4. หลังแต่ละ Phase: ลองอธิบายโค้ดที่ได้กลับให้ตัวเองฟัง ถ้าอธิบายไม่ได้แปลว่ายังไม่เข้าใจ — ถามต่อ
5. commit ทุกครั้งที่จบ Phase ย่อย
6. เก็บคำถาม "โจทย์ให้คิดเอง" ในแต่ละ TOR ไปคิดจริงๆ แล้วเขียนคำตอบใน README — นี่คือสิ่งที่ทำให้คุณต่างจากคนที่แค่ให้ AI เขียนโค้ดให้
