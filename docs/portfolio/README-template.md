# 📦 Project README Template

> Copy this template สำหรับ README ของทุก project
> ปรับให้เหมาะกับ project นั้นๆ

---

```markdown
# [Project Name]

> [One-line tagline — what problem this solves]

[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://your-url.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![Screenshot or GIF demo](docs/demo.gif)

## ✨ Features

- 🔐 **Authentication** — Secure login with [Auth.js v5 / NextAuth]
- 📊 **[Feature 1]** — [Brief value description]
- 💾 **[Feature 2]** — [Brief value description]
- ☁️ **Cloud-deployed** — Production on Vercel + Neon

## 🎯 Live Demo

**Try it:** [https://your-url.vercel.app](https://your-url.vercel.app)

**Demo account:**
- Email: `demo@example.com`
- Password: `demo123`

> Or sign up with your own email — no email verification required for demo.

## 🛠️ Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| **Framework** | Next.js 16 (App Router) | Modern React with Server Components |
| **Language** | TypeScript (strict) | Type safety end-to-end |
| **Database** | PostgreSQL (Neon) | Relational + ACID + free tier |
| **ORM** | Prisma 7 | Type-safe queries + migrations |
| **Auth** | Auth.js v5 | Production-grade with JWT |
| **Validation** | Zod | Runtime type safety |
| **UI** | shadcn/ui + Tailwind v4 | Accessible + customizable |
| **Charts** | Recharts | React-native composable charts |
| **Deploy** | Vercel + Neon | Free tier, auto-deploy |

## 📐 Architecture

```
┌─────────────────────────────────────────┐
│  Browser (Next.js client components)   │
└─────────────────┬───────────────────────┘
                  │ HTTPS
┌─────────────────▼───────────────────────┐
│  Vercel Edge / Serverless Functions     │
│  - Next.js Server Components           │
│  - API Routes / Server Actions          │
│  - Auth.js middleware                   │
└─────────────────┬───────────────────────┘
                  │ Postgres protocol
┌─────────────────▼───────────────────────┐
│  Neon (Postgres in Singapore)           │
│  - Application tables                   │
│  - Auth.js session storage              │
└─────────────────────────────────────────┘
```

## 🎓 What I Learned

**Technical:**
- [Specific concept 1 — e.g., "Server Components vs Client Components"]
- [Concept 2 — e.g., "Database migrations as immutable history"]
- [Concept 3 — e.g., "N+1 queries and how to avoid them"]

**Architecture:**
- [Decision 1 — e.g., "Chose JWT over Session for stateless deployment"]
- [Decision 2 — e.g., "Server-side P&L calculation for data integrity"]

**Soft skills:**
- [E.g., "Working incrementally with feature branches and conventional commits"]
- [E.g., "Writing decision logs to track architectural reasoning"]

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- npm / pnpm
- Postgres (local via Docker OR Neon free tier)

### Setup

```bash
# 1. Clone
git clone https://github.com/[your-username]/[project].git
cd [project]

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and AUTH_SECRET

# 4. Setup database
npx prisma migrate dev

# 5. (Optional) Seed test data
npm run seed

# 6. Start dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Postgres connection string |
| `AUTH_SECRET` | Yes | Auth.js JWT signing secret (generate: `openssl rand -base64 32`) |
| `[OTHER]` | No | [Description] |

## 🧪 Testing

```bash
# Unit tests (business logic)
npm run test

# Integration tests (API + DB)
npm run test:integration

# E2E tests (full user flows)
npm run test:e2e
```

## 📚 Project Structure

```
project/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group (login, register)
│   ├── (dashboard)/       # Protected routes
│   ├── api/               # API endpoints
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utilities + Prisma client
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Versioned migrations
├── docs/
│   ├── architecture.md    # System design
│   └── decisions/         # Architecture Decision Records (ADR)
└── __tests__/             # Test files
```

## 🎯 Decision Log

Major architectural choices and reasoning:

- **[ADR-001: Chose JWT over Session](docs/decisions/001-jwt-strategy.md)** — stateless deployment
- **[ADR-002: Server-side P&L calculation](docs/decisions/002-pnl-calculation.md)** — data integrity
- **[ADR-003: ...]**

## 🚧 What I'd Do Differently

Honest reflection on tradeoffs and future improvements:

- **Float vs Decimal for prices** — used Float for simplicity, would migrate to Decimal for fintech production
- **No 2FA** — out of scope, would add for production
- **DB-backed cache instead of Redis** — sufficient for scale, would migrate to Redis if exceeds 1000 users
- **[More items...]**

## 📊 Performance

- Time to interactive: [X]ms (Lighthouse)
- API p95 latency: [X]ms
- Database query optimization: indexed on [columns]

## 🔒 Security

- Password hashing: bcrypt cost 12
- Session: JWT in HttpOnly cookie + SameSite=Strict
- All API routes: authenticated + userId-scoped queries
- Input validation: Zod schemas
- Secrets: env vars only, never committed
- See [docs/security.md](docs/security.md) for full security model

## 🎨 Screenshots

![Dashboard](docs/images/dashboard.png)
*Dashboard view showing key metrics*

![Form](docs/images/form.png)
*Trade entry form with validation*

## 📈 Roadmap

Future enhancements I'd consider:

- [ ] 2FA support
- [ ] Mobile app (React Native)
- [ ] Real-time price feeds (WebSocket)
- [ ] Export to CSV/PDF
- [ ] Multi-currency support

## 📝 License

MIT © [Your Name]

## 🙏 Acknowledgments

- Built as part of fullstack learning journey ([learning log](https://github.com/[you]/learning-journey))
- Inspired by [reference project / problem]
- Special thanks to [community / tutorial / mentor]

---

**Connect:** [LinkedIn](#) · [Twitter](#) · [Portfolio](#)
```

---

## 💡 Tips for filling this template

### 1. The pitch (top of README)
- One-line tagline is critical — recruiters scan
- Demo link visible immediately
- Screenshot above the fold

### 2. Tech stack table
- "Why" column = senior signal
- Don't just list, justify

### 3. "What I Learned" section
- THIS is what recruiters want to see
- Be specific (not "I learned React")
- Concrete concepts + decisions

### 4. Architecture diagram
- ASCII OK for simple stacks
- Use Excalidraw / draw.io for complex
- Show data flow

### 5. Decision log
- Link to ADRs
- Shows engineering maturity
- Common interview talking point

### 6. "What I'd Do Differently"
- Self-awareness = senior signal
- Honest about tradeoffs
- Shows you can grow

### 7. Demo account
- Critical for portfolio
- Don't make recruiter sign up

### 8. Screenshots
- Actual product screenshots
- GIFs for interactive features
- Show off the work
