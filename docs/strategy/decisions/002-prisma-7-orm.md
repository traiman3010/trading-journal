# ADR-002: Use Prisma 7 as ORM

**Date:** 2026-06-14
**Status:** Accepted
**Deciders:** [Project owner]
**Tags:** database, orm, typescript

---

## Context

Need to interact with Postgres safely from TypeScript codebase. Options span from raw SQL to heavy ORMs. Project requires:
- Type-safe queries (autocomplete + compile-time errors)
- Migration management
- Easy relations (User → Trade → Tag)
- Workable as ORM newcomer (frontend background)
- Good developer experience

---

## Considered Options

### Option 1: Prisma 7 ⭐ Chosen
- **Pros:**
  - Best TypeScript integration (auto-generated types)
  - Schema-first approach (visualize data model)
  - Built-in migration tooling
  - Top community + extensive docs
  - Prisma Studio for visual DB browsing
  - New v7 has improved config (prisma.config.ts), TS-native client
- **Cons:**
  - Abstraction can hide actual SQL
  - Complex queries need `$queryRaw` anyway
  - v7 is newer (less Stack Overflow content)
  - Generated client in custom path needs gitignore tuning

### Option 2: Drizzle ORM
- **Pros:**
  - SQL-like syntax (familiar if know SQL)
  - No code generation step
  - Lighter weight (smaller bundle)
  - Type inference without generation
- **Cons:**
  - Smaller community
  - Less mature migration tooling
  - Less polished DX for beginners
  - More verbose for complex queries

### Option 3: TypeORM
- **Pros:**
  - Decorator-based (familiar to Java/C# devs)
  - Active record pattern available
- **Cons:**
  - TypeScript types less rigorous
  - History of bugs in production
  - Slower development of newer features

### Option 4: Raw SQL (pg + custom types)
- **Pros:**
  - Full control over queries
  - No abstraction overhead
  - Learn SQL deeply
- **Cons:**
  - Manual type writing
  - Manual migration management
  - Slower development
  - Error-prone for relations

---

## Decision

**Use Prisma 7**

Reasoning:
1. **Type safety from frontend to backend** — aligns with TS-first stack
2. **Schema visualization aids learning** — clear data model
3. **Migration tooling out-of-box** — versionable schema changes
4. **Industry standard** — transferable skill
5. **Excellent DX for ORM newcomers** — appropriate learning velocity

When raw SQL becomes necessary (window functions, complex aggregations), Prisma's `$queryRaw` provides escape hatch.

---

## Consequences

### Positive
- 90%+ queries fully type-safe with autocomplete
- Schema changes tracked via migrations (reviewable in PR)
- Prisma Studio for browsing/debugging data
- Easy relations (`include: { trades: true }`)
- Strong onboarding for new contributors

### Negative
- Generated client in `app/generated/prisma/` adds build step
- Some queries need workaround (complex JOINs)
- ORM abstraction hides what SQL is actually run
- v7 is newer — fewer community examples

### Neutral
- Schema definition in own DSL (`.prisma` file)
- Lock-in to Prisma's query semantics

---

## Implementation Notes

### Prisma 7 specifics encountered
- Uses `prisma.config.ts` instead of inline config in schema
- Requires `dotenv` package (not auto-loaded)
- Generates client to user-specified path
- Schema syntax mostly same as v6

### Setup commands
```bash
npm install prisma --save-dev
npm install @prisma/client
npm install --save-dev dotenv
npx prisma init --datasource-provider postgresql
```

### Config
```typescript
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### Schema design highlights
- All user-data models have `userId String` foreign key
- Cascade delete from User to dependent models
- Composite unique constraint for user-scoped uniqueness (e.g., `@@unique([userId, name])` on Tag)
- Many-to-many via implicit join table

---

## Future Reconsideration Triggers

- If complex queries comprise >40% of code → consider Drizzle or raw SQL
- If Prisma v8 breaks backward compatibility severely
- If performance bottleneck traces to ORM overhead
- If migrating to non-relational DB (Prisma supports MongoDB but motivation matters)

---

## References

- [Prisma docs](https://www.prisma.io/docs)
- [Prisma 7 release notes](https://www.prisma.io/blog)
- Related: ADR-001 (Next.js framework), ADR-003 (Neon for hosting)
- Knowledge: [docs/knowledge/auth-deep.md](../../knowledge/auth-deep.md) covers auth + Prisma patterns
