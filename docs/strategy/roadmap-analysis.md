# 🎯 Strategic Roadmap Analysis — Fullstack Journey

> สร้างวันที่ 2026-06-15 หลังจบ Sprint 1 Issue #2-#5
> เป้าหมาย: ป้องกัน expensive mistakes ใน 8-10 เดือนข้างหน้า

---

## 📊 Executive Summary

| ตัวชี้วัด | ปัจจุบัน | เป้าหมาย | สถานะ |
|----------|---------|---------|-------|
| Sprint progress | 0.5 ของ Sprint 1 | Sprint 16 | 3% (on track) |
| Skills เรียนแล้ว | Next.js App Router, Prisma 7, Schema design | Fullstack + Specialty | 5% |
| Portfolio projects | 0 ที่เสร็จ | 3-5 ที่ deploy + อธิบายได้ | 0% |
| Time spent | ~1 session | ~280-400 hrs total | <1% |

**Verdict:** Setup phase แข็งแกร่ง — เริ่มต้นได้ดี แต่ Sprint 2-3 จะเป็นจุดวัดผลที่แท้จริง

---

## 🚨 5 จุดเสี่ยงสูงสุดที่ต้องระวัง (ทั้ง roadmap)

### Risk #1: "Tutorial Hell" — เรียนแต่ไม่ build เอง
**สัญญาณ:**
- copy code จาก Claude/StackOverflow ทุกบรรทัด
- อธิบายโค้ดตัวเองไม่ได้
- รู้สึก "ทำเสร็จเร็ว" แต่จำอะไรไม่ได้

**ป้องกัน:**
- LEARN mode ใน CLAUDE.md — เคารพมัน
- ก่อน close issue ลองอธิบาย code กลับให้ Claude ฟัง
- เขียน decision log ทุก Phase

---

### Risk #2: Auth Sprint จะกินเวลาเกินคาด 2-3 เท่า
**ทำไม:** Auth.js v5 ใหม่, docs ยังกำลังพัฒนา, edge case เยอะ

**ปัญหาที่ junior dev เจอบ่อย:**
- Session strategy ตัดสินใจไม่ถูก (JWT vs Database)
- Middleware ทำ infinite redirect loop
- Password hash ผิดวิธี (rounds น้อย, ลืม salt)
- Production callback URL ไม่ตรง

**คาดการณ์:** Sprint 1 (auth task) อาจกินเวลาจริง 12-18 ชม. ไม่ใช่ 4-6 ชม.

**ป้องกัน:**
- อ่าน auth-deep.md ก่อนเริ่ม implement
- ทำ JWT strategy ก่อน (ง่ายกว่า — เก็บใน cookie)
- Test การ logout + protected route ทันทีหลัง login พัง

---

### Risk #3: External API ใน Sprint 5-7 (Portfolio Tracker)
**ปัญหา:** Finnhub/Alpaca อาจเปลี่ยน free tier, rate limit, หรือ deprecate ภายในปี

**ผลกระทบ:**
- โค้ดที่เขียนใช้ไม่ได้
- เสียเวลา migrate ระหว่าง sprint

**ป้องกัน:**
- ก่อนเริ่ม Sprint 5 — รีเช็ค status ของ API provider
- Abstract API call ผ่าน adapter pattern (เปลี่ยน provider ง่าย)
- Cache aggressive ตั้งแต่วันแรก (เคย dev mode ก็ cache)

---

### Risk #4: WebSocket + Vercel ใน Tier 2 (Kanban)
**ปัญหา fundamental:** Vercel Serverless **ไม่รองรับ persistent connection** — WebSocket ตามปกติใช้ไม่ได้

**ทางแก้:**
1. ใช้ managed service: **Pusher**, **Ably**, **Supabase Realtime** (แนะนำสำหรับ project นี้)
2. แยก WebSocket server: deploy บน Railway/Render (เพิ่ม infra)
3. ใช้ **Server-Sent Events (SSE)** บน Vercel แทน (one-way only — เพียงพอสำหรับ broadcast)

