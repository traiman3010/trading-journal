# ADR-001: Use Next.js 16 with App Router

**Date:** 2026-06-14
**Status:** Accepted
**Deciders:** [Project owner]
**Tags:** framework, architecture, foundation

---

## Context

Starting Trading Journal — first fullstack project. Need to choose:
- Framework: Next.js vs Remix vs separate React + Node backend
- Routing approach: App Router (new) vs Pages Router (legacy)

Coming from 3 years React experience (no Next.js production work).

Key constraints:
- Want full-stack in one repo (faster iteration)
- TypeScript-first
- Deploy to Vercel free tier
- Need both SSR and CSR capabilities
- Build on App Router patterns since they're the future

---

## Considered Options

### Option 1: Next.js 16 with App Router ⭐ Chosen
- **Pros:**
  - Server Components reduce client JS bundle
  - Modern React 19 features (RSC, async components, Server Actions)
  - Vercel-native deployment
  - File-based routing maps to URL structure
  - TypeScript + import alias built-in
- **Cons:**
  - Newer concept (Server vs Client Components) confusing initially
  - Some libraries don't support RSC yet
  - Less Stack Overflow content vs Pages Router

### Option 2: Next.js 16 with Pages Router
- **Pros:**
  - Established patterns
  - More tutorials/Stack Overflow
  - Familiar to React developers
- **Cons:**
  - All components client-side by default (larger bundle)
  - getServerSideProps boilerplate for data fetching
  - Being phased out — feature freeze, only App Router gets new features

### Option 3: Remix
- **Pros:**
  - Nested routing model elegant
  - Strong focus on web standards
  - Excellent forms support
- **Cons:**
  - Smaller ecosystem
  - Deploy ecosystem smaller than Vercel
  - Less mainstream adoption

### Option 4: React + Express/Fastify (separate)
- **Pros:**
  - Full control
  - Familiar separation
- **Cons:**
  - Two codebases to maintain
  - More boilerplate
  - Slower iteration

---

## Decision

**Use Next.js 16 with App Router**

Reasoning:
1. **App Router is the future** — Pages Router is in maintenance mode
2. **Server Components reduce client JS** — important for production performance
3. **Vercel deployment is free + automatic** — no infra burden for side project
4. **Single codebase** — faster iteration as solo learner
5. **Industry alignment** — most modern startups using App Router

---

## Consequences

### Positive
- Modern patterns learned (transferable to industry)
- Lower client bundle = faster page loads
- Server Actions enable simpler form handling
- Built-in middleware for auth
- Free CI/CD via Vercel git integration

### Negative
- Learning curve for Server vs Client Components mental model
- "use client" sprinkled in interactive components
- Some libraries need shim or alternative
- App Router APIs still evolving (small changes possible)

### Neutral
- File structure differs from traditional React apps
- Need to think about which boundary to make 'use client'

---

## Implementation Notes

Setup command used:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

Key decisions documented in CLAUDE.md:
- App Router by default (`app/` folder)
- No `src/` directory (files at root)
- Tailwind CSS v4
- Strict TypeScript
- `@/` import alias

Conventions:
- Server Components are default
- Client Components marked with `"use client"` directive
- Forms use Server Actions where possible

---

## Future Reconsideration Triggers

- If RSC pattern proves too complex for team productivity
- If Vercel deployment cost becomes issue (move to self-hosted)
- If significantly better framework emerges with smooth migration
- If need to support React Native (consider Tamagui or Expo Router)

---

## References

- [Next.js docs](https://nextjs.org/docs)
- [App Router vs Pages Router migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- Related: ADR-005 (knowledge folder gitignored)
