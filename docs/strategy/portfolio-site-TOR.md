# 🌐 TOR — Personal Portfolio Website

> ทำหลัง Sprint 4 (Trading Journal deploy) — ใช้เป็นที่โชว์ผลงาน
> ความยาก: ⭐⭐ | ใช้เวลาประมาณ 2-3 sprints (3-6 weeks)

---

## 1. ภาพรวมโปรเจกต์

**ชื่อ:** Personal Portfolio Website
**URL:** [yourname].dev หรือ [yourname].com

**ปัญหาที่แก้:**
- Recruiter ต้องการดูผลงาน + bio รวมในที่เดียว
- LinkedIn จำกัด format
- GitHub มี code แต่ไม่มี context
- ต้องการ professional online presence

**สิ่งที่ project นี้ฝึก (ต่อจาก Trading Journal):**
- Static site generation (Next.js SSG)
- SEO optimization จริงจัง
- Design + UX skills
- Content writing (technical bio + case studies)
- Performance optimization (Lighthouse 100)
- Animation + micro-interactions

---

## 2. ขอบเขตงาน

### In Scope (v1)
- Homepage with hero + 1-line pitch
- Projects showcase (3-5 projects)
- About me page
- Contact form / email link
- Resume PDF download (optional)
- Blog (optional in v1, recommended in v2)
- Dark mode

### Out of Scope (v1)
- E-commerce (selling courses, etc.)
- User accounts / authentication
- CMS for non-technical content updates
- Multi-language support
- Newsletter signup with email service

### Future (v2)
- Blog with MDX
- Case studies (deep dive on each project)
- Testimonials
- Open source contributions list
- Speaking/podcast appearances

---

## 3. User Stories

### US-1: Recruiter sees portfolio
**As a** recruiter
**I want** to see this person's skills and work quickly
**So that** I can decide if they're a fit

**Acceptance Criteria:**
- [ ] Homepage loads in <2s
- [ ] Hero section communicates value in 5 seconds
- [ ] Featured projects clickable to detail
- [ ] Contact info visible
- [ ] Mobile responsive

### US-2: Recruiter explores project
**As a** recruiter
**I want** to understand the depth of a specific project
**So that** I can prepare interview questions

**Acceptance Criteria:**
- [ ] Each project page shows: problem, solution, tech, learnings
- [ ] Live demo + GitHub link visible
- [ ] Screenshots/GIFs
- [ ] "What I'd do differently" section

### US-3: Visitor wants to contact me
**Acceptance Criteria:**
- [ ] Email visible (or contact form)
- [ ] Social links (LinkedIn, GitHub, Twitter)
- [ ] Optional: scheduling link (Cal.com, Calendly)

### US-4: SEO / discoverability
**Acceptance Criteria:**
- [ ] Showing in Google for "[your name] developer"
- [ ] Open Graph image for social sharing
- [ ] Lighthouse SEO score 100
- [ ] Sitemap + robots.txt

---

## 4. Site Map

```
/                    Homepage
├── /projects        All projects grid
│   ├── /projects/trading-journal
│   ├── /projects/portfolio-tracker
│   ├── /projects/realtime-kanban
│   └── /projects/...
├── /about           About me / story
├── /resume          Resume page (or PDF link)
└── /contact         Contact form (optional)

(v2)
└── /blog            Blog index
    └── /blog/[slug] Blog post
```

---

## 5. Tech Stack

### Recommended

```
Framework:   Next.js 16 (App Router, static export)
Language:    TypeScript
Styling:     Tailwind CSS v4
Content:     MDX (for blog) + JSON (for projects)
Hosting:     Vercel (free tier perfect)
Domain:      Namecheap / Cloudflare ($10-15/year)
Email:       Resend (for contact form) — or mailto
Analytics:   Vercel Analytics (free) or Plausible
Fonts:       Custom (Inter, Geist) via next/font
Icons:       Lucide / Heroicons
Animation:   Framer Motion (sparingly!)
SEO:         Next.js built-in metadata API
```

### Alternative: Astro
If you want to learn something new + max performance:
- Static-first
- Multiple framework support
- Smaller bundle
- More opinionated about content

Trade-off: Astro is new skill vs reusing Next.js knowledge

---

## 6. Design Principles

### Speed first
- Static HTML where possible
- No client JS unless needed
- Optimized images (Next.js Image)
- Fonts preloaded
- Lighthouse 95+ all categories

### Simple > Fancy
- Clean typography
- Plenty of whitespace
- Limited color palette (3-5 colors)
- Don't over-animate

### Accessible by default
- Semantic HTML
- Keyboard navigable
- Screen reader friendly
- 4.5:1 contrast minimum

### Mobile first
- 60%+ traffic mobile
- Test on actual phone
- Touch targets 44x44px+

