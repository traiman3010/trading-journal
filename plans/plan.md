# Plan — Authentication (Sprint 1, Phase 1)

> Blueprint สำหรับระบบ auth ของ Trading Journal
> อ้างอิง TOR: `docs/01-trading-journal-TOR.md` (US-1, Phase 1)
> โหมดตอนร่าง: LEARN

---

## 1. Goal — เราจะทำอะไร ทำไม

**ทำอะไร:** สร้างระบบสมาชิก register / login / logout และปิดกั้น route ที่ต้อง login

**ทำไมงานนี้สำคัญ:**
- เป็น "ประตูข้อมูล" ของทั้งแอป — ถ้า auth พลาด ผู้ใช้ A จะเห็นข้อมูลผู้ใช้ B (data leak)
- เป็นก้อน backend แรกที่คุณต้องเข้าใจให้ลึก เพราะทุกฟีเจอร์หลังจากนี้ (Trade CRUD, Stats) พึ่ง `userId` จาก session ทั้งหมด
- interview บริษัทจริงถามเรื่องนี้บ่อยที่สุดจากทั้งโปรเจกต์: "อธิบาย flow login หน่อย", "session กับ JWT ต่างกันยังไง", "hash กับ encrypt ต่างกันยังไง"

**เชื่อมโยงกับ frontend background ที่มี:**
- คุณเคยทำ form login แล้ว — ฝั่ง client แค่ POST ไป endpoint แล้วเก็บ token/redirect
- ตอนนี้จะไปดูอีกฝั่ง: server ทำอะไรตอนรับ credentials, เก็บ password ยังไงให้ปลอดภัย, session ทำงานยังไง

---

## 2. Architecture / Flow

### 2.1 Component ที่เกี่ยวข้อง

```
[Browser] ── form submit ──▶ [Next.js Route Handler] ──▶ [Auth.js] ──▶ [Prisma] ──▶ [Postgres]
                                                              │
                                                              └──▶ [Session Store] (cookie หรือ DB)
```

### 2.2 Flow: Register

```
1. user กรอก email + password ที่หน้า /register
2. client validate เบื้องต้น (empty, format email)
3. POST /api/auth/register { email, password }
4. server:
   a. validate ด้วย Zod อีกรอบ (ห้ามเชื่อ client)
   b. เช็คว่า email ซ้ำไหม
   c. hash password ด้วย bcrypt (หรือ argon2)
   d. insert User ลง DB (เก็บ hash เท่านั้น ไม่เก็บ password ดิบ)
   e. สร้าง session แล้ว set cookie
5. redirect ไป /dashboard
```

### 2.3 Flow: Login

```
1. user กรอก email + password ที่หน้า /login
2. POST /api/auth/callback/credentials (endpoint ของ Auth.js)
3. server:
   a. หา User ตาม email
   b. ถ้าไม่เจอ → error "invalid credentials" (อย่าบอกว่า email ไม่มี — leak ข้อมูล)
   c. bcrypt.compare(input, storedHash)
   d. ถ้าตรง → สร้าง session, set cookie
   e. ถ้าไม่ตรง → error "invalid credentials" (ข้อความเดียวกับข้อ b เสมอ)
4. redirect ไป /dashboard
```

### 2.4 Flow: Session check ในทุก request

```
[request มาถึง protected route]
   │
   ▼
[middleware หรือ server-side check]
   │
   ├── มี session cookie ที่ valid? ──── yes ──▶ ให้ผ่าน + แนบ user ไปกับ request
   │                                              (ทุก DB query หลังจากนี้ scope ด้วย user.id)
   └── no ──▶ redirect ไป /login
```

### 2.5 Flow: Logout

```
1. user กด logout
2. POST /api/auth/signout
3. server ทำลาย session (ลบ cookie, ลบ row จาก session table ถ้าใช้)
4. redirect ไป /login
```

---

## 3. Security & Constraints (ต้องผ่านทุกข้อ)

### 3.1 ห้ามพลาดเด็ดขาด
- [ ] **ห้ามเก็บ password ดิบใน DB** — ต้อง hash ก่อนเสมอ (bcrypt cost ≥ 10 หรือ argon2)
- [ ] **ห้ามส่ง password กลับใน response** ไม่ว่า endpoint ไหน (ตอน select user ต้อง omit field)
- [ ] **error message ตอน login ผิดต้องเหมือนกัน** ไม่ว่า email ไม่มี หรือ password ผิด → "invalid credentials"
- [ ] **cookie ต้องตั้ง `httpOnly: true`, `secure: true` (prod), `sameSite: 'lax'`** ป้องกัน XSS ขโมย session
- [ ] **secret ทั้งหมด (`NEXTAUTH_SECRET`, `DATABASE_URL`) อยู่ใน `.env` เท่านั้น** — เช็ค `.gitignore` ว่ามี `.env*`

### 3.2 ก่อนเริ่ม trade CRUD ต้องมี
- [ ] helper `getCurrentUser()` ที่เรียกจาก API route ได้ทุกที่
- [ ] ทุก protected endpoint เช็ค session ก่อนทำอะไรทั้งสิ้น
- [ ] **User A query อะไรก็ตาม ต้อง scope ด้วย `where: { userId: currentUser.id }`** เสมอ (จะสำคัญมากใน sprint 2)

### 3.3 Validation (Zod)
- register/login schema: email ต้องเป็น email format, password ยาว ≥ 8 (ตกลงมาตรฐานกับตัวเองแล้วเขียนไว้)
- validate ที่ server เสมอ **แม้ client validate แล้ว** — client bypass ได้ผ่าน curl/Postman

