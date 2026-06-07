# TOR — Portfolio Tracker (โปรเจกต์ที่ 2)

> โปรเจกต์ต่อยอดจาก Trading Journal — เพิ่มทักษะการเรียก external API และ caching
> ความยาก: ⭐⭐⭐ | ทำหลังจากเข้าใจ CRUD + Auth + Stats แล้ว

---

## 1. ภาพรวมโปรเจกต์

**ชื่อ:** Portfolio Tracker — ติดตามพอร์ตการลงทุนพร้อมราคาปัจจุบัน

**ปัญหาที่แก้:** คนที่ถือหุ้น/คริปโตหลายตัวต้องเปิดหลายแอปเพื่อดูว่ากำไรขาดทุนรวมเท่าไหร่ เครื่องมือนี้รวมทุก holding ไว้ที่เดียว ดึงราคาปัจจุบันมาคำนวณมูลค่าและ P&L แบบ real-time

**สิ่งที่โปรเจกต์นี้ฝึก (ต่อยอดจากตัวแรก):**
- การเรียก external API (ราคาหุ้น/คริปโต) จาก backend
- **Caching** — หัวใจของโปรเจกต์นี้ เพราะ free API tier จำกัด call ต้องไม่เรียกซ้ำทุกครั้ง
- การคำนวณมูลค่าและ P&L จากราคาปัจจุบัน
- การจัดการเมื่อ external API ล่ม/ช้า (error handling, fallback)

---

## 2. ขอบเขตงาน

### In Scope
- ระบบสมาชิก (ใช้ pattern เดิมจากโปรเจกต์ 1 ได้)
- เพิ่ม/ลบ holding (สินทรัพย์ + จำนวน + ราคาต้นทุน)
- ดึงราคาปัจจุบันจาก external API พร้อม cache
- หน้าสรุปพอร์ต: มูลค่ารวม, กำไร-ขาดทุนรวม, สัดส่วนแต่ละสินทรัพย์
- กราฟสัดส่วนพอร์ต (pie/donut)

### Out of Scope
- การซื้อขายจริง (ไม่เชื่อม broker)
- ราคา historical / กราฟราคาย้อนหลังหลายปี (เพิ่มทีหลังได้)
- รองรับ forex/options (เริ่มจากหุ้น + คริปโตพอ)

---

## 3. User Stories และ Acceptance Criteria

### US-1: จัดการ Holdings
**ในฐานะ** นักลงทุน **ฉันต้องการ** บันทึกสินทรัพย์ที่ถือ **เพื่อ** ติดตามมูลค่ารวม

**Acceptance Criteria:**
- [ ] เพิ่ม holding: symbol, ประเภท (stock/crypto), จำนวน, ราคาทุนเฉลี่ย
- [ ] แก้ไข/ลบ holding ได้
- [ ] validate symbol ว่ามีอยู่จริงก่อนบันทึก (เช็คกับ API)

### US-2: ดูราคาปัจจุบันและมูลค่า
**Acceptance Criteria:**
- [ ] แต่ละ holding แสดงราคาปัจจุบัน
- [ ] คำนวณมูลค่าปัจจุบัน (จำนวน × ราคาปัจจุบัน)
- [ ] คำนวณกำไร-ขาดทุน (มูลค่าปัจจุบัน − ต้นทุน) ทั้งจำนวนและ %
- [ ] ราคาที่ดึงมาถูก cache ไม่เรียก API ซ้ำภายในเวลาที่กำหนด (เช่น 60 วินาที)
- [ ] ถ้า API ล่ม แสดงราคาล่าสุดที่ cache ไว้ พร้อมบอกว่า "ข้อมูล ณ เวลา X"

### US-3: ดูสรุปพอร์ต
**Acceptance Criteria:**
- [ ] มูลค่าพอร์ตรวมทั้งหมด
- [ ] กำไร-ขาดทุนรวม (จำนวน + %)
- [ ] กราฟสัดส่วนแต่ละสินทรัพย์ในพอร์ต
- [ ] เรียงลำดับ holding ตามมูลค่าได้

---

## 4. Data Model

