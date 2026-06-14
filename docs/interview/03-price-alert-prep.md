# 🎤 Interview Prep — Price Alert System (Project 3)

> Project focus: **Background jobs + idempotency** — distributed systems building block

---

## 🎯 1-Minute Pitch

> "ผม built Price Alert ให้นักเทรดตั้งเงื่อนไขราคาแล้วระบบเช็คให้อัตโนมัติ ส่ง notification เมื่อเงื่อนไขเป็นจริง
>
> Key challenge: background job ที่รันทุก 5 นาที — solved ด้วย Vercel Cron + idempotency flag กัน notification ซ้ำ
>
> Cron endpoint protected ด้วย secret header — only trigger-able from Vercel infrastructure
>
> Reused price caching layer จาก Portfolio Tracker — same external API + cache strategy"

---

## 💪 Skills ที่ Project นี้ Demonstrate

| Skill | จาก part ไหน | Interview signal |
|-------|-------------|------------------|
| **Background processing** | Cron job | "comfortable beyond request-response" |
| **Idempotency** | Triggered flag | "thinks about edge cases" |
| **Distributed systems** | Job timing, concurrency | "scale-aware" |
| **Notification delivery** | Email/LINE integration | "complete user flow" |
| **Endpoint security** | Cron secret | "defense in depth" |
| **Rate limit handling** | Multi-alert per symbol | "efficient API usage" |

---

## 🔥 Common Interview Questions

### Q1: "How do background jobs work in your project?"

**Strong answer:**
> "Vercel Cron Jobs — declared in `vercel.json`:
>
> ```json
> {
>   \"crons\": [{
>     \"path\": \"/api/cron/check-alerts\",
>     \"schedule\": \"*/5 * * * *\"
>   }]
> }
> ```
>
> Vercel pings the endpoint every 5 minutes — endpoint runs the check logic.
>
> **Flow:**
> 1. Cron triggers `/api/cron/check-alerts`
> 2. Endpoint verifies cron secret in header
> 3. Query all active alerts (untriggered)
> 4. Group by symbol — batch fetch prices (reuse cache layer)
> 5. For each alert: compare price vs condition
> 6. If condition met → send notification + mark `isTriggered: true`
> 7. Log execution time + result
>
> **Alternative considered:**
> - GitHub Actions schedule (more flexible but extra setup)
> - Upstash QStash (managed queue — overkill for now)
> - BullMQ on Render (full job queue — Tier 3 upgrade path)"

---

### Q2: "Why endpoint secret? What if someone calls it?"

**Strong answer:**
> "Cron endpoint is just an HTTP endpoint — anyone with URL could trigger it
>
> **Without secret:** attacker can:
> 1. DDoS — call เร็วๆ = exhaust external API quota
> 2. Trigger notifications storm to confuse users
>
> **Implementation:**
> ```typescript
> export async function GET(req: Request) {
>   const authHeader = req.headers.get('authorization')
>   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
>     return new Response('Unauthorized', { status: 401 })
>   }
>   // ... cron logic
> }
> ```
>
> Vercel automatically sets this header for cron requests (CRON_SECRET env var)
>
> **Bonus security:**
> - IP allowlist (Vercel cron IPs known)
> - Rate limit even authorized calls"

---

### Q3: "What is idempotency? Why important here?"

**Strong answer:**
> "Idempotency = same operation produces same result no matter how many times called
>
> **Trading example:**
> Bitcoin > $50,000 → notify
>
> **Without idempotency:**
> 1. Cron T=0: BTC = $51k → trigger notification ✓
> 2. Cron T=5: BTC = $52k → trigger AGAIN (still > $50k) ❌
> 3. User: spam
>
> **With idempotency (`isTriggered` flag):**
> 1. Cron T=0: trigger + set `isTriggered: true` ✓
> 2. Cron T=5: check `isTriggered === false` → skip
>
> **Edge case:** when to reset? — ใน TOR ถามให้คิดเอง
> - Option A: Manual reset by user (simple)
> - Option B: Auto-reset when price goes opposite direction
> - Option C: Re-arm after N hours
>
> **Decision:** Project นี้ใช้ Option A — explicit user control
> - User reset ผ่าน 'Reactivate' button
> - Avoid spam from price oscillation around threshold
>
> Real-world fintech ใช้ idempotency keys ใน HTTP headers สำหรับ payment processing"

---

### Q4: "How do you handle multiple alerts for same symbol efficiently?"

**Strong answer:**
> "Naive approach (bad):
> - 100 alerts for AAPL = 100 API calls every 5 min
>
> Optimized:
> 1. Group alerts by symbol
> 2. Fetch each unique symbol ONCE per cron run
> 3. Apply to all alerts for that symbol
>
> ```typescript
> const activeAlerts = await prisma.alert.findMany({
>   where: { isActive: true, isTriggered: false }
> })
>
> // Group by symbol
> const symbols = [...new Set(activeAlerts.map(a => a.symbol))]
>
> // Batch fetch (reuse cache from Portfolio Tracker)
> const prices = await Promise.all(
>   symbols.map(s => getPrice(s))
> )
> const priceMap = Object.fromEntries(symbols.map((s, i) => [s, prices[i]]))
>
> // Check all alerts
> for (const alert of activeAlerts) {
>   const currentPrice = priceMap[alert.symbol]
>   const shouldTrigger =
>     (alert.condition === 'ABOVE' && currentPrice >= alert.targetPrice) ||
>     (alert.condition === 'BELOW' && currentPrice <= alert.targetPrice)
>
>   if (shouldTrigger) {
>     await sendNotification(alert)
>     await prisma.alert.update({
>       where: { id: alert.id },
>       data: { isTriggered: true }
>     })
>   }
> }
> ```
>
> **Result:** 1000 alerts on 50 symbols = 50 API calls (not 1000)"

