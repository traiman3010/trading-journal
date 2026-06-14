# 🎤 Interview Prep — Mini E-commerce (Project 5 · Tier 2)

> Project focus: **Transactions + Race Conditions** — closest to real fintech work

---

## 🎯 1-Minute Pitch

> "ผม built mini E-commerce backend ที่จัดการ product, cart, order — focus หลักคือ atomic stock management
>
> Key challenge: ป้องกัน overselling เมื่อ concurrent buyers ซื้อชิ้นสุดท้าย — solved ด้วย Prisma transaction + conditional update (`updateMany` with `gte` predicate)
>
> Snapshot ราคา ณ ตอนซื้อ (`priceAtPurchase`) — invoice ต้องไม่เปลี่ยนแม้ราคา product จะอัปเดต
>
> Role-based access (CUSTOMER/ADMIN) — admins จัดการ product, customers ซื้อ"

---

## 💪 Skills ที่ Project นี้ Demonstrate

| Skill | จาก part ไหน | Interview signal |
|-------|-------------|------------------|
| **Database transactions** | Order creation | "understands ACID" |
| **Race condition prevention** | Stock management | "concurrent thinking" |
| **State machines** | Order status flow | "models business processes" |
| **Role-based access** | CUSTOMER vs ADMIN | "authorization patterns" |
| **Data immutability** | priceAtPurchase snapshot | "thinks about audit trail" |
| **Testing concurrency** | Stress test with parallel requests | "verifies under load" |

---

## 🔥 Common Interview Questions

### Q1: "How do you prevent overselling? Walk me through the code"

**Strong answer:**
> "**The naive approach (broken):**
> ```typescript
> const product = await prisma.product.findUnique({ where: { id } })
> if (product.stock >= quantity) {
>   await prisma.product.update({
>     where: { id },
>     data: { stock: product.stock - quantity }
>   })
>   await prisma.order.create({ ... })
> }
> ```
> Race condition: 2 concurrent buyers see stock=1, both pass check, both decrement → stock = -1
>
> **The fix using transaction + conditional update:**
> ```typescript
> const order = await prisma.\$transaction(async (tx) => {
>   // Conditional update — fails if stock < quantity
>   const result = await tx.product.updateMany({
>     where: {
>       id: productId,
>       stock: { gte: quantity }   // ← atomic check
>     },
>     data: {
>       stock: { decrement: quantity }
>     }
>   })
>
>   if (result.count === 0) {
>     throw new Error('Out of stock')   // rollback transaction
>   }
>
>   return await tx.order.create({
>     data: {
>       userId,
>       items: { create: [/* order items */] },
>       totalAmount,
>     }
>   })
> })
> ```
>
> **Why this works:**
> - `updateMany` with WHERE clause = atomic check-and-update at DB level
> - Postgres handles concurrency via row lock during UPDATE
> - If stock < quantity → no rows updated → throw → transaction rolls back
> - Both buyers race → first wins, second gets 'Out of stock'"

---

### Q2: "What is ACID?"

**Strong answer:**
> "4 properties of database transactions:
>
> **A — Atomicity**
> All operations succeed OR all fail. No partial state.
> Example: decrement stock + create order — if order creation fails, stock not decremented
>
> **C — Consistency**
> DB always valid (constraints, foreign keys, business rules)
> Example: order.totalAmount = sum(items.price * quantity) — never inconsistent
>
> **I — Isolation**
> Concurrent transactions don't see each other's intermediate state
> Postgres default: 'Read Committed' isolation
> Example: 2 transactions buying same item — see consistent stock value
>
> **D — Durability**
> Once committed, persists even if server crashes
> Postgres uses Write-Ahead Log (WAL) to guarantee this
>
> **Why critical for e-commerce:**
> Money + inventory require strong guarantees — overselling = real $$ loss"

---

### Q3: "Isolation levels — explain"

