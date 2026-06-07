# 📦 Finance Side Projects — ชุดเตรียมตัวเป็น Fullstack

> ชุดเอกสารเตรียมพร้อมสำหรับ frontend dev ที่กำลังก้าวสู่ fullstack ผ่าน side project สาย finance
> เป้าหมาย: ฝึก backend จริง + ได้ portfolio + พัฒนาทักษะอย่างเป็นระบบ

---

## 🗂 ไฟล์ในชุดนี้

| ไฟล์ | คืออะไร | ใช้เมื่อไหร่ |
|------|---------|-------------|
| `_FOR-FUTURE-CLAUDE.md` | คู่มือให้ Claude อนาคตเข้าใจ folder นี้ | โยนให้ Claude อ่านก่อนขอคำปรึกษา |
| `PROGRESS.md` | สมุดบันทึก progress แบบ sprint + checkpoint | อัปเดตทุกวัน/จบ sprint แล้วให้ Claude วิเคราะห์ |
| `progress-dashboard.html` | dashboard มี progress bar (ติ๊กแล้วจำได้) | เปิดดูภาพรวมความก้าวหน้า |
| `README.md` (ไฟล์นี้) | ภาพรวม + roadmap 4 tier | อ่านก่อนเป็นอันดับแรก |
| `CLAUDE.md` | rule ให้ Claude Code เป็น senior ที่สอน | วางที่ root ของทุก repo |
| `design-spec.html` | พิมพ์เขียว UI ของ Tier 1 | เปิดดูตอน implement frontend |
| `design-spec-tier2-4.html` | พิมพ์เขียว UI Tier 2 + inspiration Tier 4 | เปิดดูตอนถึง Tier 2 |
| **Tier 1 — พื้นฐาน** | | |
| `01-trading-journal-TOR.md` | โปรเจกต์ 1 (CRUD, auth) | เริ่มที่นี่ |
| `02-portfolio-tracker-TOR.md` | โปรเจกต์ 2 (external API + cache) | หลังจบ 1 |
| `03-price-alert-TOR.md` | โปรเจกต์ 3 (background job) | หลังจบ 2 |
| **Tier 2 — ระดับงานจริง** | | |
| `04-realtime-kanban-TOR.md` | โปรเจกต์ 4 (WebSocket realtime) | หลังจบ Tier 1 |
| `05-ecommerce-TOR.md` | โปรเจกต์ 5 (transaction, race condition) | หลังจบ Tier 1 |
| **Tier 3 — production** | | |
| `06-production-grade-guide.md` | ยกระดับ project เดิมเป็น production | หลังจบ Tier 2 |
| **Tier 4 — specialization** | | |
| `07-specialization-guide.md` | เลือกทางลึก + โครง trading bot | หลังจบ Tier 3 |

---

## 🎯 Roadmap 4 Tier (เส้นทางทั้งหมด)

ออกแบบให้ไต่ระดับ — แต่ละ tier เพิ่มทักษะใหม่ ไม่ต้องทำครบทุกตัว แต่ทำให้เข้าใจจริงทีละขั้น

### Tier 1 · พื้นฐาน
สร้าง backend ครบวงจร — CRUD, auth, validation, external API, caching, background job
- Trading Journal → Portfolio Tracker → Price Alert
- จบ tier นี้: เข้าใจการสร้าง backend ครบวงจร

### Tier 2 · ระดับงานจริง
concept ที่ frontend dev ไม่ค่อยแตะ และบริษัทถามบ่อย
- Realtime Kanban (WebSocket จริง) + Mini E-commerce (transaction, race condition)
- จบ tier นี้: คุยเรื่อง system behavior ได้ — **น่าจะสมัครงาน fullstack ได้แล้ว**

### Tier 3 · Production-grade
ยกระดับ project เดิม (ไม่สร้างใหม่) — Docker, CI/CD, Redis, queue, monitoring, test ครบระดับ
- จบ tier นี้: deploy แบบมืออาชีพได้ — จุดที่แยกจาก junior ทั่วไป

### Tier 4 · เลือกทางลึก
เลือก 1 ทางที่ใช่ — trading bot (ตรงความชอบ finance), system design, devops, หรือ AI
- จบ tier นี้: มี depth ที่ทำให้โดดเด่น

**หลักคิด:** 3-5 project ที่ลึกและอธิบายได้ ชนะ 10 project ตื้นๆ เสมอ เป้าหมายคือ "ความเข้าใจที่สะสม" ไม่ใช่ "จำนวน project" — และถ้าระหว่างทางเจอ pain point จริงที่อยากแก้ ทำอันนั้นเลย project จาก passion จริงเป็นตัวที่ดีที่สุดบน portfolio

---

## 🔄 ความ Flexible ของชุดเอกสารนี้ (สำคัญ)

เอกสารนี้เขียนต้นปี 2026 หลายอย่างจะเปลี่ยน — ออกแบบให้ปรับตามยุคได้:
- **goal และปรัชญา = คงที่** (เป็น fullstack ที่เก่งจริง, เรียนรู้ไม่ใช่ให้ AI ทำแทน)
- **เครื่องมือและวิธี = ปรับได้** (tech stack, API, best practice จะอัปเดต)
- เมื่อกลับมาทำ tier ที่ไกล ให้โยน folder นี้ + `_FOR-FUTURE-CLAUDE.md` เข้า session ใหม่ Claude จะตรวจสอบสิ่งที่เปลี่ยนและ adapt ให้ทันสมัย
- Tier ยิ่งไกล TOR ยิ่งเป็น "โครง" มากกว่า "สเปคตายตัว" โดยตั้งใจ — เพราะความรู้คุณและเทคโนโลยีจะเปลี่ยน