---

### Q5: "What if notification delivery fails?"

**Strong answer:**
> "Multi-layer reliability:
>
> **Layer 1: Retry with exponential backoff**
> ```typescript
> async function sendWithRetry(notification, maxRetries = 3) {
>   for (let i = 0; i < maxRetries; i++) {
>     try {
>       return await send(notification)
>     } catch (err) {
>       if (i === maxRetries - 1) throw err
>       await sleep(2 ** i * 1000)  // 1s, 2s, 4s
>     }
>   }
> }
> ```
>
> **Layer 2: Don't set isTriggered until success**
> ถ้า notification fail → keep isTriggered=false → next cron try again
> Risk: spam if eternal failure → add max_attempts column
>
> **Layer 3: Dead letter queue (Tier 3)**
> Failed notifications go to DLQ → manual investigation
> Project นี้: log to DB table `NotificationLog` พร้อม status
>
> **Layer 4: Alternative channel**
> ถ้า email fail หลาย retry → try LINE notify
> Fall back chain configurable per user"

---

### Q6: "Time zone handling — important here?"

**Strong answer:**
> "Yes — alert ตั้งใจสำหรับ market hours of specific timezone
>
> **Issue:**
> - User Bangkok set 'alert during NYSE hours (9:30 AM EST)'
> - Cron run in UTC
> - Need conversion logic
>
> **Best practice:**
> 1. Store ALL timestamps as UTC in DB (ISO 8601)
> 2. Store user's timezone preference (e.g., 'Asia/Bangkok')
> 3. Convert display timestamps to user's TZ in UI only
> 4. ห้ามใช้ `new Date()` มั่ว — ใช้ `date-fns-tz` หรือ `Temporal` (future)
>
> **For alerts specifically:**
> ถ้า alert has time constraint:
> ```typescript
> // 'Trigger only during 9 AM - 4 PM EST'
> const userTZ = 'America/New_York'
> const nowInUserTZ = zonedTimeToUtc(new Date(), userTZ)
> // ... check hours
> ```
>
> Project นี้: simplification — no time-of-day constraint (out of scope for v1)"

---

### Q7: "What's the worst case if cron fails to run?"

**Strong answer:**
> "Scenario: Vercel platform issue, cron skipped for 30 min
>
> **Impact:**
> - User's alert condition might be met but no notification
> - Slightly delayed notification (5-30 min)
>
> **Mitigation:**
> 1. **Monitoring:** alert on missed cron runs (e.g., last_run > 10 min ago)
> 2. **Catch-up logic:** when cron resumes, check ALL conditions immediately (not wait for next 5-min boundary)
> 3. **User communication:** show 'last checked' timestamp in UI
> 4. **SLA disclaimer:** README says 'notifications within 5-10 min, no guarantee for trading decisions'
>
> **Anti-pattern to avoid:**
> - Storing 'last cron run' in memory — lost on restart
> - Assume cron will always run — must verify
>
> **Production-grade solution:** Move to dedicated queue (BullMQ on Redis) with persistent state + retry"

---

## 🪤 Pitfall Questions

### Pitfall Q1: "What if 2 cron instances run simultaneously?"

**Strong answer:**
> "Vercel guarantees at-most-once execution (no overlap) — but worth considering
>
> **Defenses if it could happen:**
>
> 1. **Idempotency key**
>    Generate unique run_id per cron — log to DB
>    If 2 instances → both try insert same key → one fails (unique constraint)
>
> 2. **Pessimistic lock**
>    Take advisory lock at start: `SELECT pg_advisory_lock(123)`
>    Second instance blocks or skips
>
> 3. **Optimistic flag**
>    `UPDATE cron_runs SET status='running' WHERE id=? AND status='idle'`
>    Check affected rows — 0 = someone else running, skip
>
> **For this project:** trust Vercel guarantee + add observability
>
> **Real-world (Tier 3):** distributed lock with Redis (Redlock algorithm)"

---

### Pitfall Q2: "How do you handle when target price is reached during cron but reverses by next check?"

**Strong answer:**
> "Classic 'should I trigger?' question for tradeoffs
>
> **Approach A: Trigger immediately at first detection**
> Pros: User gets notification right when condition met
> Cons: noisy if price oscillates around threshold
>
> **Approach B: Confirmation period**
> Wait 2 consecutive crons before trigger
> Pros: filter out brief spikes
> Cons: delayed notification, may miss fast moves
>
> **Approach C: Hysteresis**
> Trigger at ABOVE $50k, only re-arm when price drops to <$49k (buffer)
> Pros: avoids re-trigger from minor wobble
> Cons: misses repeated cycles in narrow range
>
> **Project decision:** Approach A + explicit user reset
> Reason: trading alerts should be fast; user can choose to re-arm
>
> **Production fintech might use:** Approach C with configurable thresholds"

---

## 🏆 Showcase Talking Points

### Point 1: "I implemented a real background processing system"
- Not just request/response — async patterns
- Idempotency thinking
- Failure recovery

### Point 2: "I optimized for external constraints"
- Rate limits → batch + dedupe
- Cron limits → strategic scheduling
- Free tier → mindful resource use

### Point 3: "I designed for reliability"
- Retry logic
- Notification logs
- Time zone correctness
- Cron monitoring plan

### Point 4: "This taught me distributed systems building blocks"
- Idempotency = used in payment systems, message queues
- Cron security = pattern for any scheduled work
- Concurrency = applicable across all backends