**Strong answer:**
> "Database isolation levels — trade-off between consistency and performance
>
> **4 levels (weakest to strongest):**
>
> 1. **Read Uncommitted**
>    Can read uncommitted changes from other transactions
>    'Dirty reads' possible
>    Postgres doesn't actually support — defaults to next level
>
> 2. **Read Committed (Postgres default)**
>    Only see committed data
>    But: same query within transaction can return different results
>    Sufficient for most apps
>
> 3. **Repeatable Read**
>    Same query in transaction returns same data
>    Snapshot taken at start of transaction
>    Risk: 'phantom reads' (new rows can appear)
>
> 4. **Serializable**
>    Transactions appear to run sequentially
>    Highest safety, lowest performance
>    Required for: financial calculations across multiple rows
>
> **For our project:**
> Use Postgres default (Read Committed) + conditional update WHERE clause
> Conditional update is atomic regardless of isolation level
>
> **When to use Serializable:**
> Multi-row business invariants
> Example: sum of cart totals across users must match revenue — requires Serializable"

---

### Q4: "How do you test for race conditions?"

**Strong answer:**
> "**Stress test approach:**
>
> 1. **Setup:**
>    - Product with stock = 1
>    - 100 concurrent users with carts ready
>
> 2. **Action:**
>    - Fire 100 concurrent POST /api/orders requests
>    - Use Promise.all([...100 fetches])
>
> 3. **Verify:**
>    - Exactly 1 order created
>    - Final stock = 0
>    - 99 requests returned 'Out of stock'
>
> ```typescript
> test('prevents overselling under concurrent load', async () => {
>   const product = await createProduct({ stock: 1, price: 100 })
>   const users = await createUsers(100)
>
>   const results = await Promise.all(
>     users.map(user => orderItem(user, product, 1))
>   )
>
>   const successes = results.filter(r => r.status === 'success')
>   const failures = results.filter(r => r.status === 'out_of_stock')
>
>   expect(successes).toHaveLength(1)
>   expect(failures).toHaveLength(99)
>
>   const finalProduct = await getProduct(product.id)
>   expect(finalProduct.stock).toBe(0)
> })
> ```
>
> **Tools:** k6, Artillery for higher-scale load testing
>
> **Real-world:** Stripe runs continuous chaos tests against payment infrastructure"

---

### Q5: "Why store priceAtPurchase separately from product.price?"

**Strong answer:**
> "**Scenario:** customer buys iPhone at $999 on Dec 1. On Dec 15, price increases to $1099.
>
> **If we don't snapshot:**
> - Order shows current product price ($1099)
> - Invoice 'wrong' (customer paid $999)
> - Confused customer, support nightmare
> - Tax/refund calculations wrong
>
> **With snapshot (`priceAtPurchase`):**
> - Order line item: { productId, quantity, priceAtPurchase: 999 }
> - Order forever shows $999
> - Even if product is deleted/renamed
>
> **General principle: 'capture facts at the time'**
> Apply to:
> - Order: price, tax rate, shipping cost
> - Invoice: customer address (at time of order)
> - Subscription: plan terms (when subscribed)
>
> **Pattern name:** Event Sourcing (lite) — store immutable facts, derive state
>
> **Anti-pattern:** referring to current state for historical records"

---

### Q6: "Order status machine — how do you model?"

**Strong answer:**
> "States: PENDING → PAID → SHIPPED → COMPLETED
> Side states: CANCELLED, REFUNDED
>
> **State machine pattern:**
> ```typescript
> const validTransitions = {
>   PENDING:   ['PAID', 'CANCELLED'],
>   PAID:      ['SHIPPED', 'CANCELLED', 'REFUNDED'],
>   SHIPPED:   ['COMPLETED', 'REFUNDED'],
>   COMPLETED: ['REFUNDED'],
>   CANCELLED: [],   // terminal
>   REFUNDED:  [],   // terminal
> }
>
> async function transitionOrder(orderId, newStatus, actor) {
>   const order = await prisma.order.findUnique({ where: { id: orderId } })
>
>   if (!validTransitions[order.status].includes(newStatus)) {
>     throw new InvalidTransitionError(
>       \`Cannot go from \${order.status} to \${newStatus}\`
>     )
>   }
>
>   await prisma.\$transaction([
>     prisma.order.update({
>       where: { id: orderId },
>       data: { status: newStatus, updatedAt: new Date() }
>     }),
>     prisma.orderStatusLog.create({
>       data: {
>         orderId,
>         fromStatus: order.status,
>         toStatus: newStatus,
>         actorId: actor.id,
>         timestamp: new Date(),
>       }
>     })
>   ])
> }
> ```
>
> **Why log transitions:**
> - Audit trail
> - Customer support can see history
> - Debugging
>
> **Side effects per transition:**
> - PAID: confirm to customer, notify warehouse
> - SHIPPED: send tracking number
> - REFUNDED: process payment refund, restore stock
>
> **Real-world:** Stripe, Shopify use formal state machines (XState library)"