**คาดการณ์:** ตัดสินใจตรงนี้กระทบ architecture ทั้ง project

**ป้องกัน:**
- ก่อนเริ่ม Sprint 11 — ตัดสินใจ architecture ก่อน
- ทดลอง POC เล็กๆ (3-5 ชม.) ก่อน commit แนวทาง

---

### Risk #5: Burnout ที่ Sprint 7-10
**สัญญาณ:** 
- % สำเร็จลดลงต่อเนื่อง 2-3 sprint
- ใช้เวลานานขึ้นเรื่อยๆ
- ไม่อยากเปิด project

**ทำไม Sprint 7-10:** หลัง honeymoon period (Sprint 1-4 ใหม่ๆ ทุกอย่าง) → Sprint 5-7 มี API + cache ที่ซับซ้อน → Sprint 8-10 background jobs ที่ frontend dev ไม่คุ้น → **3 sprints ติดที่ความรู้ใหม่หนัก**

**ป้องกัน:**
- ตั้ง buffer 1 สัปดาห์ระหว่าง Sprint 7 → 8 (พัก)
- ถ้าเริ่มรู้สึกหนัก — ลด scope ก่อนกัด timeline
- กลับมาเล่นกับ Trading Journal (project 1 ที่ทำเสร็จ) — fulfillment สูง

---

## 🗺️ Per-Sprint Reality Check

### Sprint 1 — Setup + Auth (สัปดาห์ 1-2) ⚡ กำลังทำ

**Estimate ใน TOR:** 7-14 ชม.
**Realistic estimate:** 14-20 ชม.

**Hidden complexity:**
- Prisma 7 มี config pattern ใหม่ที่ docs ยังไม่ครบ ✓ (เจอแล้ว)
- Auth.js v5 session strategy ตัดสินใจ
- Route protection patterns 3 แบบ (middleware, layout, Server Action)

**Skills needed (ที่ยังไม่มี):**
- bcrypt mental model
- Cookie / Session lifecycle
- Next.js middleware

**Pitfall ที่ใกล้จะเจอ:**
- ⚠️ Issue #6 (Auth) จะใช้ time 5-8 ชม. ไม่ใช่ 2-3
- ⚠️ Server Action vs API Route สำหรับ register/login — Server Action ดีกว่าแต่ syntax ใหม่

---

### Sprint 2 — Trade CRUD (สัปดาห์ 3-4)

**Estimate:** 7-14 ชม.
**Realistic:** 10-15 ชม. (frontend strength)

**ของง่ายสำหรับคุณ (frontend dev):**
- Form UI + validation feedback
- Optimistic update

**ของยาก:**
- **Decimal vs Float** — เลือกผิดตอนนี้ = bug ตอน production
- **Server Component vs Client Component** สำหรับ form (form ต้อง client แต่ submit ผ่าน Server Action)
- **Image upload** สำหรับ screenshot trade (ถ้าจะมี) — ตัดสินใจไม่ทำตอนนี้ (out of scope)

**คำถามที่ควรตอบก่อนเริ่ม:**
1. Form submit ผ่าน Server Action หรือ API route?
2. Decimal/Float — เลือกอันไหน?
3. validation message ส่งกลับยังไง? (Zod error format)

---

### Sprint 3 — Stats + Dashboard (สัปดาห์ 5-6)

**Estimate:** 7-14 ชม.
**Realistic:** 12-18 ชม.

**จุดที่จะติด:**
- **Aggregation query ใน Prisma** — `groupBy()` พื้นฐานทำได้ แต่ window function (running sum สำหรับ equity curve) ต้อง raw SQL
- **Date bucketing** — group by month/week ใน Prisma ไม่ตรงไปตรงมา
- **N+1 problem** — ดึง trade + tags = ระเบิด

**Pre-reading ที่ควรทำ:**
- Prisma `groupBy`, `aggregate` docs
- `prisma.$queryRaw` สำหรับ complex query

