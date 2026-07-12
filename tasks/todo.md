# TODO — Sprint 1, Phase 1: Authentication

> Task tracker สำหรับระบบ auth ตาม `plans/plan.md`
> โหมด: LEARN — Claude ชี้จุด + อธิบาย concept, ผู้ใช้เขียนโค้ดเอง
>
> **สัญลักษณ์:** `[ ]` ยังไม่ทำ · `[/]` กำลังทำ · `[x]` เสร็จแล้ว
>
> **หลักการ:** commit หลังจบ block ย่อยแต่ละอัน (ไม่ใช่รอจบทั้ง sprint) — ฝึกวินัยการ commit เป็น atomic unit

---

## 🧹 Block 0 — เคลียร์บ้านก่อนเริ่ม (~15 นาที) ✅

- [x] ตรวจ `.gitignore` มี `.env*` และ `.env.local` ครบไหม — pattern `.env*` + `!.env.example` ครอบคลุมแล้ว, `git ls-files` ยืนยัน `.env` ไม่ถูก track
- [x] จัดการ `test.js` ที่อยู่ root — ไม่มีไฟล์นี้แล้ว (ไม่ต้องทำอะไร)
- [x] push commit ค้างขึ้น `origin/main` — push 3 auth commits (`504cd3d`, `a14f288`, `6cd97fd`) สำเร็จ

**เรียนรู้:** ทำไม `.env` ห้าม commit? เกิดอะไรถ้าหลุดขึ้น public repo? (คำใบ้: `git filter-branch`, secret scanner, cost of key rotation)

---

## 📦 Block 1 — Install & Config พื้นฐาน (~30 นาที)

- [x] ติดตั้ง dependency:
  - `next-auth@beta` (Auth.js v5) ✓
  - `bcryptjs` และ `@types/bcryptjs` ✓
  - `zod` ✓
- [ ] Generate `AUTH_SECRET` ด้วยคำสั่ง `npx auth secret` → ตรวจว่ามันเขียนลง `.env.local` แล้ว (ยังต้อง verify)
- [x] สร้าง `.env.example` (template ไม่มีค่าจริง)
- [x] เพิ่ม `DATABASE_URL` ใน `.env.example`

**เรียนรู้:** ทำไมต้องมี `.env.example`? มันต่างจาก `.env` ยังไง? (คำใบ้: onboarding developer ใหม่, CI/CD)

---

## ⚙️ Block 2 — Auth.js Skeleton (~30 นาที)

- [x] สร้าง `auth.ts` ที่ root — export `{ handlers, signIn, signOut, auth }` จาก `NextAuth()`
- [x] สร้าง `app/api/auth/[...nextauth]/route.ts` — export `{ GET, POST }` จาก `handlers`
- [x] ยัง**ไม่ต้อง**ใส่ providers ตอนนี้ ปล่อยว่างไว้ก่อน (เดี๋ยว block 4 ค่อยเติม Credentials)
- [ ] ลอง `npm run dev` ให้ผ่าน (build ต้องไม่พัง) ← ยังไม่ได้ verify

**เรียนรู้ที่ต้องเข้าใจก่อนไปต่อ:**
- `[...nextauth]` (catch-all route) คืออะไร? ทำไม Auth.js ต้องใช้?
- `auth()` function ทำอะไรได้บ้าง? เรียกจากที่ไหนได้?

---

## 🔐 Block 3 — Register API (เขียนเอง เพราะ Auth.js ไม่ทำให้) (~1.5 ชม.)

> 🟡 **สถานะปัจจุบัน:** `lib/prisma.ts` (Neon adapter + Prisma client singleton) เตรียมไว้แล้ว
> แต่ยัง untracked + `@prisma/adapter-neon` ใน `package.json` ก็ยังไม่ commit → commit เก็บให้เรียบร้อยก่อนเดินหน้าต่อ

- [ ] commit `lib/prisma.ts` + `@prisma/adapter-neon` (block 3 preflight)
- [ ] สร้าง Zod schema สำหรับ register: `email` (format email), `password` (min 8)
- [ ] สร้าง helper `lib/hash.ts` — 2 function: `hashPassword(plain)` และ `verifyPassword(plain, hash)` ด้วย bcryptjs cost 12
- [ ] สร้าง route handler `app/api/auth/register/route.ts`:
  - รับ POST body
  - Zod parse (ถ้าล้ม return 400 พร้อม error ที่อ่านเข้าใจได้)
  - เช็ค email ซ้ำใน DB
  - hash password
  - `prisma.user.create({...})`
  - return success (⚠️ ห้าม return password field กลับ)