---

## 4. Learning Focus — จบงานนี้ต้องอธิบายอะไรได้บ้าง

โหมด LEARN: ก่อนจบ sprint 1 คุณต้องอธิบาย 5 ข้อนี้กลับมาให้ผมฟังได้ (ถ้าอธิบายไม่ได้ = ยังไม่จบ ต่อให้โค้ดรันได้):

1. **hash กับ encrypt ต่างกันยังไง — และทำไม password ต้อง hash (ไม่ใช่ encrypt)**
   - ใบ้: reverse ได้ไหม
2. **ทำไม bcrypt ถึงมี "cost" หรือ "rounds" — เพิ่มแล้วได้อะไร เสียอะไร**
   - ใบ้: brute force, GPU, ความเร็ว
3. **session-based auth กับ JWT (token-based) ต่างกันยังไง — Auth.js เลือกใช้แบบไหน default และทำไม**
   - ใบ้: server-side state, revoke, scale
4. **cookie ที่เก็บ session ต้องตั้ง flag อะไรบ้าง แต่ละ flag กัน attack แบบไหน**
   - ใบ้: httpOnly (XSS), secure (MITM), sameSite (CSRF)
5. **ทำไมต้อง validate ที่ server แม้ client validate แล้ว**
   - ใบ้: DevTools, curl, ใครก็ตามที่ไม่ผ่าน browser

**จุดเชื่อมกับ frontend:** เหมือน form validation ที่ client — ต่างแค่ client validate เพื่อ UX, server validate เพื่อความปลอดภัย. client validate โกงได้ (แก้ DOM/skip), server validate เป็น source of truth.

---

## 5. Tech decision ที่ต้องยืนยันก่อนเริ่ม (⚠️ ต้องเช็ค)

TOR เขียนตอนต้นปี 2026 — ก่อน implement ผมจะเช็คสิ่งเหล่านี้ให้ update:

- **Auth.js เวอร์ชันปัจจุบัน** — v5 (NextAuth v5) API เปลี่ยนจาก v4 พอสมควร โดยเฉพาะการ config
- **Next.js 16 + App Router pattern** — middleware กับ server-side session check ตอนนี้แนะนำแบบไหน
- **bcrypt vs argon2 vs @node-rs/argon2** — argon2 เป็น winner ของ password hashing competition แต่ bcrypt ยังยอมรับกว้าง เดี๋ยวเทียบกันก่อนเลือก
- **credentials provider** vs **OAuth (Google/GitHub)** — TOR บอก email/password แต่ปัจจุบัน OAuth ง่ายกว่ามาก อาจเสนอทำทั้งคู่หรือเลือกทางเดียว

---

## 6. โจทย์ให้คิดก่อนเริ่มลงมือ (LEARN mode)

**อย่าเพิ่งบอกผมคำตอบทั้งหมด — คิดก่อน แล้วมาคุยกัน:**

1. `hash` กับ `encrypt` ต่างกันยังไง? ถ้า DB โดน dump ออกไป แบบไหนอันตรายกว่ากัน?
2. ถ้าเราเก็บ session ในรูป **cookie ที่มีแค่ session id** vs **JWT ที่บรรจุ user data เต็ม** — แต่ละแบบมีจุดอ่อนตรงไหน? อยากทำ "logout ทุกอุปกรณ์" แบบไหนง่ายกว่า?
3. ทำไม error ตอน login ต้องเหมือนกันไม่ว่า email ไม่มีหรือ password ผิด?

**ให้เขียนคำตอบสั้นๆ ของคุณเองก่อน (ไม่ต้อง google) แล้วโพสต์ให้ผมดู — ผมจะช่วยเติมส่วนที่ยังไม่ครบ**

---

## 7. Task breakdown (จะไปอยู่ใน `/tasks/todo.md`)

หลังจากผ่านโจทย์ข้อ 6 แล้วเราจะแตกเป็น task ย่อย เช่น:

- [ ] เช็ค version + config ปัจจุบันของ Auth.js v5
- [ ] ติดตั้ง dependency (`next-auth`, `bcrypt`/`argon2`, `zod`)
- [ ] เพิ่ม `.env.example` + ตรวจ `.gitignore`
- [ ] สร้าง Zod schema สำหรับ register/login
- [ ] สร้าง API route `/api/auth/register`
- [ ] config Auth.js credentials provider สำหรับ login/logout
- [ ] สร้าง helper `getCurrentUser()` ที่ใช้ใน server component / route handler
- [ ] middleware ป้องกัน protected route
- [ ] หน้า `/register`, `/login` (form UI แบบง่ายก่อน ปรับสวยทีหลัง)
- [ ] test manual: register → logout → login → protected route
- [ ] อธิบาย 5 concept ใน section 4 กลับมาได้

---

## 8. Definition of Done (สำหรับ Phase นี้)

- [ ] register → login → logout → protected route ทำงานครบ flow
- [ ] password ใน DB เป็น hash เท่านั้น (verify ด้วยการเปิด DB ดูจริง)
- [ ] session cookie มี httpOnly + secure + sameSite ครบ
- [ ] ไม่มี secret ใน git history
- [ ] คุณอธิบาย concept ในข้อ 4 กลับมาได้ทุกข้อ
- [ ] commit เป็นก้อนๆ ที่ message อ่านรู้เรื่อง (ไม่ใช่ commit เดียวจบ)
