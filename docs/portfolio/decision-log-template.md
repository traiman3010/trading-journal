# 📋 Decision Log Template (ADR)

> Architecture Decision Records — บันทึก decision สำคัญพร้อมเหตุผล
> ใช้พื้นฐาน Michael Nygard's ADR format

---

## Template (copy this for each decision)

```markdown
# [ADR-NNN] [Short Title]

**Date:** YYYY-MM-DD
**Status:** Proposed / Accepted / Deprecated / Superseded by [ADR-XXX]
**Deciders:** [Your name]
**Tags:** [tech, security, performance, ...]

## Context

[What is the issue we're seeing that is motivating this decision?]

[Include the problem statement, constraints, and forces at play.]

## Considered Options

### Option 1: [Name]
- **Pros:** ...
- **Cons:** ...
- **Verdict:** [Chosen / Rejected — reason]

### Option 2: [Name]
- **Pros:** ...
- **Cons:** ...
- **Verdict:** ...

### Option 3: [Name]
- ...

## Decision

[What did we decide? Why?]

[Include the reasoning that led to this choice.]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Risk 1]

### Neutral
- [Side effect that's neither positive nor negative]

## Implementation Notes

[Code examples, links to files, key implementation details]

## Future Reconsideration Triggers

[What would cause us to revisit this decision?]
- [E.g., "If user count exceeds 10,000"]
- [E.g., "If response time degrades past 500ms"]

## References

- [Documentation link]
- [Article that influenced decision]
- [Related ADRs: ADR-XXX, ADR-YYY]
```

---

## 📚 Example: Filled ADRs

### Example 1: ADR-001 - Choose Prisma 7 over alternatives

```markdown
# ADR-001: Use Prisma 7 as ORM

**Date:** 2026-06-14
**Status:** Accepted
**Deciders:** [Your name]
**Tags:** database, orm, typescript

## Context

Building a fullstack trading journal with TypeScript on Next.js. Need to:
- Query PostgreSQL safely (avoid SQL injection)
- Get TypeScript types for DB models
- Manage schema migrations
- Support relations between User/Trade/Tag

Coming from frontend background with no prior ORM experience.

## Considered Options

### Option 1: Prisma 7 (chosen)
- **Pros:**
  - Excellent TypeScript integration (auto-generated types)
  - Schema-first approach (clear data model)
  - Built-in migration tooling
  - Top community + docs
  - New v7 has improved config and TS-native client
- **Cons:**
  - Magic / abstraction can hide SQL
  - Some complex queries need raw SQL anyway
  - v7 is newer (less Stack Overflow content)

### Option 2: Drizzle ORM
- **Pros:**
  - SQL-like syntax (closer to raw SQL)
  - No code generation
  - Lighter weight
- **Cons:**
  - Smaller community
  - Less mature tooling
  - Migration story not as polished

### Option 3: Raw SQL (pg + custom types)
- **Pros:**
  - Full control
  - No abstraction overhead
- **Cons:**
  - No type safety without custom work
  - Migrations manual
  - Slow development

## Decision

**Use Prisma 7** for the following reasons:
1. Type safety end-to-end matches our TypeScript-first approach
2. Schema-first aligns with learning goals (visualize data model)
3. Industry standard — transferable skill
4. Best developer experience for ORM newcomer

## Consequences

### Positive
- 90% of queries fully type-safe with autocomplete
- Schema changes tracked via migrations (versionable, reviewable)
- Clear separation of schema from queries
- Generates Prisma Studio for visual DB browsing

### Negative
- Adds dependency + build step (Prisma Client generation)
- For complex aggregations (window functions, equity curves), must drop to `$queryRaw`
- ORM hides actual SQL (debugging harder initially)

### Neutral
- Locked into Prisma's query semantics (can migrate later but requires rewriting)

## Implementation Notes

- Schema at `prisma/schema.prisma`
- Config at `prisma.config.ts` (Prisma 7 pattern)
- Client output to `app/generated/prisma/` (gitignored)
- Migrations at `prisma/migrations/` (committed)

```typescript
// Type-safe query
const trades = await prisma.trade.findMany({
  where: { userId, exitPrice: { not: null } },
  include: { tags: true },
})
```

## Future Reconsideration Triggers

- Complex queries comprise >30% of code → consider Drizzle or raw SQL
- Performance issues that ORM can't optimize → drop to raw SQL for hot paths
- Migration to non-Postgres DB (Prisma supports MySQL, MongoDB)

## References

- [Prisma docs](https://www.prisma.io/docs)
- [ORM trade-offs article](https://...)
- Related: [ADR-002 - Schema design]
```

---

### Example 2: ADR-002 - JWT over Database Session

