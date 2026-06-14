# 📋 Architecture Decision Records (ADR)

> Major decisions ที่ส่งผลกับ project — บันทึก rationale ไว้สำหรับอนาคต

---

## 📚 Decision Log

| # | Title | Status | Date | Tags |
|---|-------|--------|------|------|
| [001](./001-nextjs-app-router.md) | Use Next.js 16 with App Router | Accepted | 2026-06-14 | framework, architecture |
| [002](./002-prisma-7-orm.md) | Use Prisma 7 as ORM | Accepted | 2026-06-14 | database, orm |
| [003](./003-neon-postgres.md) | Use Neon (cloud Postgres) for dev DB | Accepted | 2026-06-14 | database, infrastructure |
| [004](./004-jwt-session.md) | Use JWT session strategy | (pending Issue #6) | TBD | auth, security |
| [005](./005-personal-knowledge-gitignored.md) | Keep personal knowledge notes private | Accepted | 2026-06-15 | docs, workflow |

---

## 🎯 What to write ADRs for

### Write ADR when
- Choosing between multiple acceptable approaches
- Decision has long-term implications
- Reversal would be costly
- Non-obvious to future-self
- Want to capture context that fades

### Skip ADR when
- Implementation detail (file naming)
- Style preference (prettier handles it)
- Trivial choice (variable names)
- Easy to change later (component API)

---

## 📐 Format

Use [decision-log-template.md](../../portfolio/decision-log-template.md) for new entries.

Quick template:
```markdown
# ADR-NNN: Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Context
[Why this decision is needed]

## Options
1. Option A — pros/cons
2. Option B — pros/cons

## Decision
[What was chosen and why]

## Consequences
[Trade-offs accepted]
```

---

## 🔄 Lifecycle

```
[Proposed] ───► [Accepted] ───► [Deprecated]
                    │                ▲
                    └────────────────┘
                       (superseded
                        by new ADR)
```

When superseding: update old ADR status → reference new ADR.

---

## 🎯 Cadence

- **Before major implementation:** write ADR if multiple approaches viable
- **End of sprint:** review if any decisions made that need recording
- **Project completion:** ensure all ADRs current

---

## 💡 Anti-patterns

### Don't
- Write ADRs after the fact for tutorial decisions
- Add ADRs for choices with no real alternative
- Make ADRs into prose (use structure)
- Forget to update status when superseded

### Do
- Be specific about context
- Show options considered (even rejected ones)
- Explain reasoning honestly
- Note what would trigger reconsideration

---

## 📚 Resources

- [adr.github.io](https://adr.github.io/) — community standard
- [Michael Nygard's article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) — original concept
- See filled examples in [portfolio/decision-log-template.md](../../portfolio/decision-log-template.md)
