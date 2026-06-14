# 🎤 Interview Prep — Trading Journal (Project 1)

> Reference สำหรับใช้ตอนสัมภาษณ์ — open ก่อนสัมภาษณ์ 2 ชม.
> เลือก answer template ที่ตรงกับ project ของคุณ — modify ตามจริง

---

## 🎯 1-Minute Pitch

> "ผม built Trading Journal เป็น web app ให้นักเทรดบันทึกการเทรดและเห็นสถิติ ใช้ Next.js 16 App Router + TypeScript + Prisma + Postgres บน Neon
>
> มี authentication ด้วย Auth.js, scope ทุก query ด้วย userId เพื่อ data isolation, validate input ด้วย Zod ทั้ง client และ server
>
> Aggregation query คำนวณ win rate, P&L, equity curve จาก Prisma — ระวัง N+1 problem
>
> Deploy บน Vercel — auto-deploy จาก main branch ผ่าน GitHub"

---

## 💪 Skills ที่ Project นี้ Demonstrate

| Skill | จาก part ไหน | Interview signal |
|-------|-------------|------------------|
| **Full-stack TypeScript** | ทั้ง project | "comfortable end-to-end" |
| **Database design** | Schema (User/Trade/Tag M:N) | "thinks about relations + constraints" |
| **Authentication** | Auth.js + middleware | "understands session/JWT" |
| **Authorization (RBAC light)** | userId scoping | "thinks about multi-tenancy" |
| **Input validation** | Zod + server-side | "doesn't trust client" |
| **SQL aggregation** | Stats dashboard | "can think in sets" |
| **Cloud deploy** | Vercel + Neon | "production-ready mindset" |

---

## 🔥 Common Interview Questions

### Q1: "Walk me through your data model"

**Strong answer:**
> "3 main entities: User, Trade, Tag
>
> User has many Trades (1:N) and many Tags (1:N) — both scoped by userId
>
> Trade has Many-to-Many with Tag — implemented as implicit join table in Prisma (_TagToTrade)
>
> Trade has interesting fields:
> - `side` enum (LONG/SHORT) because P&L calculation depends on direction
> - `exitPrice` and `exitDate` are optional — supports both open and closed trades
> - `Float` for prices (ในงาน production จะใช้ Decimal เพื่อกัน floating point issue)
>
> Tag has composite unique constraint `@@unique([userId, name])` — allows different users to have tag with same name, but unique within a user"

**Pitfall:** ห้ามตอบแค่ "มี table A, B, C" — ต้องอธิบาย *why* แต่ละ design choice

---

### Q2: "How do you handle authentication?"

**Strong answer:**
> "ใช้ Auth.js v5 with Credentials provider + JWT strategy
>
> Register flow แยกออก (Auth.js ไม่จัดการให้):
> 1. Validate input ด้วย Zod
> 2. Check duplicate email
> 3. bcrypt hash password (round 12)
> 4. INSERT user
>
> Login flow ใช้ `signIn('credentials', ...)`:
> 1. Auth.js เรียก `authorize()` callback
> 2. ใน callback: lookup user → bcrypt.compare password
> 3. Return user data → Auth.js สร้าง JWT
> 4. JWT stored in HttpOnly + Secure + SameSite cookie
>
> Route protection ผ่าน middleware.ts — redirect unauthenticated users ก่อน reach page
>
> ทุก API mutation ตรวจ session + scope by userId เสมอ"

---

### Q3: "Why JWT not session-based?"

**Strong answer:**
> "Trade-offs ระหว่าง 2 approaches:
>
> JWT pros: stateless (scale ง่าย), no DB lookup per request, edge runtime friendly
>
> JWT cons: logout ทันทีไม่ได้ (token ยัง valid จนหมดอายุ), token size ใหญ่กว่า
>
> สำหรับ project นี้ JWT ดีกว่าเพราะ:
> 1. Next.js + Vercel — edge runtime ได้ประโยชน์จาก stateless
> 2. Auth.js v5 default คือ JWT — pattern ชัดเจน
> 3. Trading Journal ไม่ใช่ banking — logout delay 15-60 นาทียอมรับได้
>
> Mitigation สำหรับ JWT weakness:
> - exp 1 hour (sliding refresh)
> - HttpOnly cookie กัน XSS
> - ใส่ tokenVersion ใน user table — increment ตอน password change → revoke ทุก session เก่า"

---

### Q4: "How do you prevent user A from seeing user B's data?"