- [ ] test ด้วย curl หรือ Postman: ลอง register user ทดสอบ 1 คน แล้วเปิด DB (Prisma Studio: `npx prisma studio`) ยืนยันว่า password ในตารางเป็น **hash** ไม่ใช่ plaintext

**⚠️ Security checkpoint — ก่อนไปต่อต้องผ่าน:**
- [ ] password ใน DB เป็น hash ที่ขึ้นต้นด้วย `$2a$` หรือ `$2b$` (bcrypt signature)
- [ ] response ที่ return กลับ**ไม่มี** field password (แม้จะ hash แล้วก็ไม่ส่งกลับ)
- [ ] ลอง register email ซ้ำ → ต้อง reject พร้อม error ที่เหมาะสม

**เรียนรู้:** ทำไม cost = 12 ไม่ใช่ 10 หรือ 14? (คำใบ้: OWASP guideline, benchmark server ตัวเอง)

---

## 🚪 Block 4 — Login / Logout ด้วย Auth.js Credentials (~1.5 ชม.)

- [ ] สร้าง Zod schema สำหรับ login
- [ ] ใน `auth.ts` เพิ่ม `Credentials` provider พร้อม `authorize()` function:
  - Zod parse credentials
  - หา user ใน DB ตาม email
  - **ถ้าไม่เจอ**: return `null` (Auth.js จะแสดง error generic)
  - ถ้าเจอ: `verifyPassword()` เทียบ hash
  - **ถ้าไม่ตรง**: return `null` (error message เหมือนกับกรณี email ไม่มี — user enumeration protection)
  - ถ้าตรง: return user object (⚠️ ห้ามใส่ field password)
- [ ] ตั้ง session strategy = `"jwt"` (default อยู่แล้ว แต่เขียน explicit ให้ชัด)
- [ ] ทดสอบ login ผ่าน Auth.js signin page default (`/api/auth/signin`)

**⚠️ Security checkpoint:**
- [ ] error message เหมือนกันเป๊ะระหว่าง "email ไม่มี" กับ "password ผิด"
- [ ] เปิด DevTools > Application > Cookies ดู session cookie มี `HttpOnly` flag ไหม (ต้องมี)

**เรียนรู้:**
- `authorize()` return `null` vs throw error ต่างกันยังไงในสายตา Auth.js?
- JWT ที่ Auth.js สร้าง เก็บอะไรไว้บ้าง? (decode ที่ jwt.io — แต่**อย่า** paste production JWT!)

---

## 🖼️ Block 5 — UI Pages: Register + Login (~1.5 ชม.)

> โหมด LEARN: หน้านี้แค่ทำง่ายๆ ก่อน สวยทีหลัง — TailwindCSS + shadcn/ui จะจัดใน sprint หลัง

- [ ] สร้างหน้า `app/(auth)/register/page.tsx` — form email + password + confirm password
  - client validate เบื้องต้น (empty, format)
  - POST ไป `/api/auth/register`
  - สำเร็จ → เรียก `signIn("credentials", {...})` ให้ user login อัตโนมัติ
  - ผิด → แสดง error message
- [ ] สร้างหน้า `app/(auth)/login/page.tsx` — form email + password
  - เรียก `signIn("credentials", { email, password, redirectTo: "/dashboard" })`
  - จัดการ error กลับจาก Auth.js
- [ ] สร้างปุ่ม/action Logout ที่เรียก `signOut()`

**เรียนรู้:** ทำไม client validate ก็ยังต้อง server validate? — (ทวน concept ที่ผ่านมาแล้ว)

---

## 🛡️ Block 6 — Protected Routes (Next.js 16 pattern) (~1 ชม.)

- [ ] สร้าง `proxy.ts` ที่ root (⚠️ Next.js 16 = `proxy.ts` ไม่ใช่ `middleware.ts`)
  - `export { auth as proxy } from "@/auth"`
  - หรือใช้ pattern advanced ถ้าอยากลอง (redirect ไป `/login` ถ้าไม่มี session)
- [ ] สร้าง helper `lib/session.ts` — function `getCurrentUser()` ที่เรียก `auth()` แล้วคืน user (หรือ null)
- [ ] สร้างหน้า `app/dashboard/page.tsx` (server component) — เรียก `getCurrentUser()` ต้นไฟล์:
  - ถ้าไม่มี user → `redirect("/login")`
  - ถ้ามี → แสดง "Welcome {name}" + ปุ่ม logout

