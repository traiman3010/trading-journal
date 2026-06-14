# ADR-005: Keep Personal Knowledge Notes Private (Gitignored)

**Date:** 2026-06-15
**Status:** Accepted
**Deciders:** [Project owner]
**Tags:** workflow, docs, privacy

---

## Context

While building this project, I'm accumulating personal learning notes in `docs/knowledge/`. These include:
- Raw notes on concepts learned
- Personal reflections on what's hard
- Half-formed understanding (will refine over time)
- Reference material from Claude (pre-reading docs)

Question: should these be in git history (public on GitHub) or local-only?

---

## Considered Options

### Option 1: Gitignore knowledge folder ⭐ Chosen
- **Pros:**
  - Free to write rough/raw notes
  - No pressure to make them "presentable"
  - Privacy on partial understanding
  - Doesn't pollute repo with personal content
- **Cons:**
  - No automatic backup
  - Can't reference from another machine
  - Lose if local disk dies
  - Lose "learn in public" portfolio signal

### Option 2: Commit knowledge folder publicly
- **Pros:**
  - "Learn in public" — recruiters like this
  - Backup via GitHub
  - Accessible across devices
  - Could become blog content
  - Signal of learning depth
- **Cons:**
  - Pressure to write "clean"
  - Vulnerability of showing what I don't know
  - Mixed with project code makes repo less focused
  - Some notes might be incorrect (early understanding)

### Option 3: Separate private repo
- **Pros:**
  - Backed up via GitHub
  - Private (not visible to public)
  - Doesn't mix with project code
- **Cons:**
  - Two repos to maintain
  - Cross-reference between them harder
  - Slight friction to update both

---

## Decision

**Gitignore personal knowledge in this repo**

Rationale:
1. **Reduce friction to write** — raw notes are most useful, polished is overrated for personal learning
2. **Keep repo focused** — Trading Journal repo should be about the app, not my learning
3. **Avoid premature exposure** — partial understanding shouldn't be public reference
4. **Backup separately** — plan to use external sync (Notion, Obsidian, etc.) if needed

### Specifically gitignored
```
# .gitignore
docs/knowledge/
```

### What stays committed (still public-friendly)
- `docs/strategy/` — roadmap, ADRs (project-level decisions)
- `docs/interview/` — could move to gitignore later if want private
- `docs/PROGRESS.md` — public progress tracking is motivating
- Project source code, schemas, migrations

---

## Consequences

### Positive
- Lower barrier to writing notes
- Repo stays focused on project
- Personal vulnerability protected
- No need to "polish" every note

### Negative
- ⚠️ Notes lost if local disk fails (mitigation: external backup)
- Can't access from other machines (mitigation: cloud sync separately)
- No "learn in public" signal from this folder (offset by ADRs + READMEs)

### Neutral
- Future migration to public always possible (just `git add docs/knowledge/`)
- Can selectively make some files public later (move out of gitignored folder)

---

## Implementation Notes

`.gitignore` addition:
```
# personal notes (not for public)
docs/knowledge/
```

Files currently in this folder:
- `nextjs.md` — App Router learnings (filling in)
- `auth-deep.md` — Reference doc from Claude
- `caching-deep.md` — Reference doc
- `background-jobs-deep.md` — Reference doc
- `realtime-deep.md` — Reference doc
- `transactions-deep.md` — Reference doc
- `sql-cheatsheet.md` — Reference doc
- `react.md`, `auth.md`, `database.md`, `security.md`, `git-github.md` — skeletons for personal notes

---

## Future Reconsideration Triggers

- If multiple disk failures lose notes (then: external backup mandatory)
- If recruiters specifically ask about learning notes (then: publish selectively)
- If team forms around this project (then: shared knowledge moved to wiki)
- If decide to build "learn in public" portfolio (then: separate public knowledge repo)

---

## Mitigation for Loss Risk

Plan to maintain external backup:
- [ ] Setup automatic sync to cloud (Dropbox, iCloud, etc.)
- [ ] Or: weekly manual sync to private Notion
- [ ] Or: maintain mirror in private GitHub repo

---

## References

- Related: ADR-001 (Next.js — defines docs structure)
- Discussed during Sprint 1 by project owner