**Performance milestone ที่ Sprint 3:**
- ที่ 100 trades — ปกติ
- ที่ 10,000 trades — ต้องมี index
- ที่ 100,000 trades — ต้อง materialized view (Tier 3 ค่อยคิด)

---

### Sprint 4 — Filter + Deploy + README (สัปดาห์ 7-8)

**Estimate:** 7-14 ชม.
**Realistic:** 10-15 ชม.

**Trap ที่ junior เจอบ่อย:**
- **Pagination strategy** — offset vs cursor — junior ส่วนใหญ่ใช้ offset (พังที่ scale)
- **Vercel environment variable** — ลืมตั้ง DATABASE_URL → prod พัง
- **Neon connection pooling** — ต้องใช้ pooled URL ไม่ใช่ direct (ใน prod)
- **NextAuth secret** — ลืมตั้ง = production session ไม่ทำงาน

**Deploy checklist (ก่อนกด Deploy):**
- [ ] All env vars set ใน Vercel
- [ ] DATABASE_URL ใช้ pooled connection (Neon)
- [ ] AUTH_SECRET (or NEXTAUTH_SECRET) set
- [ ] Run `prisma migrate deploy` ใน build command
- [ ] Test register/login flow ใน prod URL

**คาดการณ์:** Day 1 deploy = พัง 80% (ปกติ) — เวลา debug 2-4 ชม.

---

### Sprint 5-7 — Portfolio Tracker (สัปดาห์ 9-13)

**Estimate:** 21 ชม. (3 sprints × 7 ชม.)
**Realistic:** 30-40 ชม.

**สิ่งที่กระโดดขึ้นในความยาก:**

#### Caching Strategy (Sprint 6 หัวใจ)
- ที่ใช้: Database table `PriceCache` (ตาม TOR)
- ดีพอสำหรับ project นี้ แต่...
- ⚠️ Race condition ระหว่าง concurrent requests ดึง price พร้อมกัน
- ⚠️ Cache stampede เมื่อ cache expire พร้อมกัน

**Pattern ที่ต้องเรียน:**
- **Stale-while-revalidate** — serve old, refresh in background
- **Single-flight** — concurrent request รวมเป็น 1 fetch
- **Exponential backoff** — เมื่อ API error

#### External API Pitfalls
- **Rate limit error 429** — ต้อง handle + backoff
- **API key rotation** — ทำยังไงเมื่อ key หลุด
- **Mock ใน dev** — ห้ามเรียก real API ตอน hot reload
- **Time zone** — API คืน UTC, ผู้ใช้อยู่ +07

**คำถามสัมภาษณ์ที่ project นี้ตอบได้:**
- "Cache invalidation strategy?"
- "How do you handle external API outage?"
- "Why DB cache vs Redis?"

---

### Sprint 8-10 — Price Alert (สัปดาห์ 14-19) — ยากที่สุดใน Tier 1

**Estimate:** 21 ชม.
**Realistic:** 30-45 ชม. (concept ใหม่หนัก)

**ทำไมยาก:**
- Background job เป็น **paradigm shift** จาก request-response
- Idempotency ต้องคิดทุก step
- Vercel Cron มี constraint เยอะ

**Vercel Cron Limitations (พึงระวัง):**
- Free tier: ทุก daily หรือ weekly เท่านั้น (ไม่ใช่ทุก 5 นาที!)
- **Pro tier ($20/mo)** ต้องใช้ ถ้าอยาก cron ทุก 5 นาที
- Timeout limit 10 วินาที (Hobby) / 60 วินาที (Pro)
- Function size limit 50 MB

**ทางเลือกถ้าไม่อยากจ่าย:**
1. **GitHub Actions schedule** — ฟรี, cron ทุก 5 นาที, ยิง webhook ไป Vercel
2. **Upstash QStash** — ฟรี tier 500/วัน
3. **EasyCron / Cron-job.org** — ฟรี HTTP cron

**คาดการณ์:**
- คุณอาจต้องเปลี่ยน strategy ระหว่าง Sprint 8 → 9
- เผื่อ buffer 30%

