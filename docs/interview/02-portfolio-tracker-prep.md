# 🎤 Interview Prep — Portfolio Tracker (Project 2)

> Project focus: **External API + Caching** — most interview gold of Tier 1

---

## 🎯 1-Minute Pitch

> "ผม built Portfolio Tracker ให้นักลงทุนติดตามพอร์ตและกำไรขาดทุนจากราคาปัจจุบัน
>
> Key challenge: เรียก external price API ที่มี rate limit จำกัด — solved ด้วย caching layer (DB-based ก่อน, plan to migrate Redis ใน Tier 3)
>
> Cache strategy: 60-second TTL + stale-while-revalidate fallback เมื่อ external API ล่ม
>
> Reused auth + Prisma + Zod patterns จาก Trading Journal — focus learning ที่ caching + API resilience"

---

## 💪 Skills ที่ Project นี้ Demonstrate

| Skill | จาก part ไหน | Interview signal |
|-------|-------------|------------------|
| **External API integration** | Finnhub/Alpaca call | "can work with 3rd party services" |
| **Caching** | PriceCache table | "performance-aware" |
| **Error handling** | API timeout/down fallback | "resilient systems thinking" |
| **Rate limiting** | API call batching | "considers external constraints" |
| **Secret management** | API key in env vars | "security-aware" |
| **Pattern reuse** | Auth/Prisma from project 1 | "DRY mindset, building on prior work" |

---

## 🔥 Common Interview Questions

### Q1: "Walk me through your caching strategy"

**Strong answer:**
> "Cache layer between app และ external API
>
> **Storage:** `PriceCache` table ใน Postgres — `(symbol, price, fetchedAt)`
>
> **Flow:**
> 1. Request ต้องการราคา symbol X
> 2. Check cache: fetchedAt > now - 60s → return cached price
> 3. Otherwise: call external API → UPSERT cache → return
> 4. External API fails: return stale cache + flag `isStale: true`
>
> **Why DB cache (not Redis)?**
> - Simplicity for side project
> - Cost (Redis adds infra)
> - Sufficient performance (~5ms vs ~1ms — acceptable)
>
> **Plan to migrate Redis ใน Tier 3:**
> - True in-memory speed
> - Native TTL (auto-expire)
> - Pub/sub สำหรับ cache invalidation"

---

### Q2: "What's TTL? Why 60 seconds?"

**Strong answer:**
> "TTL = Time-to-Live, ระยะที่ cached value valid
>
> 60s = tradeoff:
> - Too short (5s): hammer external API, defeat purpose
> - Too long (5 min): stale data, user เห็นราคาเก่า
>
> Trading context: ราคาเปลี่ยนวินาทีต่อวินาที — 60s = ผิดมากที่สุดในตลาดปั่นป่วน
>
> Different TTL for different data:
> - Real-time price: 60s
> - Symbol metadata (name, sector): 24 hours (เปลี่ยนช้า)
> - User portfolio summary: 5 minutes
>
> Production: dynamic TTL based on market hours / volatility"

---

### Q3: "What happens if external API is down?"

**Strong answer:**
> "Graceful degradation — 3-tier fallback:
>
> **Tier 1: Serve stale cache**
> Return cached price (no matter how old) + `isStale: true` + last fetch timestamp
> User sees: 'Price as of 5 min ago — service may be slow'
>
> **Tier 2: Circuit breaker**
> ถ้า API fail >3 ครั้งในช่วง 1 นาที — stop calling API for 5 นาที — use cache เท่านั้น
>
> **Tier 3: Last resort**
> ถ้าไม่มี cache เลย → return null price + error message — UI handle ด้วยการ skip section
>
> **Logging:** ทุก API failure ส่ง Sentry — alert ถ้า >5% error rate
>
> **Test:** Mock API ให้ throw → verify UI ไม่ crash + show error gracefully"

---

### Q4: "Cache invalidation strategy?"

**Strong answer:**
> "'There are only two hard things in CS: cache invalidation and naming things' 😄
>
> 3 invalidation strategies:
>
> 1. **TTL-based (default ของ project นี้)**
>    - Cache หมดอายุเอง 60s
>    - Simple, predictable
>    - Downside: stale data for up to TTL
>
> 2. **Event-based (advanced)**
>    - Manually invalidate เมื่อมีเหตุการณ์
>    - เช่น user trade → invalidate cache
>    - Complex but accurate
>
> 3. **Write-through**
>    - ทุก write update cache พร้อม DB
>    - Read always from cache
>    - Needs careful sync
>
> Project นี้ใช้ TTL — simplest + sufficient for use case
> ถ้า user complain เรื่อง stale → switch to event-based"

---

### Q5: "How do you handle API rate limits?"

**Strong answer:**
> "External API (Finnhub free tier): 60 calls/minute
>
> **Strategy:**
>
> 1. **Cache layer** — biggest impact
>    Reduces calls by 80-90% (most requests hit cache)
>
> 2. **Request batching**
>    ถ้าหลาย symbols ต้องดึงพร้อมกัน → use bulk endpoint ถ้ามี
>    เช่น GET /prices?symbols=AAPL,TSLA,BTC
>
> 3. **Request deduplication**
>    ถ้า 2 requests ขอ symbol X พร้อมกัน → single API call, share result
>    Pattern: 'single-flight' — promise cache
>
> 4. **Rate limit aware**
>    Track API call timestamps in last minute
>    If approaching limit → delay + queue
>
> 5. **Backoff on 429**
>    Exponential backoff (1s → 2s → 4s) เมื่อเจอ rate limit error"

---