---

## 7. Content Strategy

### Homepage hero

```
Headline:
  "I'm [Name], a fullstack developer building [domain] tools"

Subhead:
  "Currently at [Company / freelance]. Specializing in
   [React, TypeScript, fullstack systems]."

CTA:
  [See my work] [Get in touch]
```

**Length: 5-10 seconds to read**

### Project cards

Each card:
```
[Screenshot/GIF]
Title — Tech badge

One-line description of problem solved

[Live demo] [GitHub] [Case study →]
```

### Project detail page

Structure:
```
1. Hero: title + tech stack badges
2. Overview: 2-3 sentences
3. Problem: what gap I addressed
4. Solution: how I built it
5. Tech decisions: WHY each choice
6. Screenshots / video
7. What I learned
8. What I'd do differently
9. Links: live + code
```

### About page

Structure:
```
1. Photo (professional, friendly)
2. Story (where you came from, where going)
3. What you do best
4. What you're learning
5. Interests outside coding
6. Resume PDF
7. Contact CTA
```

### Tone

- First person ("I built", "I learned")
- Honest (admit limitations)
- Specific (numbers, not vague)
- Not overly formal

---

## 8. Layout Patterns

### Homepage

```
┌──────────────────────────────────────┐
│ [Logo]                  [Nav: Projects About Contact] │
├──────────────────────────────────────┤
│                                      │
│   Big headline                       │
│   Supporting subhead                 │
│   [CTA buttons]                      │
│                                      │
├──────────────────────────────────────┤
│   Featured Projects (3-5 cards)      │
│   ┌──┐ ┌──┐ ┌──┐                    │
│   │  │ │  │ │  │                    │
│   └──┘ └──┘ └──┘                    │
├──────────────────────────────────────┤
│   Brief about / current focus        │
├──────────────────────────────────────┤
│   Footer: contact + social           │
└──────────────────────────────────────┘
```

### Project detail

```
┌──────────────────────────────────────┐
│ Project Title                        │
│ [Tech badges]                        │
│ [Live demo] [GitHub]                 │
├──────────────────────────────────────┤
│ Hero image / screenshot              │
├──────────────────────────────────────┤
│ Overview                             │
│ ...                                  │
│                                      │
│ Problem                              │
│ ...                                  │
│                                      │
│ Solution                             │
│ ...                                  │
│                                      │
│ Tech Decisions                       │
│ - Decision 1: why                    │
│ - Decision 2: why                    │
│                                      │
│ Screenshots                          │
│ [image grid]                         │
│                                      │
│ What I Learned                       │
│ - Insight 1                          │
│ - Insight 2                          │
└──────────────────────────────────────┘
```

---

## 9. Implementation Phases

### Phase 0 — Setup (week 1)
- [ ] Next.js project setup with TypeScript + Tailwind
- [ ] Folder structure for app, components, content
- [ ] Domain registered
- [ ] Vercel deployment configured
- [ ] Basic layout (header, footer)
- [ ] Dark mode toggle (using `next-themes`)

### Phase 1 — Homepage + Projects index (week 2)
- [ ] Hero section
- [ ] Project card component
- [ ] Projects grid (data from JSON file)
- [ ] Mobile responsive
- [ ] Lighthouse 90+

### Phase 2 — Project detail pages (week 3)
- [ ] Dynamic route /projects/[slug]
- [ ] Project data model (JSON or MDX)
- [ ] All 3-5 projects content written
- [ ] Image optimization
- [ ] Open Graph images

### Phase 3 — About + Contact (week 4)
- [ ] About page with story
- [ ] Contact options (email, social)
- [ ] Optional: contact form with Resend
- [ ] Resume PDF link
- [ ] Footer with social links

### Phase 4 — Polish + Optimize (week 5)
- [ ] Lighthouse 100 all categories
- [ ] Accessibility audit (WAVE, axe)
- [ ] Cross-browser testing
- [ ] SEO meta tags + sitemap
- [ ] Analytics setup
- [ ] Custom 404 page

### Phase 5 — Launch (week 6)
- [ ] Custom domain configured
- [ ] HTTPS verified
- [ ] Submit to Google Search Console
- [ ] Social media announce
- [ ] Add to LinkedIn

### (Optional) Phase 6+ — Blog (later)
- [ ] MDX setup
- [ ] Blog index page
- [ ] First 2-3 posts about projects

---

## 10. Inspirations

### Design references (browse before designing)
- brittanychiang.com — clean, content-first
- leerob.io — Vercel/dev style
- josh.is — playful + technical
- joshwcomeau.com — animated + colorful
- delba.dev — minimal + Brazilian charm
- rauchg.com — extreme minimalism

