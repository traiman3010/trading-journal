# 📊 PROGRESS TRACKER — Fullstack Journey

> ไฟล์นี้คือสมุดบันทึกความก้าวหน้าตลอด roadmap Tier 1-4
> อัปเดตตามจริง (ซื่อสัตย์กับตัวเอง) แล้วโยนให้ Claude วิเคราะห์ทุกจบ sprint
>
> **ฐานเวลา:** 1-2 ชม./วัน = ~7-14 ชม./สัปดาห์ · 1 sprint = 2 สัปดาห์
> **เริ่ม:** _(เติมวันที่เริ่มจริง)_

---

## 🎯 Timeline รวม (ประมาณการ — ปรับได้)

| Tier | เนื้อหา | sprint โดยประมาณ | เดือนโดยประมาณ |
|------|---------|------------------|----------------|
| Tier 1 | 3 projects (Trading Journal, Portfolio, Price Alert) | 6-7 sprints | ~3-3.5 เดือน |
| Tier 2 | 2 projects (Kanban, E-commerce) | 4-5 sprints | ~2-2.5 เดือน |
| Tier 3 | Production-grade (ยกระดับ 1 project) | 2-3 sprints | ~1-1.5 เดือน |
| Tier 4 | Specialization | เปิดกว้าง | 2+ เดือน |
| **รวม** | | **~13-16 sprints** | **~8-10 เดือน** |

> หมายเหตุ: timeline นี้สมมติทำสม่ำเสมอ ชีวิตจริงมีสะดุดได้ — ช้ากว่านี้ไม่ใช่ความล้มเหลว ขอแค่ไม่หยุด

---

## 📌 สถานะปัจจุบัน

- **Tier ที่กำลังทำ:** Tier 1
- **Project:** Trading Journal
- **Sprint ที่:** 1
- **โหมด CLAUDE.md:** LEARN

---

## 🏃 SPRINT LOG

### Tier 1 · Trading Journal

#### Sprint 1 — Setup + Auth (สัปดาห์ 1-2)
เป้าหมาย: ตั้งโปรเจกต์ได้ + auth ใช้งานได้

Task ย่อย:
- [x] ตั้งโปรเจกต์ Next.js + TypeScript
- [x] ตั้ง Prisma + เชื่อม Postgres
- [x] สร้าง schema (User, Trade, Tag) + run migration
- [x] เข้าใจว่า migration คืออะไร (อธิบายได้)
- [ ] ทำ register/login/logout ด้วย Auth.js
- [ ] protect route ที่ต้อง login
- [ ] เข้าใจ session vs token, password hashing (อธิบายได้)
- [ ] commit + push ขึ้น GitHub

**Checkpoint (เติมตามจริงตอนจบ sprint):**
- ทำเสร็จกี่ %: ___
- ใช้เวลาจริง: ___ ชม.
- ติดอะไร: ___
- concept ที่ยังไม่แน่น: ___
- ความรู้สึก/note: ___

---

#### Sprint 2 — Trade CRUD (สัปดาห์ 3-4)
เป้าหมาย: สร้าง/อ่าน/แก้/ลบ การเทรด + คำนวณ P&L

Task ย่อย:
- [ ] API + UI สร้างการเทรด
- [ ] Zod validation ฝั่ง server
- [ ] คำนวณ P&L ฝั่ง backend
- [ ] แก้/ลบ การเทรด (เฉพาะของตัวเอง)
- [ ] เข้าใจว่าทำไมต้อง validate ฝั่ง server (อธิบายได้)
- [ ] commit สม่ำเสมอ

**Checkpoint:**
- ทำเสร็จกี่ %: ___
- ใช้เวลาจริง: ___ ชม.
- ติดอะไร: ___
- concept ที่ยังไม่แน่น: ___

---

#### Sprint 3 — Stats + Dashboard (สัปดาห์ 5-6)
เป้าหมาย: aggregation query + หน้า dashboard + กราฟ

Task ย่อย:
- [ ] เขียน aggregation query (win rate, total P&L, avg R:R)
- [ ] หน้า dashboard + การ์ดสถิติ
- [ ] กราฟ equity curve + กำไรแยกกลยุทธ์ (Recharts)
- [ ] เข้าใจ N+1 problem (อธิบายได้)
- [ ] commit

