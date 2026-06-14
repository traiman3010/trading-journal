# 🎤 Interview Prep — Realtime Kanban (Project 4 · Tier 2)

> Project focus: **WebSocket + Optimistic Update** — portfolio showcase project

---

## 🎯 1-Minute Pitch

> "ผม built Realtime Kanban board — collaborative task management ที่ sync ระหว่างหลาย client แบบ realtime
>
> Key challenge: WebSocket + Vercel serverless (ไม่รองรับ persistent connection) — solved ด้วย [Supabase Realtime / Pusher / dedicated WebSocket server บน Render]
>
> Optimistic updates ให้ UI responsive — drag card ขยับทันที, rollback ถ้า server reject
>
> Card ordering ใช้ fractional indexing — insert ระหว่าง 2 cards โดยไม่ต้อง re-index ทั้ง column"

---

## 💪 Skills ที่ Project นี้ Demonstrate

| Skill | จาก part ไหน | Interview signal |
|-------|-------------|------------------|
| **WebSocket / Realtime** | Sync between clients | "comfortable with persistent connections" |
| **Optimistic UI** | Drag & drop instant | "UX-focused engineer" |
| **Conflict resolution** | Concurrent edits | "distributed state aware" |
| **Drag and drop** | dnd-kit integration | "complex UI work" |
| **Data structures** | Fractional indexing | "thinks beyond CRUD" |
| **State sync** | Reconnect logic | "edge cases handled" |
| **Presence** | Online users display | "engagement features" |

---

## 🔥 Common Interview Questions

### Q1: "Walk me through the realtime architecture"

**Strong answer:**
> "3-layer architecture:
>
> **Layer 1: Client (Next.js + React)**
> - Subscribe to WebSocket channel per board (board:{id})
> - Optimistic update on user action
> - Re-sync on reconnect
>
> **Layer 2: WebSocket Server**
> - Persistent connections (not Vercel — separate service)
> - Room-based broadcasting (1 room per board)
> - Authentication via JWT in connection params
>
> **Layer 3: Database (Postgres + Prisma)**
> - Source of truth
> - WebSocket server reads/writes
> - Client never connects directly
>
> **Flow when user drags card:**
> 1. Client A: dispatch action → update local state (optimistic)
> 2. Client A: send event via WebSocket
> 3. Server: validate (auth + ownership)
> 4. Server: UPDATE DB
> 5. Server: broadcast event to all clients in room (including A)
> 6. Other clients: apply update
> 7. Client A: confirm (or rollback if reject)"

---

### Q2: "Why can't you use Vercel for WebSocket?"

**Strong answer:**
> "Vercel uses serverless functions — designed for short-lived requests (HTTP):
>
> - Function timeout: 10s (Hobby), 60s (Pro), 300s (Enterprise)
> - Scaling: each request = new instance
> - No state between requests
>
> **WebSocket needs:**
> - Long-lived connection (hours)
> - State per connection (subscribed channels)
> - Bi-directional data flow
>
> **Mismatch:** WebSocket connection would time out + cost-prohibitive (each connection = active function)
>
> **Solutions:**
> 1. **Separate WebSocket server** — deploy Socket.IO on Railway/Render
> 2. **Managed Realtime service** — Pusher, Ably, Supabase Realtime
> 3. **Server-Sent Events (SSE)** — works on Vercel but one-way (server → client only)
>
> **My choice:** [Supabase Realtime — leverages Postgres subscriptions, free tier generous, no separate infra]"

---

### Q3: "Explain optimistic update + rollback"

**Strong answer:**
> "User intent: drag card → expect instant visual feedback
>
> **Without optimistic:**
> 1. User drags
> 2. Send request to server
> 3. Wait for response (200-500ms)
> 4. Card moves
> Feels: laggy
>
> **With optimistic:**
> 1. User drags
> 2. Update UI immediately (treat as success)
> 3. Send request in background
> 4. If server confirms → keep state
> 5. If server rejects → rollback UI + show error
>
> **Implementation pattern:**
> ```typescript
> const onCardDrop = async (cardId, newColumnId, newPosition) => {
>   const previousState = cards  // snapshot for rollback
>
>   // Optimistic update
>   setCards(prev => moveCard(prev, cardId, newColumnId, newPosition))
>
>   try {
>     await api.moveCard(cardId, newColumnId, newPosition)
>     // Success: server will broadcast → reconcile if needed
>   } catch (err) {
>     // Rollback
>     setCards(previousState)
>     toast.error('Move failed, please retry')
>   }
> }
> ```
>
> **Edge case:** another user moves card during your drag → server might reject
> Handle: rollback + show 'Card was modified, please refresh'"