**Skills ที่จะได้ (สูงค่า):**
- ระบบ background processing
- Idempotency patterns
- Distributed systems thinking

---

### Sprint 11-13 — Realtime Kanban (Tier 2) — Showcase Project

**Estimate:** 14-21 ชม.
**Realistic:** 25-35 ชม.

**Decision point ที่จะทำตอนเริ่ม:**

| ทาง | Pros | Cons |
|-----|------|------|
| **Supabase Realtime** ⭐ แนะนำ | Free, integrated, ไม่ต้อง infra เพิ่ม | Lock-in กับ Supabase |
| **Pusher / Ably** | Industry standard | Free tier limited |
| **Socket.IO บน Railway/Render** | Full control | Infra เพิ่ม, deploy ซับซ้อน |
| **SSE บน Vercel** | ใช้ infra เดิม | One-way only (server→client) |

**Hidden complexity:**
- **Conflict resolution** — last-write-wins (ง่าย) vs operational transforms (ยากมาก)
- **Fractional indexing** — `position: float` แทน `position: int` (โจทย์ใน TOR)
- **Optimistic update rollback** — เริ่ม animation ต่ออยู่ดี client ก็ rollback แล้ว

**ทำไม project นี้เป็น "Portfolio Star":**
- โชว์ในสัมภาษณ์ได้ทันที (เปิด 2 แท็บ)
- frontend dev ที่ทำ realtime ฝั่ง server = หายาก
- WebSocket = "senior" signal

---

### Sprint 14-15 — E-commerce (Tier 2)

**Estimate:** 14 ชม.
**Realistic:** 20-25 ชม.

**Killer feature ของ project นี้:** Transaction + Race Condition

**Pattern ที่ต้อง implement:**
```typescript
// Wrong (race condition):
const product = await prisma.product.findUnique({ where: { id } })
if (product.stock >= quantity) {
  await prisma.product.update({
    where: { id },
    data: { stock: product.stock - quantity }
  })
}

// Right (atomic):
await prisma.$transaction(async (tx) => {
  const updated = await tx.product.updateMany({
    where: { id, stock: { gte: quantity } },
    data: { stock: { decrement: quantity } }
  })
  if (updated.count === 0) throw new Error("Out of stock")
  // create order...
})
```

**Test strategy:**
- ยิง 100 concurrent requests ซื้อชิ้นสุดท้าย
- ต้องมีแค่ 1 success — ที่เหลือ "out of stock"

**Interview gold:** "ออกแบบยังไงไม่ให้ขายเกิน stock"

---

### Tier 3 — Production-Grade (Sprint 16-18)

**Estimate:** 14-21 ชม.
**Realistic:** 30-50 ชม. (DevOps มี learning curve เยอะ)

**สิ่งที่ frontend dev ส่วนใหญ่ไม่เคยคิด:**

#### Docker (10-15 ชม.)
- Dockerfile multi-stage build
- docker-compose สำหรับ dev (Postgres + Redis + App)
- Volume mounting / .dockerignore
- Image size optimization

#### CI/CD (5-10 ชม.)
- GitHub Actions workflow syntax
- Secret management ใน GH
- Test → Build → Deploy chain
- Branch protection

#### Observability (10-15 ชม.)
- Sentry setup (error tracking)
- Vercel Analytics หรือ PostHog
- Structured logging (Pino, Winston)
- Custom metrics

**Decision:** เลือกแค่ 1 project มายกระดับ — ผมแนะนำ **Trading Journal** เพราะ:
- ทำเป็นคนแรก เข้าใจสุด
- Mock data ง่ายสำหรับ load test
- Caching เหมาะกับ stats query

---

### Tier 4 — Specialization (Sprint 19+)

**Recommendation:** ทาง A (Algorithmic Trading) ตรงกับ passion + niche

**ระยะเวลา:** เปิดกว้าง 2-6 เดือน

