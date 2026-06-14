# 📦 Portfolio Folder

> Templates สำหรับ portfolio materials ที่ recruiter จะเห็น

---

## 📂 ไฟล์ในนี้

| ไฟล์ | จุดประสงค์ | ใช้ตอนไหน |
|------|-----------|-----------|
| [README-template.md](./README-template.md) | Project README structure | ทุก project ที่จะ deploy |
| [decision-log-template.md](./decision-log-template.md) | ADR (Architecture Decision Record) | บันทึก major decisions |
| [github-profile-template.md](./github-profile-template.md) | GitHub profile README | Update ตาม Tier ที่เสร็จ |

---

## 🎯 Portfolio Strategy

### Tier 1 (now → 4 months)
Goal: 3 deployed projects ที่มี README + decision logs

**Per project must have:**
- [ ] Live demo on Vercel
- [ ] README with template structure
- [ ] 2-3 ADRs documenting key decisions
- [ ] Screenshots/GIFs
- [ ] "What I learned" section honest
- [ ] Demo account credentials

### Tier 2 (months 5-7)
Goal: Add 2 portfolio-star projects

**Add:**
- [ ] Architecture diagrams (Excalidraw / draw.io)
- [ ] Performance metrics
- [ ] Test coverage badges (if applicable)
- [ ] Update GitHub profile to highlight star projects

### Tier 3 (months 8-9)
Goal: Production-grade upgrade of 1 project

**Add:**
- [ ] Docker setup documented
- [ ] CI/CD pipeline visible
- [ ] Monitoring/observability section
- [ ] "Production considerations" in README

### Tier 4 (months 10+)
Goal: Specialization signal

**Add:**
- [ ] Domain-specific project (e.g., trading bot)
- [ ] Blog post explaining approach
- [ ] Conference/meetup speaking (optional)

---

## 🚀 Quick Wins for Portfolio

### Week 1 of each project
1. Setup GitHub repo with clear name
2. README scaffold (use template)
3. License (MIT typical)
4. .gitignore tuned
5. Conventional commits from start

### Mid-project
1. Add ADRs as decisions made
2. Add architecture sketch (rough OK)
3. Screenshots of WIP

### End of project
1. Deploy to Vercel
2. Demo account setup
3. README polish
4. GIF of key feature
5. Update GitHub profile

---

## 📊 What Recruiters Actually Look For

**Time spent: 30 seconds to 5 minutes per candidate**

### First 10 seconds (profile)
- Profile photo professional ✓
- Bio clear (what + level) ✓
- Pinned repos relevant ✓
- Recent activity ✓

### Next 30 seconds (a project)
- README has live demo link ✓
- Tech stack clear ✓
- Screenshot visible ✓

### Next 1-2 minutes (deep dive)
- "What I Learned" reveals depth
- Decision log shows thinking
- Code quality (file structure)
- Commits clean (conventional)

### Final 1-2 minutes (interview prep)
- Are projects deployed?
- Can they explain decisions?
- Did they handle edge cases?
- Honest about limitations?

---

## 💡 Hidden Signals

### Strong positive signals
- Atomic commits with conventional format
- README with "What I'd do differently"
- ADRs (rare even in mid-level devs)
- Decision rationale in commits
- Test files visible
- Active maintenance (not abandoned)

### Strong negative signals
- README is just "How to install"
- Last commit > 6 months ago
- No live demo
- Generic project name (e.g., "todo-app")
- AI-generated boilerplate without customization
- Mock data hardcoded everywhere

---

## 📝 LinkedIn Strategy

Pair GitHub portfolio with LinkedIn:

### Profile
- Headline: "Fullstack Developer | Frontend → Backend Transition | Building in Finance Domain"
- About: 2-3 paragraphs (problem solving + projects + interests)
- Featured: pin top 2-3 projects
- Skills: ordered by depth (most expert first)

### Posts (1-2/week)
- Project completion announcements (deploy, mention demo)
- Lessons learned (concrete: "Today I learned about cache stampede...")
- Decision shares ("Why I chose JWT over sessions for this project")
- Honest struggles ("Spent 3 days debugging — turned out to be...")

### Don'ts
- Generic "Today's mood is grateful 🙏" posts
- Tutorial reposts without value-add
- Bragging without substance

---

## 🎯 Interview Conversation Map

When recruiter asks about projects, navigate:

```
"Tell me about your Trading Journal" (open)
   ↓
1-minute pitch from README
   ↓
"How did you handle [auth / db / X]?"
   ↓
Reference: docs/decisions/00X-*.md
   ↓
"What would you do differently?"
   ↓
Reference: README "What I'd Do Differently"
   ↓
"How would this scale to 100K users?"
   ↓
Reference: docs/strategy/roadmap-analysis.md (you've thought about this)
```

Having documentation handy = looks prepared + organized.

---

## 🔗 External Resources

- [GitHub Profile README examples](https://github.com/abhisheknaiidu/awesome-github-profile-readme)
- [ADR examples](https://adr.github.io/)
- [README best practices](https://github.com/matiassingers/awesome-readme)
- [Shields.io for badges](https://shields.io/)