**เรียนรู้:**
- ทำไม `proxy.ts` ไม่ควรมี logic หนัก? (memory ที่ Vercel Edge จำกัด)
- Server Component เรียก `auth()` ได้ตรงๆ ทำไม? (มัน run ที่ server ทุกครั้ง)

---

## 🧪 Block 7 — Manual Test ครบ flow (~30 นาที)

**ไล่ทดสอบทีละข้อ ผ่านทั้งหมดถึงจะปิด Sprint 1 ได้:**

- [ ] Register user ใหม่ 2 คน (user A, user B)
- [ ] ตรวจ DB: password ทั้ง 2 คนเป็น hash (ไม่ใช่ plaintext), hash ต่างกัน (แม้ password เดียวกัน → salt ต่าง)
- [ ] Logout แล้วพยายามเข้า `/dashboard` → ต้อง redirect ไป `/login`
- [ ] Login user A → เห็น dashboard ของ A
- [ ] เปลี่ยน browser (หรือ incognito) → login user B → เห็น dashboard ของ B (ยังไม่มี trade แต่ session แยกกัน)
- [ ] ลอง login ด้วย password ผิด → error "invalid credentials"
- [ ] ลอง login ด้วย email ไม่มี → error message **เหมือนกันเป๊ะ**
- [ ] Cookie มี `HttpOnly`, `SameSite`, และ `Secure` (บน production/HTTPS)

---

## ✅ Block 8 — LEARN Checkpoint (สำคัญ ห้ามข้าม)

> ก่อนปิด Sprint 1 ต้องอธิบาย 5 ข้อนี้กลับมาให้ Claude ฟัง (ในภาษาตัวเอง ไม่ต้อง google):

- [ ] **hash vs encrypt** — และทำไม password ต้อง hash
- [ ] **bcrypt cost** คืออะไร เพิ่มแล้วได้/เสียอะไร
- [ ] **session-based vs JWT** — Auth.js default อะไร ทำไม + ตอบได้ว่า logout ทุกอุปกรณ์แบบไหนง่าย
- [ ] **cookie flags** (`httpOnly`, `secure`, `sameSite`) — แต่ละอันกัน attack แบบไหน
- [ ] **ทำไมต้อง validate ที่ server** แม้ client validate แล้ว

**ถ้าอธิบายไม่ได้ = ยังไม่จบ Sprint 1** ต่อให้โค้ดรันได้

---

## 📝 Block 9 — ปิด Sprint (~30 นาที)

- [ ] Commit final: message ชัดเจน (แนะนำ: split เป็นหลาย commit ตาม block ที่ผ่านมา ไม่ใช่ก้อนเดียว)
- [ ] อัปเดต `docs/PROGRESS.md` — Sprint 1 checkpoint (%, ชม.จริง, ติดอะไร, concept ที่ยังไม่แน่น)
- [ ] เขียน **decision log** ใน README หรือ `docs/decisions.md`:
  - ทำไมเลือก bcryptjs (ไม่ใช่ argon2)
  - ทำไมเลือก JWT session strategy
  - แผน migrate ในโปรเจกต์ถัดไป
- [ ] push ขึ้น GitHub

---

## 📊 เวลารวมประมาณการ

| Block | เวลา |
|---|---|
| 0. Cleanup | 15 นาที |
| 1. Install/Config | 30 นาที |
| 2. Auth.js skeleton | 30 นาที |
| 3. Register API | 1.5 ชม. |
| 4. Login/Logout | 1.5 ชม. |
| 5. UI Pages | 1.5 ชม. |
| 6. Protected Routes | 1 ชม. |
| 7. Manual Test | 30 นาที |
| 8. LEARN Checkpoint | 30 นาที |
| 9. ปิด Sprint | 30 นาที |
| **รวม** | **~8 ชม.** |

ที่เวลา 1-2 ชม./วัน = **~5-8 วันทำการ** (~1-1.5 สัปดาห์)

---

## 🚨 ถ้าติดจริงๆ

- ยังไม่ต้องรีบไปข้อถัดไป — LEARN mode คือเข้าใจ ไม่ใช่เร็ว
- โพสต์ error ให้ Claude ดู + สิ่งที่ลองไปแล้ว
- เปิด `plans/plan.md` section ที่เกี่ยวข้อง อ่านซ้ำ
- ถ้าติดเกิน 30 นาที → ขอ hint ทีละขั้น (ไม่ใช่ขอเฉลย)