**Strong answer:**
> "Defense in depth — 3 layers:
>
> **Layer 1: Schema design**
> ทุก user-data table มี `userId` foreign key เป็น required field
>
> **Layer 2: API authentication**
> ทุก API endpoint ตรวจ session ก่อน — ถ้า unauthorized → 401
>
> **Layer 3: Query scoping**
> ทุก Prisma query ใส่ `where: { userId: session.user.id }` เสมอ — ห้ามมี query ไม่ scope
>
> สำหรับ update/delete — ใช้ `updateMany`/`deleteMany` แทน `update`/`delete` เพื่อ scope ใน WHERE:
>
> ```typescript
> // ❌ Wrong (allows deleting other user's data if know ID):
> await prisma.trade.delete({ where: { id } })
>
> // ✅ Right (only delete if owner):
> await prisma.trade.deleteMany({ where: { id, userId: session.user.id } })
> ```
>
> Test case: integration test ที่ User A พยายามแก้ของ User B → ต้อง 404 ไม่ใช่ 403 (กัน user enumeration)"

---

### Q5: "How does your P&L calculation work?"

**Strong answer:**
> "P&L คำนวณ server-side เสมอ — ห้าม trust client
>
> สูตร:
> - LONG: `(exitPrice - entryPrice) * size - fee`
> - SHORT: `(entryPrice - exitPrice) * size - fee`
>
> เก็บใน DB (precomputed) เพราะ:
> 1. Stats query เร็วกว่า (ไม่ต้องคำนวณตอน aggregate)
> 2. ถ้าสูตรเปลี่ยน — ต้อง backfill (acceptable trade-off)
>
> Alternative: คำนวณตอน query (computed) — ดีถ้าสูตรเปลี่ยนบ่อย
>
> สำหรับ open trade (no exitPrice) — `pnl = null`
>
> Validation:
> - entry/exit price ต้อง > 0
> - exitDate ต้อง >= entryDate
> - size ต้อง > 0
>
> Edge case ที่ test:
> - Long trade ขาดทุน
> - Short trade กำไร (price ลง = กำไร — counter-intuitive!)
> - Breakeven (entry = exit)"

---

### Q6: "Aggregation query — how do you calculate win rate?"

**Strong answer:**
> "Win rate = closed_winning_trades / closed_trades * 100
>
> ใช้ Prisma `groupBy` + `count`:
>
> ```typescript
> const stats = await prisma.trade.groupBy({
>   by: ['userId'],
>   where: {
>     userId: session.user.id,
>     exitPrice: { not: null },   // closed trades only
>   },
>   _count: { id: true },
>   _sum: { pnl: true },
> })
>
> const winning = await prisma.trade.count({
>   where: {
>     userId: session.user.id,
>     exitPrice: { not: null },
>     pnl: { gt: 0 },
>   }
> })
>
> const winRate = (winning / stats[0]._count.id) * 100
> ```
>
> **Issue:** 2 queries — ที่ scale ใหญ่อาจช้า — optimize ด้วย raw SQL aggregation"

---

### Q7: "What's the N+1 problem? Did you encounter it?"

**Strong answer:**
> "N+1 = 1 query ดึง list (N rows) + N query ดึง related data ของแต่ละ row → total N+1 queries
>
> เจอตอนแสดง trade list with tags:
>
> ```typescript
> // N+1 (slow):
> const trades = await prisma.trade.findMany({ where: { userId } })  // 1 query
> for (const trade of trades) {
>   trade.tags = await prisma.tag.findMany({ where: { trades: { some: { id: trade.id } } } })
>   // N queries — 1 per trade!
> }
> ```
>
> แก้ด้วย Prisma `include`:
>
> ```typescript
> const trades = await prisma.trade.findMany({
>   where: { userId },
>   include: { tags: true },   // 1 query + 1 join query
> })
> ```
>
> Behind the scenes Prisma รัน 2 queries แล้ว join ใน application:
> 1. SELECT trades
> 2. SELECT tags WHERE tradeId IN (...)
>
> ไม่ใช่ true SQL JOIN แต่ดีกว่า N+1
>
> ที่ scale 10,000 trades → SQL JOIN raw query ดีกว่า"

---

### Q8: "How do you validate user input?"

**Strong answer:**
> "Defense in depth — 3 layers:
>
> **Frontend (UX):** React Hook Form + Zod schema — แสดง error realtime ตอนกรอก
>
> **API server (Security):** Zod parse ใน API route ก่อนแตะ DB — ถึงแม้ frontend validation pass ก็ต้อง validate ใหม่
>
> **Database (Last line):** Prisma schema constraints (`@unique`, `Float`, NOT NULL, foreign key)
>
> ตัวอย่าง schema สำหรับ create trade:
>
> ```typescript
> const createTradeSchema = z.object({
>   symbol: z.string().min(1).max(20),
>   side: z.enum(['LONG', 'SHORT']),
>   entryPrice: z.number().positive(),
>   exitPrice: z.number().positive().optional(),
>   size: z.number().positive(),
>   entryDate: z.coerce.date(),
>   exitDate: z.coerce.date().optional(),
>   notes: z.string().max(2000).optional(),
> }).refine(
>   data => !data.exitDate || data.exitDate >= data.entryDate,
>   { message: 'Exit date must be after entry date' }
> )
> ```
>
> Why server-side critical: anyone can bypass frontend ด้วย DevTools, curl, Postman"