**Caveat:** ตอนถึง Tier 4 — โลกจะเปลี่ยน, AI tools ใหม่จะมี → re-evaluate TOR ทุกอย่าง

---

## 📅 Realistic Timeline Adjustment

| | TOR Estimate | Realistic | Buffer recommendation |
|--|--------------|-----------|----------------------|
| Tier 1 (P1-P3) | 3-3.5 เดือน | **4-5 เดือน** | +30% |
| Tier 2 (P4-P5) | 2-2.5 เดือน | **3 เดือน** | +25% |
| Tier 3 | 1-1.5 เดือน | **2 เดือน** | +33% |
| Tier 4 | 2+ เดือน | **3-6 เดือน** | open-ended |
| **รวม** | **8-10 เดือน** | **12-16 เดือน** | |

> **อย่าตกใจ** — เป้าหมายคือ "เรียนรู้" ไม่ใช่ "ตามตาราง" — slip OK ถ้าเรียนจริง

---

## 🔗 Cross-Project Synergy Map

ทักษะที่ project แรกสร้าง → ใช้ใน project ถัดไป (อย่าเรียนใหม่ทุกครั้ง):

```
Trading Journal              Portfolio Tracker              Price Alert
─────────────────            ─────────────────             ─────────────
✓ Auth.js setup        ───►  ✓ Reuse exact pattern    ───►  ✓ Reuse
✓ Prisma + Postgres    ───►  ✓ Reuse                  ───►  ✓ Reuse
✓ Zod validation       ───►  ✓ Reuse + extend         ───►  ✓ Reuse
✓ Stats aggregation    ───►  ✓ Portfolio summary       ───►  (n/a)
✓ Vercel deploy        ───►  ✓ Same flow              ───►  + Cron config
                             ✓ External API call      ───►  ✓ Reuse
                             ✓ Caching                ───►  ✓ Reuse
                                                      ✓ Background job  ──► Tier 3 BullMQ
                                                      ✓ Notification    ──► Tier 3 queue


Tier 2 (Kanban/E-commerce)                              Tier 3 (Production)
─────────────                                          ─────────────
                                                      All previous patterns reused
✓ WebSocket/SSE                                       + Docker
✓ Transaction + race condition  ─────────────────►   + CI/CD
✓ Optimistic update                                  + Observability
                                                      + Caching layer (Redis)
```

**Key insight:** เริ่มจาก Sprint 5 — คุณจะรีไซเคิล pattern ของ Sprint 1-4 — 50-70% ของเวลาจะลดลงสำหรับ "boilerplate"

---

## 🎯 Strategic Recommendations

### Recommendation #1: เปลี่ยน Issue #7 (Protect routes) เป็น **standalone learning**
**ทำไม:** middleware pattern จะใช้ใน 5 projects — ลงทุนเข้าใจให้ลึกตอนนี้ → reuse 100%

### Recommendation #2: Decision Log ตั้งแต่ Sprint 1
**ทำไม:** Sprint 1 ตัดสินใจหลายอย่างแล้ว (Neon, Prisma 7, App Router) — บันทึก rationale ตอนนี้, รำลึกได้ตอนสัมภาษณ์

### Recommendation #3: Build "Project Bible" — README.md ที่ดีในทุก project
**ขั้นต่ำต้องมี:**
- Architecture diagram
- Tech stack + rationale (ทำไมเลือก X over Y)
- Setup instructions (ที่ทำตามจริงได้)
- Live demo link
- "Production considerations" section
- "What I'd do differently" reflection

### Recommendation #4: Mock Interview ทุกจบ Sprint
**ทำไม:** ความรู้ที่ใหม่ — ลืมเร็ว — ทบทวนผ่านคำถามสัมภาษณ์ = active recall

### Recommendation #5: ตั้ง Public GitHub README สำหรับ profile
**ทำไม:** recruiter ดู GitHub profile ก่อนเปิด resume — มี README ที่ list projects ของคุณ + 1-line description

---

## 💡 Hidden Opportunities (สิ่งที่ TOR ไม่ได้บอก)