---

## 🛠 Tech Stack (ใช้เหมือนกันทุกโปรเจกต์)

- **Framework:** Next.js (App Router) + TypeScript
- **Database:** PostgreSQL + Prisma (ORM)
- **Auth:** Auth.js (NextAuth)
- **Validation:** Zod
- **UI:** shadcn/ui + Tailwind + Recharts (กราฟ)
- **Deploy:** Vercel + Neon (Postgres ฟรี)

ใช้ stack เดียวกันทุกตัวโดยตั้งใจ — โปรเจกต์ 2-3 จะเร็วขึ้นมากเพราะ reuse pattern เดิมได้ (auth, layout, component)

---

## 🚀 วิธีเริ่มต้น (Quick Start)

1. อ่าน `README.md` (ไฟล์นี้) ให้จบ
2. เปิด `design-spec.html` ในเบราว์เซอร์ ดูภาพรวม UI ที่จะทำ
3. สร้าง repo สำหรับโปรเจกต์ 1 → วาง `CLAUDE.md` ที่ root
4. เปิด Claude Code → ตรวจว่าโหมดใน `CLAUDE.md` เป็น `LEARN`
5. วาง requirement จาก `01-trading-journal-TOR.md` ทีละ Phase
6. เริ่มที่ Phase 0 → commit ทุกครั้งที่จบ Phase ย่อย

---

## 💡 คำแนะนำจาก "senior" (สิ่งที่อยากให้รู้ก่อนเริ่ม)

### เรื่องการใช้ AI ให้ถูกวิธี
นี่คือหัวใจ — Claude Code คือ **ครูฝึกที่นั่งข้างๆ ไม่ใช่คนขับแทน** ถ้าให้มันเขียนโค้ดให้หมดแล้ว copy คุณจะ:
- เรียนไม่ได้อะไร พอเจอ bug จริงหรือถูกสัมภาษณ์จะตอบไม่ได้
- recruiter จับได้ทันทีเวลาถามเจาะ
- โค้ดที่ AI เขียนมักมีปัญหาที่คุณมองไม่ออกถ้าไม่เข้าใจ

ใช้โหมด `LEARN` ใน `CLAUDE.md` ช่วงแรก พอเข้าใจ concept แล้วค่อยสลับเป็น `BUILD` เพื่อความเร็ว

### เรื่อง portfolio ที่โดดเด่น
- **commit สม่ำเสมอ** — recruiter ดู contribution graph มันบอกความสม่ำเสมอได้มากกว่าโค้ดสวยที่ push ครั้งเดียว
- **README ที่ดี** — มี architecture diagram, เหตุผลการเลือก tech, screenshot/demo, live link
- **decision log** — เขียนว่าเจอปัญหาอะไร แก้ยังไง คิดยังไง นี่คือสิ่งที่ทำให้ต่างจากคนอื่น
- **ตอบ "โจทย์ให้คิดเอง"** — ในแต่ละ TOR มีคำถาม design ที่ไม่มีคำตอบตายตัว (เช่น "ควรคำนวณ P&L ตอนบันทึกหรือตอนดึง?") คิดเองแล้วเขียนคำตอบใน README

### กับดักที่ frontend dev มักเจอตอนทำ backend
- **อย่าเชื่อ client** — validate ทุก input ฝั่ง server เสมอ คนยิง API ตรงๆ ได้โดยไม่ผ่าน UI
- **N+1 query** — ดึงข้อมูลที่มี relation ในลูปทำให้ช้ามาก เรียนรู้ `include` ของ Prisma
- **secret management** — API key, password อยู่ใน `.env` เท่านั้น ห้าม commit

### เรื่อง scope (สำคัญกับเวลา 5-10 ชม./สัปดาห์)
ทำ "เล็กแต่สมบูรณ์" ดีกว่า "ใหญ่แต่ค้าง" — โปรเจกต์ที่ deploy ได้จริง + มี test ชนะโปรเจกต์ feature เยอะแต่รันไม่ได้เสมอ

---

## 📋 API การเงินที่ใช้ได้จริง (ข้อมูล ณ 2026)

สำหรับโปรเจกต์ 2-3 ที่ต้องดึงราคา:
- **Finnhub** — ดีสำหรับเริ่มต้น รองรับหุ้น + คริปโต มี WebSocket บน free tier
- **Alpaca** — free tier ใช้ได้จริง ไม่ต้องใช้บัตรเครดิต
- **CoinGecko** — ถ้าทำเฉพาะคริปโต free tier ใจดี
- ⚠️ **อย่าใช้ Yahoo Finance** — ถูก deprecate API แล้ว scraping เสี่ยงพัง

---

## ✅ Checklist ก่อนถือว่าโปรเจกต์ "เสร็จ"

- [ ] ผ่าน acceptance criteria ทุกข้อใน TOR
- [ ] deploy แล้วมี live demo link
- [ ] มี test สำหรับ business logic หลัก
- [ ] README มี: วิธีรัน, architecture diagram, เหตุผลเลือก tech, decision log
- [ ] ไม่มี secret ใน git history
- [ ] commit สม่ำเสมอตลอดการทำ
- [ ] อธิบายทุกส่วนของโค้ดตัวเองได้ (ทดสอบ: เล่าให้คนอื่นฟังรู้เรื่องไหม)
