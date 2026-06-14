# 🎯 Strategy Folder

> Long-term thinking documents สำหรับ guide การตัดสินใจตลอด roadmap

---

## 📂 ไฟล์ในนี้

| ไฟล์ | จุดประสงค์ | ทบทวนเมื่อไหร่ |
|------|-----------|---------------|
| [roadmap-analysis.md](./roadmap-analysis.md) | Risk map, hidden complexity, timeline reality, cross-project synergy | จบทุก 2 sprint |

---

## 🔄 วิธีใช้

**ทุกจบ 2 sprint:**
1. เปิด roadmap-analysis.md
2. ดู risk ที่ผมทำนายไว้ — เกิดจริงไหม?
3. ดู recommendation — ทำตามหรือไม่? เพราะอะไร?
4. อัปเดต section ที่ outdated

**ก่อนเริ่ม project ใหม่:**
1. อ่าน per-sprint reality check ของ project นั้น
2. เตรียม pre-reading ตาม "skills needed"
3. plan buffer time ตาม risk

**ทุกจบ project:**
1. Mock interview กับ Claude (ใช้ interview/[project].md)
2. อัปเดต `decision-log` ใน project README
3. Reflect: tracking timeline ไหม? ตรงไหน slip?

---

## 📊 Strategic Cadence

```
จบ Sprint 2     → quick review roadmap-analysis
จบ Sprint 4     → 🎯 PROJECT 1 RETRO + adjust plan
จบ Sprint 7     → 🎯 PROJECT 2 RETRO  
จบ Sprint 10    → 🎯 PROJECT 3 RETRO + decide Tier 2 priority
จบ Sprint 13    → 🎯 PROJECT 4 RETRO
จบ Sprint 15    → 🎯 PROJECT 5 RETRO + decide Tier 3 target
จบ Tier 3       → 🎯 BIG RETRO + start job applications
```

---

## 💡 Decision Records ที่ควรจดเพิ่ม

สร้าง `docs/strategy/decisions/` ถ้าอยาก formal:

```
docs/strategy/decisions/
├── 001-chose-prisma-7.md
├── 002-chose-neon-over-docker.md
├── 003-chose-jwt-over-session.md
└── ...
```

Format: ADR (Architecture Decision Record)
- Context: ทำไมต้องตัดสินใจ
- Decision: ตัดสินใจอะไร
- Consequences: ผลที่ตามมา (good + bad)
- Status: Accepted / Superseded / Deprecated
