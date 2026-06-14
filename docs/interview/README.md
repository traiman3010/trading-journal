# 🎤 Interview Prep Folder

> Reference material สำหรับสัมภาษณ์งาน — เปิดอ่านก่อนสัมภาษณ์ 2 ชม.

---

## 📂 ไฟล์ในนี้

| Project | สถานะ | ความซับซ้อน | Interview value |
|---------|-------|-------------|-----------------|
| [01 — Trading Journal](./01-trading-journal-prep.md) | ⏳ กำลังทำ | ⭐⭐ | Foundation |
| [02 — Portfolio Tracker](./02-portfolio-tracker-prep.md) | ⏳ | ⭐⭐⭐ | Caching gold |
| [03 — Price Alert](./03-price-alert-prep.md) | ⏳ | ⭐⭐⭐⭐ | Distributed systems |
| [04 — Realtime Kanban](./04-realtime-kanban-prep.md) | ⏳ | ⭐⭐⭐⭐ | **Portfolio star** |
| [05 — Mini E-commerce](./05-ecommerce-prep.md) | ⏳ | ⭐⭐⭐ | Transactions/Race |

---

## 🔄 วิธีใช้

### ทันทีที่ project เสร็จ
1. อ่านไฟล์ prep ของ project นั้น
2. ปรับ answer templates ให้ตรงกับสิ่งที่ทำจริง
3. เน้นสิ่งที่ **คุณเรียนรู้/ตัดสินใจ** ไม่ใช่แค่ list features

### ก่อนสัมภาษณ์ 2 ชม.
1. เปิดไฟล์ prep ของ project ที่จะพูดถึง
2. อ่าน "1-Minute Pitch" ก่อน
3. Skim common questions + memorize 3-5 ที่น่าจะเจอ
4. Review "showcase talking points"

### Mock Interview กับ Claude
- ขอ Claude simulate interviewer
- ตอบโดยไม่ดูเฉลย
- Compare กับ "Strong answer" — ตรงกันไหม?

---

## 🎯 Strategic Order ของการอ่าน

**สำหรับ junior interview (entry-level fullstack):**

อ่าน 01 → 02 → 03 (Tier 1)
- ครอบคลุม fundamentals
- ไม่ต้องอวด over-engineering

**สำหรับ mid-level interview:**

เพิ่ม 04 (Kanban) + 05 (E-commerce)
- WebSocket + concurrency = senior signals
- ต้องเลือก 1-2 project มาเป็น "anchor"

**สำหรับ specialized roles:**

- **Fintech/Trading firm:** เน้น 01 + 05 (transactions, financial domain)
- **Real-time apps:** เน้น 04 + 03 (sync, distributed)
- **Backend infra:** เน้น 02 + 03 + Tier 3 (caching, jobs, ops)

---

## 💡 Common Patterns Across Projects

สิ่งที่ทุก project demonstrate (พูดได้ในทุก interview):

| Pattern | Where shown |
|---------|-------------|
| Defense in depth | All projects (auth + validation + DB constraints) |
| userId scoping | All projects |
| Server-side validation (Zod) | All projects |
| Type-safe end-to-end | All projects (TypeScript + Prisma + Zod) |
| Error handling | All projects |
| README + decision log | All projects |

---

## 🚨 Anti-Patterns ที่ต้องไม่บอกในสัมภาษณ์

| ❌ ห้ามพูด | ✅ พูดแบบนี้แทน |
|-----------|----------------|
| "AI เขียนให้" | "ใช้ AI เป็น pair programmer แต่ผมเขียนเองเพื่อเรียนรู้" |
| "ไม่ได้ test" | "Test สำหรับ core business logic, plan to add e2e ใน Tier 3" |
| "ไม่รู้ทำไมเลือกอันนี้" | "ตอนนั้นพิจารณา X กับ Y — เลือก X เพราะ Z" |
| "Stack Overflow บอกให้ทำ" | "อ่าน docs + พิจารณา trade-off" |
| "ยังไม่ได้ deploy" | "Live demo ที่ [URL]" |

---

## 🎓 Universal Interview Tips

### 1. Use STAR format สำหรับ behavioral questions
- **Situation:** context
- **Task:** what needed to be done
- **Action:** what YOU did
- **Result:** outcome + lessons

### 2. ตอบ "ทำไม" ทุกครั้ง
- ไม่พอบอกว่าใช้ Prisma — บอกทำไมเลือก Prisma over alternatives
- Decision rationale = senior signal

### 3. Honest about limitations
- "Float for prices is suboptimal — would use Decimal for production"
- "ไม่มี 2FA — out of scope but would add"
- Showing self-awareness > pretending perfect

### 4. Ask clarifying questions
- "Are you asking about user-facing security or DB-level?"
- "Production scale or prototype scale?"
- Shows critical thinking

### 5. Walk through code mentally
- "Let me think through this..."
- ดีกว่า rush to wrong answer
- Show problem-solving process

---

## 🎯 Career Strategy Notes

### When to start applying

| Status | Apply? |
|--------|--------|
| Sprint 1-4 only | No — too early |
| Tier 1 complete (3 projects) | ✓ Start junior fullstack |
| Tier 2 complete | ✓ Start mid-level |
| Tier 3 complete | ✓ Strong candidate at mid+ |
| Tier 4 specialization | ✓ Senior/specialist roles |

### Companies to target

**Best fit for your background (frontend → fullstack):**
- Product companies with React frontend (transition is natural)
- Startups (touch many areas, less specialized)
- Fintech (your trading interest = domain bonus)

**Strategic GitHub profile:**
- Pin all 3 Tier 1 projects + Kanban (4 pinned)
- Profile README with 1-line description each
- Active green squares (commit consistently)