### Opportunity #1: Open Source Contribution ระหว่าง Sprint 6-10
**ทำไม:** ตอนนั้นคุณจะรู้จัก Prisma, Next.js, Auth.js ดี — contribute docs/typo fix → portfolio piece + signal "ตัวจริง"

### Opportunity #2: Blog Post ทุกจบ Project
**ทำไม:**
- บังคับให้คุณอธิบายได้
- SEO traffic ตามมา (อาจมี recruiter เจอ)
- กลายเป็น portfolio ที่อ่านได้

**หัวข้อแนะนำ:**
- "Building a Trading Journal: Lessons from a Frontend Dev's First Backend"
- "Caching Strategies for External APIs"
- "Race Conditions in E-commerce: A Practical Guide"

### Opportunity #3: ทำ "Component Library" ส่วนตัวระหว่าง Sprint 3-4
**ทำไม:** shadcn components + business logic ที่คุณใช้ซ้ำ (TradeCard, StatsBadge, etc.) → portfolio piece + เร่ง Sprint 5+

---

## ⚠️ Warning Signs ที่ควร trigger "หยุดคิด"

| สัญญาณ | หมายความว่า | ทำยังไง |
|--------|-------------|---------|
| % Sprint ตกต่อเนื่อง 2 sprint | Pace ไม่ยั่งยืน | ลด scope ก่อนกัด timeline |
| Copy code โดยไม่เข้าใจ | กลับสู่ tutorial hell | สลับ LEARN mode + อธิบายกลับ |
| Skip test ทุก sprint | สะสม technical debt | Test 1 happy path ก่อน push |
| Burn out 2 สัปดาห์ติด | overload | พัก 1 สัปดาห์ ไปเล่นโจทย์เล็กๆ |
| Push สูตรลับ (.env, key) ขึ้น git | security gap | rotate ทันที + git history rewrite |

---

## 🏁 ภาพรวม 6 เดือนแรก (เน้นเป้าหมายจ้างงาน)

หลัง 6 เดือน คุณ should have:
- ✅ 3 deployed projects (Tier 1)
- ✅ GitHub profile ที่อ่านง่าย + active
- ✅ Decision logs + READMEs ที่อธิบายเหตุผล
- ✅ พื้นฐาน auth/db/api/cache ที่อธิบายในสัมภาษณ์ได้
- ✅ 1 project ที่ "wow" (Tier 2 Kanban หรือ E-commerce ถ้าทำเสร็จก่อน)

**Career checkpoint ที่ 6 เดือน:** เริ่มสมัครงาน junior fullstack ได้แล้ว — ไม่ต้องรอจบ Tier 4

> 🎯 **Honesty check:** เก่งกว่า junior frontend dev ที่ไม่เคยทำ backend แน่ — แต่ junior fullstack ที่เรียนมาเป็นปี อาจยังเก่งกว่า → คาดหวัง entry-level + เจริญต่อ

---

## 🤖 ปรึกษา Claude ในอนาคต

**ทุก 2 sprint** กลับมาดูไฟล์นี้ + อัปเดต:
- อะไรที่ผม underestimate?
- Risk ไหนที่เกิดจริง?
- Recommendation ไหนที่ทำตาม / ไม่ตาม?

**ทุก project จบ** ขอ Claude:
- Mock interview สำหรับ project นั้น
- Review architecture decisions
- Suggest README structure

**Strategic checkpoint (Sprint 4, 7, 10, 13, 15):**
- ดู PROGRESS.md + ไฟล์นี้
- ถาม Claude: "ไหลตามแผนไหม? ต้องปรับอะไร?"

---

> **ปิดท้าย:** Roadmap นี้ตั้งมาตรฐานสูง — slip ได้, ไม่ตาม timeline เป๊ะได้ — แต่ **อย่าเลิก** ความสำเร็จที่ Tier 1 จบแล้วก็เปลี่ยน career ได้แล้ว ทุก sprint ที่จบ = ก้าวจริง