```
User                 // เหมือนโปรเจกต์ 1

Holding
  id            uuid (PK)
  userId        uuid (FK)
  symbol        string
  assetType     enum(STOCK, CRYPTO)
  quantity      decimal
  avgCost       decimal      // ราคาทุนเฉลี่ยต่อหน่วย
  createdAt     datetime

PriceCache           // เก็บราคาที่ดึงมาเพื่อลดการเรียก API
  symbol        string (PK)
  price         decimal
  fetchedAt     datetime     // ใช้เช็คว่า cache หมดอายุหรือยัง
```

**โจทย์ให้คิดเอง:** PriceCache ควรเก็บใน database, ใน memory, หรือใช้ service แยกอย่าง Redis? ในระดับ side project แบบไหนเหมาะสุดและเพราะอะไร? เขียนเหตุผลใน README

---

## 5. API Specification

```
GET    /api/holdings           ดึง holding ทั้งหมด (พร้อมราคาปัจจุบัน + P&L)
POST   /api/holdings           เพิ่ม holding
PATCH  /api/holdings/:id        แก้ไข
DELETE /api/holdings/:id        ลบ

GET    /api/portfolio/summary  สรุปพอร์ต (มูลค่ารวม, P&L รวม, สัดส่วน)

GET    /api/prices/:symbol     ดึงราคา (ภายในเรียก external API + cache)
GET    /api/symbols/search     ค้นหา/validate symbol
```

**Logic การ cache (สำคัญที่สุดของโปรเจกต์):**
1. รับ request ขอราคา symbol X
2. เช็ค PriceCache: ถ้ามีและยังไม่หมดอายุ (< 60 วิ) → คืนค่า cache
3. ถ้าไม่มีหรือหมดอายุ → เรียก external API → บันทึก cache → คืนค่า
4. ถ้า external API ล่ม → คืนค่า cache เก่า + flag ว่าเป็นข้อมูลเก่า

---

## 6. External API ที่แนะนำ (ข้อมูล ณ 2026)

- **Finnhub** — ดีสำหรับเริ่มต้น มี free tier และรองรับทั้งหุ้นและคริปโต
- **Alpaca** — free tier ใช้ได้จริง ไม่ต้องใช้บัตรเครดิต
- **CoinGecko** — ถ้าทำเฉพาะคริปโต free tier ใจดี

**คำเตือน:** อย่าใช้ Yahoo Finance API — ถูก deprecate อย่างเป็นทางการแล้ว การดึงผ่าน wrapper/scraping เสี่ยงพังได้ทุกเมื่อ

**กฎเหล็ก:** เก็บ API key ใน environment variable เท่านั้น ห้าม commit ขึ้น git และเรียก external API จาก backend เท่านั้น ห้ามเรียกจาก frontend (key จะหลุด)

---

## 7. Tech Stack
เหมือนโปรเจกต์ 1 (Next.js + Prisma + Postgres + Auth.js + Zod + shadcn/ui)
เพิ่ม: external finance API หนึ่งเจ้าจากข้อ 6

---

## 8. แผนการทำงานแบบ Phase

**Phase 0 — Setup + reuse auth (สัปดาห์ 1)**
นำ pattern auth จากโปรเจกต์ 1 มาใช้ + สร้าง schema ใหม่

**Phase 1 — Holdings CRUD (สัปดาห์ 2)**
จัดการ holding พื้นฐาน + validation

**Phase 2 — External API + Caching (สัปดาห์ 3-4)** ← หัวใจ
เชื่อม external API, ทำ cache layer, จัดการ API ล่ม
*เป้าหมายเข้าใจ:* ทำไมต้อง cache, cache invalidation, การไม่ให้ API key หลุด

**Phase 3 — Portfolio Summary + Chart (สัปดาห์ 4-5)**
คำนวณสรุปพอร์ต + กราฟสัดส่วน

**Phase 4 — Deploy + Test + README (สัปดาห์ 5-6)**

---

## 9. Definition of Done
- [ ] ทุก user story ผ่าน acceptance criteria
- [ ] มี cache layer ที่ทำงานจริง (พิสูจน์ได้ว่าลดการเรียก API)
- [ ] จัดการกรณี external API ล่มได้อย่าง graceful
- [ ] API key ไม่หลุดใน git และไม่ถูกเรียกจาก frontend
- [ ] live demo + README + decision log (โดยเฉพาะเรื่องเลือก cache strategy)