```markdown
# ADR-002: Use JWT Session Strategy

**Date:** 2026-06-14
**Status:** Accepted
**Deciders:** [Your name]
**Tags:** auth, security, performance

## Context

Implementing authentication with Auth.js v5. Must choose:
- **Database sessions** — server stores session, client has session ID
- **JWT** — client stores signed token, server stateless verify

App characteristics:
- Single-region deployment (Vercel)
- App is monolithic (no microservices yet)
- Will deploy to Edge runtime where possible
- Not handling money/banking (auth criticality moderate)

## Considered Options

### Option 1: JWT (chosen)
- **Pros:**
  - Stateless — no DB lookup per request
  - Edge runtime compatible
  - Auth.js v5 default
  - Easier horizontal scaling later
- **Cons:**
  - Logout not instant (token valid until exp)
  - Token revocation needs blocklist
  - Larger payload (~500 bytes vs ~32)

### Option 2: Database Sessions
- **Pros:**
  - Instant logout (DELETE session)
  - Smaller cookie payload
  - Familiar pattern from older frameworks
- **Cons:**
  - DB query every request (latency + load)
  - Doesn't work in Edge runtime
  - Sessions table grows
  - Adds DB load before app even processes request

## Decision

**Use JWT** with the following mitigations for weaknesses:
- Short token expiry (1 hour)
- HttpOnly + Secure + SameSite=Strict cookie
- Token version in user table — invalidate all sessions on password change

## Consequences

### Positive
- Zero DB latency for auth check
- Compatible with Vercel Edge functions
- Scales to multi-region without coordination
- Cookie auth survives serverless cold start

### Negative
- Cannot instantly revoke specific session (must wait for exp)
- Cannot view active sessions per user (UX feature missed)
- Token payload visible (not encrypted — only signed)

### Neutral
- Need to think about token refresh strategy

## Implementation Notes

```typescript
// auth.ts
export const { auth, handlers } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 },  // 1 hour
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id
      return token
    },
  },
})
```

## Future Reconsideration Triggers

- Need instant logout (e.g., handle fraud/compromise)
- Multi-region with active session sync
- Compliance requires session audit trail
- Customer reports of "I logged out but still seeing data"

## References

- [Auth.js docs on session strategy](https://authjs.dev/concepts/session-strategies)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- Related: [knowledge/auth-deep.md]
```

---

### Example 3: ADR-003 - Float for prices (deferred decision)

```markdown
# ADR-003: Use Float for Prices (Initial)

**Date:** 2026-06-15
**Status:** Accepted (with explicit migration plan)
**Deciders:** [Your name]
**Tags:** database, finance, technical-debt

## Context

Trading journal stores entry/exit prices, P&L calculations. Two choices:
- `Float` (DOUBLE PRECISION) — floating point
- `Decimal(precision, scale)` — arbitrary precision

For financial data, Decimal is correct (no precision loss). But adds complexity for learning project.

## Considered Options

### Option 1: Float (chosen for v1)
- **Pros:**
  - Simple JavaScript number
  - No library needed
  - Sufficient for individual trader use case
- **Cons:**
  - Precision loss: 0.1 + 0.2 = 0.30000000000000004
  - Not suitable for accumulating large datasets
  - Not industry standard for finance

### Option 2: Decimal
- **Pros:**
  - Accurate decimal arithmetic
  - Industry standard for finance
  - Required for serious portfolio tools
- **Cons:**
  - Requires `decimal.js` library in client
  - String serialization between client/server
  - Operations more verbose

## Decision

**Use Float for v1**, with documented plan to migrate to Decimal in Tier 3 (production-grade).

Rationale:
- Side project scale: precision errors <$1 not user-visible
- Learning priority is full-stack flow, not financial accuracy
- Migration path is clear when needed

## Consequences

### Positive
- Faster initial development
- Standard JS number type everywhere
- Recharts plays well

### Negative
- ⚠️ Known precision issue for users tracking many trades
- Migration to Decimal will require:
  - Schema change (Float → Decimal)
  - Data migration script
  - Client-side library
  - Form input handling
- README must disclose this limitation

### Neutral
- This is intentional technical debt with explicit tracking

## Implementation Notes

Disclosed in README:
> **Known limitation:** Prices stored as Float. P&L calculations may have small precision errors. Tier 3 upgrade will migrate to Decimal.

## Future Reconsideration Triggers

- User reports precision issues
- Aggregating large datasets (>1000 trades)
- Production fintech use case
- Tier 3 production-grade upgrade

## References

- [JavaScript Floating Point](https://0.30000000000000004.com/)
- [decimal.js library](https://github.com/MikeMcl/decimal.js)
- Related: [interview/01-trading-journal-prep.md]
```

---

## 📐 ADR Best Practices

### When to write an ADR
- **Architectural choice** that affects multiple components
- **Trade-off** between two acceptable approaches
- **Non-obvious decision** that future-you would question
- **Reversal** of a previous decision

### When NOT to write an ADR
- Style preferences (use prettier for that)
- Trivial choices (variable naming)
- Implementation details

### Naming convention
- `ADR-001-short-title.md`
- 3-digit number for sorting
- Kebab-case title

### Status lifecycle
```
Proposed → Accepted → [eventually] → Deprecated / Superseded by ADR-XXX
```

### Storage location
```
docs/
├── decisions/         # All ADRs
│   ├── README.md      # Index
│   ├── 001-xxx.md
│   ├── 002-yyy.md
│   └── 003-zzz.md
```

### Index (docs/decisions/README.md)
```markdown
# Architecture Decisions

| # | Title | Status | Date |
|---|-------|--------|------|
| 001 | Use Prisma 7 | Accepted | 2026-06-14 |
| 002 | JWT Session Strategy | Accepted | 2026-06-14 |
| 003 | Float for prices (interim) | Accepted | 2026-06-15 |
```

---

## 🎯 Why ADRs Matter for Career

### In interviews
- "Walk me through a tough decision" — pull up an ADR
- "What would you do differently?" — link to triggers
- Shows engineering maturity

### In team work
- Onboard new engineers
- Avoid relitigating decisions
- Document context that fades over time

### For personal growth
- Practice articulating trade-offs
- Track learning over time
- See your judgment improve

---

## 📚 Resources

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's original article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [adr-tools CLI](https://github.com/npryce/adr-tools)
