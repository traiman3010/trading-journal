# ADR-003: Use Neon (Cloud Postgres) for Development Database

**Date:** 2026-06-14
**Status:** Accepted
**Deciders:** [Project owner]
**Tags:** database, infrastructure, development

---

## Context

Need Postgres database for development. Project will eventually deploy to production. Options range from local install to managed cloud services.

Constraints:
- Side project budget (free tier preferred)
- macOS development environment
- Vercel deployment planned (Vercel + Neon documented well-integrated)
- Solo learner (no team to coordinate Docker dev environments)
- Time-to-productivity matters (avoid yak-shaving)

---

## Considered Options

### Option 1: Neon (cloud Postgres) ⭐ Chosen
- **Pros:**
  - 100% free tier covers learning project (10GB)
  - Setup in 5 minutes
  - Same instance dev → prod (when deploying)
  - No local infra to manage
  - Singapore region available (low latency from Thailand)
  - Postgres 18 latest version
- **Cons:**
  - Requires internet
  - Free tier database scales to 0 (cold start delays ~1-3s)
  - Vendor specific connection strings

### Option 2: Docker (local Postgres container)
- **Pros:**
  - Works offline
  - Reset easily (`docker compose down -v`)
  - Industry standard for team development
  - Skill transferable to backend roles
- **Cons:**
  - Docker is itself a learning curve
  - Need to learn Docker AND Prisma AND auth in parallel = overload
  - Container resource usage on laptop
  - Different from production (would need cloud DB for deploy anyway)

### Option 3: Local Postgres install (Homebrew)
- **Pros:**
  - Direct, simple
  - Works offline
- **Cons:**
  - Pollutes system with installed service
  - Cleanup difficult
  - Background process running always
  - Still need different DB for production

### Option 4: SQLite for dev
- **Pros:**
  - Zero setup
  - File-based
- **Cons:**
  - Different from Postgres in production (parity issues)
  - Different SQL dialect (gotcha for queries)
  - Limited features (no real concurrency)
  - Prisma supports but features differ

---

## Decision

**Use Neon for development**

Reasoning:
1. **Lowest cognitive load** — focus on app code, not DB administration
2. **Same as production** — no dev/prod parity issues
3. **Free tier sufficient** — won't exceed for years of side project use
4. **Singapore region** — low latency for Bangkok-based dev
5. **5-minute setup** — start coding faster

---

## Consequences

### Positive
- Productivity from day 1
- Dev/prod parity (same Postgres version, same features)
- No system pollution
- Easy to share access if collaborator joins
- Cloud backups automatic

### Negative
- Requires internet connection to develop
- Cold start delay (~1-3s) if DB scaled to 0 (auto-resume)
- Slightly slower than local (~30ms vs <1ms) — negligible for dev

### Neutral
- Connection string format Neon-specific (slightly different from other providers)
- Free tier may impose limits if exceed (auto-scale up)

---

## Implementation Notes

### Setup
1. Sign up at neon.tech (GitHub auth)
2. Create project: `trading-journal`
3. Choose Postgres 18, region: AWS Asia Pacific 1 (Singapore)
4. Copy connection string from Connection Details

### Configuration
- `DATABASE_URL` in `.env` (gitignored)
- Pooled connection string for production deploys
- Direct connection for migrations

### Security
- Connection requires `?sslmode=require` — built into Neon URL
- Password rotation via Neon dashboard
- ⚠️ Rotated once after accidental exposure in chat output (recovered cleanly)

### Migration plan for Tier 2-3
Will explore Docker-based dev later as separate skill:
- **Sprint 5+ (Project 2):** Continue with Neon, add Docker only as learning exercise
- **Tier 3:** Containerize app, use docker-compose for full local stack
- **Production:** Neon (or potentially migrate to alternative if requirements grow)

---

## Future Reconsideration Triggers

- If Neon free tier becomes insufficient (10GB exceeded)
- If team grows and need shared Docker dev environment
- If offline development becomes critical
- If Neon goes through pricing changes that affect side project
- If learning Docker becomes priority skill goal

---

## References

- [Neon docs](https://neon.tech/docs)
- [Neon + Prisma guide](https://neon.tech/docs/guides/prisma)
- Related: ADR-002 (Prisma ORM), ADR-001 (Next.js framework)
- Discussed in: [docs/strategy/roadmap-analysis.md](../roadmap-analysis.md) under Sprint 1 reality check