---

### Q7: "Cart vs Order — design difference?"

**Strong answer:**
> "**Cart:** mutable, scratchpad
> - User adds/removes items
> - References current product price (changes when price updates)
> - Cleared after checkout
> - Often stored in Redis/cookies for guests
>
> **Order:** immutable, contract
> - Created at checkout
> - Snapshots price, quantity, taxes
> - Has status (PENDING, PAID, etc.)
> - Source of truth for invoicing
>
> **Schema:**
> ```typescript
> // Cart — dynamic
> CartItem {
>   userId, productId, quantity
>   // Price computed from Product.price at display time
> }
>
> // Order — frozen
> Order {
>   userId, status, totalAmount, createdAt
>   items: OrderItem[]
> }
> OrderItem {
>   orderId, productId, quantity, priceAtPurchase
> }
> ```
>
> **Common confusion:** beginners use same table for both → can't handle price changes correctly
>
> **Transition:** checkout flow converts Cart → Order in transaction:
> 1. Validate stock for all items
> 2. Decrement stock atomically
> 3. Create Order + OrderItems with snapshotted prices
> 4. Delete CartItems
> 5. Trigger payment flow"

---

## 🪤 Pitfall Questions

### Pitfall Q1: "What if payment is processed but order creation fails?"

**Strong answer:**
> "Classic distributed transaction problem — payment system separate from DB
>
> **Scenarios:**
>
> A. **Payment success → Order create success** ✓
> B. **Payment fail → Order not created** ✓
> C. **Payment success → Order create fail** ❌ Customer charged but no order!
> D. **Payment processing... timeout** ❓
>
> **Solutions:**
>
> 1. **Saga pattern (compensating transactions)**
>    - If order create fails after payment → trigger refund
>    - Both succeed OR both rollback
>
> 2. **Outbox pattern**
>    - Save 'pending payment' record before charging
>    - Background job processes outbox + handles retries
>    - Idempotency key sent to payment provider
>
> 3. **Webhook-driven**
>    - Payment provider calls webhook on completion
>    - Webhook creates order
>    - If webhook fails → provider retries
>
> **For our simple project:** simulate payment, accept risk
>
> **Real production:** Stripe Checkout uses approach #3 — webhook-driven, robust"

---

### Pitfall Q2: "Optimistic concurrency vs pessimistic locking?"

**Strong answer:**
> "**Optimistic concurrency** (what we use):
> - No lock during read
> - Check version/condition at write
> - Conflict = retry
>
> Example: our `updateMany` with `where: { stock: { gte: quantity } }`
>
> Pros: high throughput, no deadlock
> Cons: retry overhead under contention
>
> **Pessimistic locking:**
> - Lock row immediately on read
> - Block other transactions until commit
> - Use `SELECT ... FOR UPDATE`
>
> Example:
> ```sql
> BEGIN;
> SELECT * FROM products WHERE id = ? FOR UPDATE;   -- locks row
> UPDATE products SET stock = stock - 1 WHERE id = ?;
> COMMIT;
> ```
>
> Pros: simple to reason about
> Cons: deadlock risk, lower throughput, lock waits
>
> **When to use which:**
> - High contention + simple operation → optimistic (our case)
> - Complex multi-step business logic → pessimistic
> - Read-modify-write where read is expensive → pessimistic"

---

## 🏆 Showcase Talking Points

### Point 1: "I built systems that handle money"
- E-commerce = closest to fintech/banking domain
- Race conditions, transactions, snapshots = fintech bread and butter
- Reviewer signal: 'this person can be trusted with money'

### Point 2: "I proved correctness with tests"
- Stress test under concurrent load
- 100 buyers race for 1 item → exactly 1 wins
- Show test in interview if asked

### Point 3: "I thought about audit trail"
- Order status log
- Snapshot prices
- Immutable order records
- Compliance-aware

### Point 4: "Real-world patterns understood"
- State machines (XState-style)
- Saga / compensating transactions (conceptually)
- Outbox pattern (conceptually)
- These are NOT taught in tutorials

### Point 5: "Production-thinking"
- ACID and isolation levels
- Idempotency for payments (conceptual)
- Webhook patterns for async (conceptual)
- Plan for distributed systems
