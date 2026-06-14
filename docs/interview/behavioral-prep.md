# 🎤 Behavioral Interview Prep

> สำหรับ behavioral / soft skills part ของสัมภาษณ์
> เน้น tech roles ที่บริษัทถามเรื่อง teamwork, problem-solving, growth

---

## 📚 Table of Contents

1. [STAR Format](#1-star-format)
2. [Common Questions + Templates](#2-common-questions)
3. [Strength-Specific Stories](#3-strength-stories)
4. [Weakness Strategy](#4-weakness-strategy)
5. [Questions to Ask Interviewer](#5-questions-to-ask)
6. [Salary Negotiation](#6-salary-negotiation)
7. [Red Flag Detection](#7-red-flags)

---

## 1. STAR Format

**S** — Situation (context)
**T** — Task (what needed to be done)
**A** — Action (what YOU did)
**R** — Result (outcome + lessons)

### Template

```
"At [company/project], we were facing [problem/situation].
I was responsible for [specific role].

I [took these actions:]
1. [Action 1]
2. [Action 2]
3. [Action 3]

The result was [measurable outcome].

I learned [insight] — which I've applied since by [example]."
```

### Why STAR

- Concrete (not vague)
- Shows your contribution (not "we")
- Has measurable outcome
- Demonstrates learning

### Common STAR mistakes

❌ Too vague: "I solved a hard problem"
❌ Too "we" focused: "Our team built it"
❌ No outcome: "I worked on the auth system"
❌ Negative ending: "It didn't work out"

✅ Specific: "I reduced API latency from 800ms to 120ms by implementing Redis cache"
✅ "I" focused: "I designed the cache layer with TTL and stale-while-revalidate"
✅ Measurable: "85% reduction in external API calls"
✅ Learning: "Taught me cache invalidation strategies, applied to next project"

---

## 2. Common Questions

### Q1: "Tell me about yourself"

**Template:**
> "I'm [name], currently a frontend developer with [X years] experience in React and TypeScript.
>
> For the past [N months], I've been transitioning to fullstack by building production-ready projects — most recently a trading journal app with Next.js, Prisma, and Auth.js.
>
> I'm motivated by [your motivation — domain interest, technical depth, etc.].
>
> I'm looking for [role type] where I can [contribute X + learn Y]."

**Length: 60-90 seconds**

### Q2: "Why are you leaving your current job?"

**Strong answer:**
> "I'm grateful for the [X years] at [company] — I learned [skill] and grew from [junior level] to [senior level].
>
> Now I'm looking for opportunities to [grow in fullstack / work on harder problems / etc.]. My current role is primarily frontend-focused, and I want to apply what I've been learning in backend to real production work."

**Avoid:** Bad-mouthing previous employer, salary as primary reason

### Q3: "Tell me about a challenging project"

**Use Trading Journal as example:**
> "**Situation:** I came from a frontend-only background but wanted to build a complete fullstack app. Trading Journal was my first complete project covering auth, database design, and stats aggregation.
>
> **Task:** Build a multi-user trading journal that calculates P&L correctly, even with edge cases like open positions and short selling.
>
> **Action:**
> 1. Designed schema with M:N relationship between trades and strategy tags
> 2. Implemented auth with Auth.js + JWT — researched session vs JWT trade-offs
> 3. Made P&L calculation server-side with Zod validation
> 4. Used Prisma transactions for atomic updates
>
> **Result:**
> - Deployed working app at [URL]
> - All security baseline criteria met (scoped queries, hashed passwords, etc.)
> - Wrote ADRs documenting decisions
>
> **Lesson:** Schema design needs to account for future changes — adding a column is much cheaper than restructuring later. I now spend more upfront time on data model."

### Q4: "Tell me about a time you failed"

**Strong answer:**
> "**Situation:** Early in this project, I initially designed the schema without a `side` field for trades — assumed everything was a long position.
>
> **Task:** P&L calculation needed to support short positions.
>
> **Action/Mistake:** Realized this during Sprint 2 when implementing stats. Had to:
> 1. Add migration to include `side` enum
> 2. Backfill existing test data
> 3. Update all P&L code paths
>
> **Result:** Added 3-4 hours of work that could have been avoided.
>
> **Lesson:** Now I think about "what other variants exist?" before finalizing schema. For E-commerce project later, I included `OrderStatus` enum from day 1 — saved future pain. I document these decisions in ADRs so I (and team) remember the reasoning."

### Q5: "Describe a conflict with a teammate"

**Adapt to school/internship/freelance:**
> "**Situation:** In [project], a teammate wanted to use [approach X] for [feature]. I felt [approach Y] was better for [reason].
>
> **Action:**
> 1. I asked them to share their reasoning fully before responding
> 2. I shared my concerns with concrete examples
> 3. We agreed to spike both approaches for 1 day, compare
> 4. Their approach turned out better for [specific reason I hadn't considered]
>
> **Result:** Adopted their solution. Project shipped on time.
>
> **Lesson:** I learned [the other approach's strength]. Now I default to 'spike both' for contested technical decisions rather than debating in meetings."

### Q6: "Tell me about a time you learned something new quickly"

**Use this roadmap as example:**
> "**Situation:** I'm a frontend dev with 3 years experience but no backend. I decided to transition to fullstack.
>
> **Task:** Become production-ready in backend within 6-8 months.
>
> **Action:**
> 1. Designed a 16-sprint roadmap with progressive complexity (Trading Journal → Portfolio → Realtime Kanban)
> 2. Built each project end-to-end (deploy, README, decision logs)
> 3. Made deep-dive notes on each new concept (cache, transactions, jobs)
> 4. Tracked progress and adjusted timeline realistically
>
> **Result:** In [N months], deployed [N projects] covering auth, caching, background jobs, transactions — concepts I'd never touched before.
>
> **Lesson:** Setting up explicit learning structure with deliverables (deploy by date X) beats casual reading. I apply the same approach now for any new tech."

### Q7: "How do you handle disagreement with your manager?"

**Template:**
> "**Situation:** Imagine my manager wanted [approach A] for [task], but I had data showing [approach B] was better.
>
> **Action:**
> 1. Document my reasoning with data (benchmarks, prior art)
> 2. Schedule 1:1 to discuss — not in group setting
> 3. Present analysis: 'Here's what I found, what am I missing?'
> 4. If they still disagree after seeing data, defer — they have context I don't
>
> **Outcome philosophy:** I voice concerns once with data, then commit fully even if I disagree. The cost of being right isn't worth poisoning the team dynamic."

### Q8: "Where do you see yourself in 5 years?"

**Strong answer:**
> "Honestly, I want to be at the intersection of [domain interest] and [technical depth].
>
> Specifically:
> - Year 1-2: Solid mid-level fullstack engineer
> - Year 3-4: Senior with depth in [area you're building toward — e.g., realtime systems or fintech]
> - Year 5: Architecting systems + mentoring junior devs
>
> I'm not interested in pure management track — I want to keep building.
>
> What matters: continuous learning + solving real problems for real users."

---

## 3. Strength Stories

### Strength: Strong learner / autodidact

**Story bank:**
- Self-designed 16-sprint roadmap with clear deliverables
- Built [N projects] from zero backend background
- Maintained learning journal and decision logs

### Strength: Detail-oriented / Quality-focused

**Story bank:**
- Wrote tests for business logic (P&L calc edge cases)
- Documented architecture decisions
- Defense in depth security thinking

### Strength: Pragmatic / Trade-off thinking

**Story bank:**
- Chose JWT over Session (researched both, documented decision)
- Used Float for prices initially with migration plan to Decimal
- Picked DB cache for v1, planned Redis migration for scale

### Strength: Communication / Documentation

**Story bank:**
- ADRs that future-me + recruiters can understand
- READMEs with "What I'd do differently"
- Pre-reading docs to share knowledge

### Strength: Frontend foundation + backend growth

**Story bank:**
- Translate frontend patterns to backend (React Router → App Router)
- Understand both ends of the stack
- Empathy for end-user experience

---

## 4. Weakness Strategy

### The 3-part formula

```
1. Honest weakness (real, not fake-weakness)
2. Specific actions you take to mitigate
3. Concrete progress
```

### Bad examples
❌ "I work too hard" (cliché)
❌ "I'm a perfectionist" (cliché)
❌ "I have no weaknesses" (red flag)
❌ "I'm terrible at [core job skill]" (auto-reject)

### Good examples

**Example 1: Time estimation**
> "**Weakness:** I tend to underestimate task complexity, especially in unfamiliar domains.
>
> **Mitigation:**
> 1. I now add 30% buffer to estimates
> 2. I break tasks into smaller deliverables with checkpoints
> 3. I document time taken vs estimate so I can calibrate
>
> **Progress:** On recent projects, I tracked actual vs estimate — early sprints were 50% over, now I'm within 15% on average."

**Example 2: Architecture deep dives**
> "**Weakness:** Coming from frontend, my system design intuition is still developing — I sometimes don't see scaling concerns experienced backend devs spot immediately.
>
> **Mitigation:**
> 1. I research scaling considerations in deep-dive notes
> 2. I ask 'how would this break at 100x scale?' for every component
> 3. I read engineering blogs from companies (Stripe, Netflix, etc.)
>
> **Progress:** I've documented common pitfalls (N+1, cache stampede, race conditions) and applied them in my projects. Still learning — but the gap is closing."

**Example 3: Public speaking / presentations**
> "**Weakness:** Standup updates and technical presentations make me nervous, leading to over-preparation.
>
> **Mitigation:**
> 1. I write key points first (talking outline)
> 2. I practice once aloud before standup
> 3. I started attending tech meetups to build comfort
>
> **Progress:** Quarterly demos I give are now well-received. Still uncomfortable but functional."

---

## 5. Questions to Ask

**Critical — Always ask 3-5 questions. Shows interest + helps you evaluate.**

### About the role (must ask)
- "What does success look like for this role in the first 6 months?"
- "What's the biggest challenge facing the team right now?"
- "How does the team prioritize between new features and tech debt?"

### About the tech
- "Walk me through your typical deployment process"
- "How do you handle production incidents?"
- "What's the testing culture? E2E? Unit?"

### About the team
- "How is the team structured? (squad, project-based, etc.)"
- "How do code reviews work?"
- "How does the team handle disagreements on technical direction?"

### About growth
- "How does growth from [your level] to [next level] look?"
- "What kind of mentorship/learning support is available?"
- "Are there opportunities to work on [area you want to learn]?"

### About culture
- "Tell me about your remote/hybrid culture"
- "How does the team unwind / build rapport?"
- "What's one thing you'd change about working here?"

### Red flag detection (subtle)
- "What's the typical work week look like?" (60 hours?)
- "How does on-call work?" (every 3 weeks vs every 6)
- "What's the manager turnover been like?"

---

## 6. Salary Negotiation

### When to discuss
- **NEVER** in first interview
- **NEVER** be first to give number
- Save for after offer

### When asked early
> "I'd love to focus on whether we're a good fit first. Could we revisit compensation once we know more about what level the role is?"

### When pressed for number
> "Based on my research for this role and location, I'm targeting around [X] base. But I'm flexible based on the full package."

(Have 3 numbers ready: stretch, target, walkaway)

### When offer comes in
- Always negotiate (1-2 rounds is expected)
- Don't accept first offer immediately

**Counter template:**
> "Thanks so much for the offer. I'm excited about the role.
>
> I was hoping for [X% higher] based on:
> 1. My experience with [specific skill they value]
> 2. Market data showing [research source]
> 3. The scope of responsibility we discussed
>
> Is there flexibility on [salary / signing bonus / equity / start date]?"

### Levers beyond base salary
- Signing bonus (one-time, easier to negotiate)
- Equity / RSU
- Title (affects future jobs)
- Start date
- Vacation days
- Remote flexibility
- Learning budget
- Equipment budget

---

## 7. Red Flag Detection

### During interview process

**🚩 Process red flags:**
- 5+ rounds of interview for non-senior role
- No technical interviewer in process
- Vague answers about role/team
- Pressure to decide quickly
- No mention of code review / testing
- "We work as a family" (means: no boundaries)

**🚩 Compensation red flags:**
- Won't share range until offer
- "We can discuss salary after you accept"
- Equity but no transparency on valuation
- Unlimited PTO (often = less PTO taken)

**🚩 Tech red flags:**
- Custom framework instead of standard
- "Move fast and break things" without nuance
- No tests / no CI
- Manual deployments
- "Hero culture" praised

### After offer

**🚩 Document red flags:**
- 24-hour decision deadline
- NDA before discussing salary
- Restrictive non-compete

**🚩 Reference checks reveal:**
- High turnover at company
- Glassdoor reviews mention burnout
- Management has had 3+ shake-ups

### How to verify

1. **Glassdoor** + Blind app — anonymous reviews
2. **LinkedIn** — see how long current employees stay
3. **Engineering blog** — does company write about engineering?
4. **GitHub** — open source contributions = good signal

---

## 🎯 Pre-Interview Checklist

### 24 hours before
- [ ] Re-read this doc
- [ ] Practice 3 STAR stories aloud
- [ ] Prepare 5 questions for interviewer
- [ ] Research interviewer on LinkedIn
- [ ] Re-read company "about" + recent news
- [ ] Sleep 8+ hours

### Day of
- [ ] Review portfolio README for top project
- [ ] Have water + notes nearby
- [ ] Test camera/mic 30 min before
- [ ] Open relevant code in editor (for live demo)
- [ ] Smile + breathe before joining

### After
- [ ] Send thank-you email within 24 hours
- [ ] Note questions you struggled with → improve for next
- [ ] Update interview-prep with new questions encountered

---

## 📊 Practice Schedule

**Week before applying:**
- Day 1-2: Read this doc + customize answers
- Day 3-4: Record yourself answering common questions
- Day 5-6: Mock interview with friend or Claude
- Day 7: Polish + sleep

**Mock interview with Claude:**
> "Act as a hiring manager for a fullstack role. Ask me 5 behavioral questions, then give me feedback on my answers using the STAR criteria."

---

## 🎯 Key Mindset

**Interview is mutual evaluation.** Companies evaluate you, you evaluate them.

The best outcome isn't "got offer" — it's "got offer from company that fits + saved myself from bad fit".

Be honest:
- About strengths AND limitations
- About what you want
- About what concerns you

Companies want people who know themselves.

---

## 🔗 Resources

- [Levels.fyi](https://levels.fyi) — salary research
- [Pragmatic Engineer Blog](https://pragmaticengineer.com/) — industry context
- [Cracking the PM Interview style for behavioral](https://www.amazon.com/Cracking-PM-Interview)
- [Glassdoor + Blind for company research]