---

### Q4: "Position field — int or fractional?"

**Strong answer:**
> "Int position (`position: 1, 2, 3...`):
>
> **Problem:** insert between position 1 and 2 → need fractional → re-index everything
>
> Example: 1000 cards, insert at top → UPDATE all 1000 (slow + broadcasts 1000 updates)
>
> **Fractional approach 1: Float position**
> Insert between 1 and 2 → position = 1.5
> Between 1 and 1.5 → 1.25
> Eventually: precision loss (after ~30 inserts)
>
> **Fractional approach 2: Lexicographic strings (best)**
> Position is string: 'a', 'b', 'c' → insert between 'a' and 'b' → 'aN'
> Library: `fractional-indexing` (jitsi/jitsi-meet uses this)
>
> Benefits:
> - Insert: O(1) — no re-indexing
> - Comparison: built-in string sort
> - Precision: theoretically unlimited
>
> **My implementation:** lexicographic strings via fractional-indexing library
>
> **Trade-off:** harder to read in DB (positions look like 'a0', 'a1', 'a05') — debugging less intuitive
>
> **Real-world:** Linear, Notion, Trello use similar approach"

---

### Q5: "How do you handle conflicts when 2 users edit same card?"

**Strong answer:**
> "**Approach: Last-Write-Wins (LWW)** for simplicity
>
> ```typescript
> // Card has updatedAt timestamp
> async function updateCard(cardId, updates, clientTimestamp) {
>   const card = await prisma.card.findUnique({ where: { id: cardId } })
>
>   if (clientTimestamp < card.updatedAt) {
>     // Stale update — reject
>     throw new ConflictError('Card was modified by another user')
>   }
>
>   await prisma.card.update({
>     where: { id: cardId },
>     data: { ...updates, updatedAt: new Date() }
>   })
> }
> ```
>
> **More sophisticated approaches:**
>
> 1. **OT (Operational Transformation)**
>    - Used by Google Docs
>    - Transform concurrent edits to be commutative
>    - Complex to implement
>
> 2. **CRDT (Conflict-free Replicated Data Types)**
>    - Used by Figma, Linear
>    - Auto-merge conflicts mathematically
>    - Y.js library popular
>
> 3. **Field-level locking**
>    - Lock card while editing
>    - Simple but UX poor (user sees 'locked' state)
>
> **My project:** LWW + visual indicator 'modified by other' + auto-refresh button
>
> **Honest:** LWW = data can be lost. Acceptable for kanban (not for collaborative documents)"

---

### Q6: "How does presence (who's online) work?"

**Strong answer:**
> "**Approach using WebSocket:**
>
> 1. Client connects → server adds to room
> 2. Server broadcasts `presence:join` event to room
> 3. Other clients update presence list
> 4. Heartbeat ping every 30s — keep connection alive
> 5. On disconnect (close or timeout) → broadcast `presence:leave`
>
> **State management:**
> ```typescript
> // Server-side
> const rooms = new Map<string, Set<UserSession>>()
>
> socket.on('join_board', ({ boardId, user }) => {
>   if (!rooms.has(boardId)) rooms.set(boardId, new Set())
>   rooms.get(boardId).add({ socketId: socket.id, user })
>   io.to(boardId).emit('presence:update', getPresence(boardId))
> })
>
> socket.on('disconnect', () => {
>   for (const [boardId, users] of rooms.entries()) {
>     users.forEach(u => {
>       if (u.socketId === socket.id) users.delete(u)
>     })
>     io.to(boardId).emit('presence:update', getPresence(boardId))
>   }
> })
> ```
>
> **Edge case:** user opens 2 tabs → 2 connections
> Solution: dedupe by userId, show ONE avatar
>
> **Scale concern:** all presence in memory = lost on restart
> Production: store in Redis (shared between WebSocket server instances)"