### Common patterns to consider
- Hero with personality
- Project cards with hover effects
- Smooth scroll
- Custom cursors (use sparingly)
- Section transitions
- Theme switching

### Anti-patterns to avoid
- Generic "Hi, I'm a developer" without specifics
- Empty projects section
- "Coming soon" everywhere
- Long bio without TL;DR
- Music auto-play (yikes)
- Cookies banner that doesn't need one

---

## 11. SEO Strategy

### On-page SEO
- Unique `<title>` per page
- Meta description (155 chars)
- H1-H6 hierarchy
- Alt text on images
- Semantic HTML

### Technical SEO
- `sitemap.xml`
- `robots.txt`
- Open Graph + Twitter Cards
- Schema.org Person markup
- Canonical URLs

### Performance SEO
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- Mobile-friendly

### Content SEO
- Target: "[your name] developer", "[your name] [city]"
- Specific project keywords ("Next.js trading journal app")
- Long-tail in blog posts (eventually)

### Track
- Google Search Console (free)
- Vercel Analytics (free)
- Plausible (paid, privacy-respecting)

---

## 12. Performance Budget

```
Target:
- HTML: < 50 KB
- CSS: < 20 KB
- JS: < 100 KB (first load)
- Images: < 200 KB (per image)
- Total page: < 500 KB
- LCP: < 1.5s on 4G
- Lighthouse: 100/100/100/100
```

How to achieve:
- Static export where possible
- Optimize images (WebP, responsive)
- Lazy load below-the-fold
- Minimize JS (no large libraries)
- Tree-shake aggressively
- Preload critical fonts

---

## 13. Definition of Done

- [ ] Live at custom domain (HTTPS)
- [ ] Lighthouse: Performance 95+, A11y 100, Best Practices 100, SEO 100
- [ ] Cross-browser tested (Chrome, Firefox, Safari, mobile)
- [ ] Accessible (keyboard nav, screen reader)
- [ ] Dark mode working
- [ ] All projects have detail pages with content
- [ ] About page tells story
- [ ] Contact method clear
- [ ] Social meta tags (test with linkedin.com/post-inspector)
- [ ] Google Search Console submitted
- [ ] LinkedIn profile updated with link
- [ ] README on this repo (set up your own portfolio repo)

---

## 14. Maintenance Plan

### After launch:
- **Monthly:** check broken links, update featured projects
- **Quarterly:** refresh "currently building" section
- **Annually:** redesign / restructure if needed

### Add new project:
1. Write project data (JSON or MDX)
2. Add screenshots
3. Test page
4. Deploy
5. Update GitHub profile / LinkedIn

### Blog cadence (if Phase 6):
- Aim for 1 post per major milestone
- Topics:
  - "Building [project]: what I learned"
  - "Why I chose [tech] for [project]"
  - "Solving [specific problem] in [tech]"
- Don't force schedule — quality > frequency

---

## 15. Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Domain | $10-15/year | Namecheap, Cloudflare |
| Vercel hosting | Free | Hobby tier sufficient |
| Email service | Free-$10/mo | Resend free tier 3000/mo |
| Analytics | Free | Vercel Analytics or Plausible $9/mo |
| Total | $10-130/year | Most people stay free |

---

## 16. Success Metrics

### Vanity (look at but don't obsess)
- Unique visitors per month
- Time on site
- Bounce rate

### Real (track these)
- Recruiter inquiries
- LinkedIn connection requests after applications
- Feedback in interviews ("I saw your portfolio")
- Conversion: visitor → contact

### Quality signals (qualitative)
- Lighthouse scores
- Accessibility report
- Feedback from dev friends
- "Looks professional" reactions

---

## 🎯 Timing in your roadmap

```
Sprint 4 jump-off:
  Trading Journal deployed ✓
  Have 1 project to show

Portfolio site Sprint A (1 week):
  Setup + homepage + 1 project page

[Working on Portfolio Tracker Sprint 5-6]

Portfolio site Sprint B (1 week):
  Add Portfolio Tracker to site
  Improve design

[Working on Price Alert Sprint 8-9]

Portfolio site Sprint C (1 week):
  Polish + accessibility audit
  Launch publicly

Total: ~3 weeks spread across 2-3 months
```

**Don't:**
- Build portfolio before having projects to show
- Spend more than 3 weeks on initial version
- Endless redesigns

**Do:**
- Iterate as new projects ship
- Treat as living document
- Add a blog when you have something to say

---

## 📚 Resources

- [Vercel templates](https://vercel.com/templates) — portfolio starters
- [Brittany Chiang's portfolio source](https://github.com/bchiang7/v4)
- [GitHub topics: portfolio-website](https://github.com/topics/portfolio-website)
- [Awesome Dev Portfolios](https://github.com/emmabostian/developer-portfolios)