### Q6: "ทำไมไม่เรียก API จาก frontend ตรงๆ?"

**Strong answer:**
> "หลายเหตุผล:
>
> 1. **API key security** — frontend code run in browser, key leak ผ่าน DevTools
> 2. **CORS** — most APIs block browser-origin requests
> 3. **Caching impossible** — แต่ละ user browser = แยก cache (waste)
> 4. **Rate limiting bypass** — user เรียก infinite times
> 5. **Cost control** — server-side easier to monitor/limit
>
> Backend proxy benefits:
> 1. API key safe ใน env var
> 2. Shared cache across users
> 3. Centralized rate limit handling
> 4. Logging + monitoring
>
> Pattern: frontend ขอ `/api/prices/AAPL` → backend handles caching + API call + key"

---

### Q7: "Stale-while-revalidate pattern?"

**Strong answer:**
> "Pattern ที่ใช้ใน HTTP cache + advanced caching:
>
> เมื่อ cache expire:
> 1. Return stale value ทันที (user ไม่รอ)
> 2. Trigger background revalidation
> 3. Next request gets fresh value
>
> ในโค้ด:
> ```typescript
> async function getPrice(symbol) {
>   const cache = await getFromCache(symbol)
>
>   if (cache && Date.now() - cache.fetchedAt < TTL) {
>     return cache  // fresh
>   }
>
>   if (cache && Date.now() - cache.fetchedAt < STALE_TIMEOUT) {
>     // serve stale + revalidate in background
>     revalidate(symbol).catch(console.error)  // fire and forget
>     return { ...cache, isStale: true }
>   }
>
>   // No cache or too old → must wait
>   return await fetchAndCache(symbol)
> }
> ```
>
> **Benefit:** P99 latency ต่ำ (user มักได้ stale) + eventual freshness
>
> **Tradeoff:** ข้อมูลอาจ stale 1 cycle"

---

## 🪤 Pitfall Questions

### Pitfall Q1: "Cache stampede — รู้จักไหม?"

**Strong answer:**
> "Yes — เกิดเมื่อ popular cache expire + หลาย requests ขอ key เดียวกันพร้อมกัน → ทุก request hit external API
>
> Example: AAPL cache expire ที่ T=0 — 100 users พอดี request → 100 calls ไป external API
>
> **Solutions:**
>
> 1. **Single-flight pattern** — request แรกที่เจอ cache miss = trigger fetch + lock — request อื่นรอ promise เดียวกัน
>
> 2. **Probabilistic early expiration** — บาง requests refresh cache ก่อน expire (random) — กระจาย load
>
> 3. **Lock-based** — distributed lock (Redis Redlock) — 1 request fetch, อื่นรอ
>
> Project นี้ยังไม่ implement (out of scope) — แต่ aware
>
> ✓ ฉลาดที่ interviewer ถาม — อะไรที่คุณยังไม่ได้ทำ"

---

### Pitfall Q2: "ถ้าใช้ Redis แล้ว Redis ล่ม — ทำยังไง?"

**Strong answer:**
> "Cache-aside pattern — application code aware ของ cache layer
>
> Fallback chain:
> 1. Try Redis (cache)
> 2. ถ้า Redis error → log warning + skip cache → call external API ตรง
> 3. ทำงานต่อได้ (degraded performance)
>
> Code pattern:
> ```typescript
> async function getPrice(symbol) {
>   try {
>     const cached = await redis.get(symbol)
>     if (cached) return JSON.parse(cached)
>   } catch (err) {
>     logger.warn('Redis error', { err })
>     // fall through to external API
>   }
>
>   const price = await fetchExternal(symbol)
>
>   try {
>     await redis.setex(symbol, 60, JSON.stringify(price))
>   } catch (err) {
>     logger.warn('Cache write failed', { err })
>     // OK, will fetch again next time
>   }
>
>   return price
> }
> ```
>
> **Anti-pattern:** ตาย ถ้า Redis ล่ม — cache should be optional optimization, not critical path"

---

### Pitfall Q3: "API key อยู่ใน env var — pickaxe มาขโมยได้ไหม?"

**Strong answer:**
> "Server env var ปลอดภัยกว่า client side แต่ก็ไม่ 100% absolute:
>
> **Attack vectors:**
> 1. Vercel dashboard access (compromised account)
> 2. SSRF attacks → /proc/self/environ
> 3. Leaked logs (env vars printed by mistake)
> 4. Insider threat (engineer with deploy access)
>
> **Defenses:**
> 1. Rotate keys regularly (every 90 days)
> 2. Use IP allowlist บน API provider (ถ้า support)
> 3. Use secret management (AWS Secrets Manager, Doppler) — advanced
> 4. Monitor API usage — alert ถ้ามี call pattern แปลก
> 5. Principle of least privilege — each service own API key
>
> Project นี้ใช้ Vercel env var + plan to rotate ทุก quarter"

---

## 🏆 Showcase Talking Points

### Point 1: "I solved a real performance problem"
- External API limit = 60 calls/min
- Without cache: 10 users × 6 holdings = 60 calls/refresh → hit limit
- With cache: same scenario = 6 calls (1 per unique symbol) — 90% reduction
- มี metric proof — log API calls before/after

### Point 2: "I thought about failure modes"
- "What if API is down?" → graceful fallback
- "What if cache is stale?" → user knows + can refresh
- "What if no cache and API down?" → null result + UI shows error

### Point 3: "Considered scaling path"
- Now: DB cache — sufficient for 100 users
- Tier 3 plan: Redis — for 10K users
- Future: CDN cache for public symbols (popular ones)