---

### Q7: "What happens when WebSocket disconnects?"

**Strong answer:**
> "**Detection:**
> - Browser fires `onclose` event
> - Or heartbeat ping fails N times
>
> **Reconnect strategy:**
> ```typescript
> let reconnectAttempts = 0
> const maxBackoff = 30000  // 30s
>
> function connect() {
>   const ws = new WebSocket(URL)
>
>   ws.onopen = () => {
>     reconnectAttempts = 0
>     ws.send(JSON.stringify({ type: 'resync', lastSeenId }))
>   }
>
>   ws.onclose = () => {
>     const backoff = Math.min(1000 * 2 ** reconnectAttempts, maxBackoff)
>     reconnectAttempts++
>     setTimeout(connect, backoff)
>   }
> }
> ```
>
> **Re-sync after reconnect:**
> 1. Client tells server 'last event ID I saw'
> 2. Server replays missed events (if cached)
> 3. Or: full re-fetch board state (simpler, more bandwidth)
>
> **UX during disconnect:**
> - Show 'Reconnecting...' banner
> - Queue user actions (defer until reconnect)
> - Or: degrade to read-only mode
>
> **Project decision:** show banner + queue actions + auto-retry"

---

## 🪤 Pitfall Questions

### Pitfall Q1: "What if user makes 1000 changes per second?"

**Strong answer:**
> "**Reasonable bound:** drag events fire 60/sec during drag
>
> **Without throttling:**
> - 60 events/sec/user × 100 users = 6000 events/sec
> - WebSocket server CPU spike
> - DB writes saturate
>
> **Solutions:**
>
> 1. **Debounce on client**
>    Only send final position when drag ends (not during)
>    Pattern: optimistic update during drag, persist on drop
>
> 2. **Throttle server-side**
>    Max N updates/user/sec
>    Drop or coalesce excess
>
> 3. **Batch broadcasts**
>    Collect updates per 50ms window
>    Broadcast batch instead of individual events
>
> **My implementation:** debounce on drop + throttle 10 ops/sec/user server-side"

---

### Pitfall Q2: "How do you scale WebSocket horizontally?"

**Strong answer:**
> "**Problem:** sticky session — client A connected to server 1, client B to server 2 — how to broadcast between?
>
> **Solutions:**
>
> 1. **Redis Pub/Sub adapter** (Socket.IO)
>    - Server 1 publishes to Redis channel
>    - Server 2 subscribes → broadcasts to its clients
>    - Industry standard
>
> 2. **Centralized message broker (NATS, RabbitMQ)**
>    - More flexibility, more overhead
>    - Used by larger systems
>
> 3. **Sticky load balancer**
>    - Same user always hits same server
>    - Works for some patterns but bottleneck-prone
>
> **For our project:** out of scope (single server sufficient for <1000 concurrent)
>
> **If scaling to 100k concurrent:**
> - Multiple WebSocket servers behind LB
> - Redis adapter for cross-server broadcast
> - Sharded by board ID
> - Connection pooling"

---

## 🏆 Showcase Talking Points

### Point 1: "Realtime experience — open 2 tabs"
- Live demo in interview = wow factor
- Drag card on tab 1 → moves on tab 2 instantly
- Show presence avatars updating
- Bonus: kill connection → show reconnect → resync

### Point 2: "I went beyond CRUD"
- Most projects: just save/load data
- This: state synchronization, conflict resolution, presence
- Distributed systems building blocks

### Point 3: "Considered the right trade-offs"
- LWW conflict resolution (not OT/CRDT) — pragmatic for use case
- Lexicographic ordering (not int) — chose right data structure
- Optimistic updates (not strict consistency) — UX over guarantees

### Point 4: "Production-aware decisions"
- Chose [Supabase Realtime / managed service] over self-hosting
- Why: focus on app logic, not infra
- Can migrate later if needs change

### Point 5: "This is the project I'd showcase first"
- Visual impact in 30 seconds
- Demonstrates senior thinking
- WebSocket = differentiator from typical frontend dev