**Checkpoint:**
- ทำเสร็จกี่ %: ___
- ใช้เวลาจริง: ___ ชม.
- ติดอะไร: ___

---

#### Sprint 4 — Filter + Deploy + README (สัปดาห์ 7-8)
เป้าหมาย: ปิดงาน project 1 ให้สมบูรณ์

Task ย่อย:
- [ ] ค้นหา/กรอง + pagination
- [ ] จัดการ error + edge case
- [ ] deploy ขึ้น Vercel + Neon
- [ ] เขียน test สำหรับ P&L + stats
- [ ] README + architecture diagram + decision log
- [ ] ✅ Project 1 เสร็จสมบูรณ์ (ผ่าน Definition of Done ใน TOR)

**Checkpoint:**
- ทำเสร็จกี่ %: ___
- ใช้เวลาจริง: ___ ชม.
- มี live demo link: ___
- อธิบายโค้ดตัวเองได้ทั้งหมดไหม: ___

---

### Tier 1 · Portfolio Tracker
> เปิด `02-portfolio-tracker-TOR.md` แล้วแตก sprint ตาม Phase (ประมาณ 3 sprints)
> Sprint 5: Setup + Holdings CRUD | Sprint 6: External API + Caching | Sprint 7: Summary + Deploy

_(เติม sprint log เมื่อถึง)_

---

### Tier 1 · Price Alert System
> เปิด `03-price-alert-TOR.md` (ประมาณ 3 sprints)
> Sprint 8: Setup + Alert CRUD | Sprint 9: Background job | Sprint 10: Notification + idempotency + Deploy

_(เติม sprint log เมื่อถึง)_

---

### Tier 2 · Realtime Kanban
> เปิด `04-realtime-kanban-TOR.md` (ประมาณ 2-3 sprints)

_(เติมเมื่อถึง)_

### Tier 2 · E-commerce
> เปิด `05-ecommerce-TOR.md` (ประมาณ 2 sprints)

_(เติมเมื่อถึง)_

### Tier 3 · Production-grade
> เปิด `06-production-grade-guide.md` — เลือก 1 project มายกระดับ

_(เติมเมื่อถึง)_

### Tier 4 · Specialization
> เปิด `07-specialization-guide.md` — ตอนนี้ขอ Claude เขียน TOR เต็มของทางที่เลือก

_(เติมเมื่อถึง)_

---

## 📈 CHECKPOINT HISTORY (สรุปภาพรวมแต่ละ sprint)

> บันทึกสั้นๆ ทุกจบ sprint เพื่อดู trend ระยะยาว

| Sprint | วันที่จบ | % สำเร็จ | ชม.จริง | หมายเหตุ |
|--------|---------|---------|---------|----------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## 🤖 สำหรับ Claude เมื่อมาวิเคราะห์ progress

เมื่อผู้ใช้โยนไฟล์นี้มาขอวิเคราะห์ ให้ดู:
1. **On track ไหม** — เทียบ % สำเร็จกับ timeline แต่ถ้าช้า อย่าตำหนิ ให้หาสาเหตุและปรับแผน
2. **concept ที่ยังไม่แน่น** — ถ้าผู้ใช้บันทึกว่าไม่เข้าใจอะไร แนะนำให้กลับไปทบทวนก่อนไปต่อ อย่าให้สะสม
3. **เวลาจริง vs ประมาณการ** — ถ้าใช้เวลามากกว่าคาดมาก อาจต้องลด scope หรือปรับ timeline
4. **สัญญาณ burnout** — ถ้า % ตกต่อเนื่องหลาย sprint คุยเรื่องความยั่งยืน ไม่ใช่เร่ง
5. **ปรับ sprint ถัดไป** — เสนอ task ของ sprint ถัดไปให้เหมาะกับสถานการณ์จริง
6. **เตือนเรื่อง portfolio** — commit สม่ำเสมอ, README, decision log, อธิบายโค้ดได้

อย่าลืม: เป้าหมายคือการเรียนรู้ที่ยั่งยืน ไม่ใช่ทำตาม timeline เป๊ะ ความซื่อสัตย์ในการบันทึกสำคัญกว่าตัวเลขสวยๆ