---

## 🪤 Pitfall Questions (สิ่งที่ junior หลุดบ่อย)

### Pitfall Q1: "ถ้าผู้ใช้กรอก price = -100 จะเกิดอะไร?"

**Wrong answer:** "ผม validate ฝั่ง frontend แล้ว"
**Why wrong:** bypass ได้ด้วย curl

**Right answer:**
> "Zod schema ฝั่ง server reject ก่อน — `.positive()` constraint
>
> ถ้าหลุด validation ก็ยังมี DB level: `entryPrice Float` — แต่ Float ไม่กัน negative
>
> Better: Custom Prisma constraint check (CHECK constraint) — แต่ Prisma 7 ยัง support partial
>
> Practical: ใช้ Zod เป็น primary defense + integration test"

---

### Pitfall Q2: "ถ้า traffic เพิ่ม 100 เท่า — ที่ไหนจะพังก่อน?"

**Strong answer:**
> "Most likely bottlenecks (ordered by likelihood):
>
> 1. **Stats dashboard query** — aggregation บน user's all trades — ที่ 10k trades/user × 100x users = slow
>    → Fix: index on (userId, entryDate), denormalize stats เก็บ snapshot
>
> 2. **N+1 ใน trade list with tags** — ถ้า user มี 1000 trades = 1001 queries
>    → Fix: pagination + Prisma include
>
> 3. **bcrypt ตอน login** — 200ms/login × 1000 concurrent = block
>    → Fix: worker pool, async bcrypt, JWT exp longer to reduce login frequency
>
> 4. **Single DB connection** — Vercel cold start ทุกครั้ง = new connection
>    → Fix: Prisma connection pooling, Neon serverless driver
>
> Measure first ด้วย Vercel Analytics — อย่าเดา"

---

### Pitfall Q3: "ทำไมไม่ใช้ MongoDB?"

**Strong answer:**
> "Trading Journal data มี structured relations (User → Trade → Tag) + need aggregation (stats)
>
> Postgres + Prisma ดีกว่าเพราะ:
> 1. JOIN performance ของ relational DB ดีกว่า
> 2. ACID transactions สำหรับ stats consistency
> 3. SQL aggregation features (GROUP BY, window functions)
> 4. Schema enforcement = lower risk of inconsistent data
>
> MongoDB ดีกว่าเมื่อ:
> - Schema เปลี่ยนบ่อย (เราไม่)
> - Document-oriented data (เราไม่)
> - Massive horizontal scale (เราไม่ถึง)
>
> Decision frame: 'Structure data?' → SQL. 'Unstructured/document?' → NoSQL"

---

## 🏆 Showcase Talking Points

### Point 1: "I treated this as production code, not tutorial"
- Decision log ทุก major choice
- Defense in depth ทุก security concern
- Error handling + edge case
- README + architecture diagram

### Point 2: "I refactored when I learned better"
- Sprint 1 ตัดสิน Prisma 7 + Neon
- Sprint 3 จะ refactor stats สำหรับ performance
- Sprint 4 จะเพิ่ม pagination เมื่อ list ยาว

### Point 3: "I understand the gaps"
- Float vs Decimal — known issue, deferred to Tier 3
- No 2FA — out of scope, would add for production
- No rate limiting — known weakness, plan to add

> 💡 **Powerful signal:** บอก "what I'd do differently if I had more time" = senior thinking

---

## 📚 Concept Refresher (5-min review)

| Concept | 1-line refresher |
|---------|------------------|
| App Router | File-based routing + Server Components default |
| Server Component | Run on server, query DB directly, no useState |
| Client Component | `"use client"`, interactive, runs in browser |
| Prisma | Type-safe ORM, schema → SQL + TypeScript types |
| Migration | Versioned SQL scripts, immutable history |
| Session vs JWT | Stateful DB lookup vs stateless signed token |
| bcrypt | Slow hash with salt, tunable cost |
| CSRF | SameSite cookie + CSRF token |
| N+1 | Use `include` in Prisma to fetch related data in 1 trip |
| Server-side validation | Never trust client, always Zod parse on server |
