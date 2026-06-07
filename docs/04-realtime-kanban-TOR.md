# TOR — Realtime Kanban Board (โปรเจกต์ที่ 4 · Tier 2)

> Tier 2: ความซับซ้อนระดับงานจริง · ความยาก: ⭐⭐⭐⭐
> ทำหลังจบ Tier 1 (Trading Journal, Portfolio, Price Alert) แล้ว
>
> ⚠️ FUTURE-PROOF NOTE: ตรวจสอบเวอร์ชัน WebSocket library และ best practice ปัจจุบันก่อนเริ่ม
> วิธีทำ realtime อาจเปลี่ยน (เช่น มี framework ใหม่) — ยึด concept ไม่ยึดเครื่องมือ

---

## 1. ภาพรวมโปรเจกต์

**ชื่อ:** Realtime Kanban Board — บอร์ดงานแบบ Trello ที่ sync หลาย client แบบ realtime

**ปัญหาที่แก้:** ทีมต้องการบอร์ดที่เห็นการเปลี่ยนแปลงพร้อมกันทันที โดยไม่ต้อง refresh

**concept ใหม่ที่ฝึก (ต่างจาก Tier 1):**
- **WebSocket / realtime จริง** — ข้อมูลวิ่งเข้ามาเองทันที (ต่างจาก polling ใน Price Alert)
- **Optimistic update** — อัปเดต UI ก่อนที่ server จะตอบ แล้ว rollback ถ้าพลาด
- **Conflict resolution** — เมื่อหลายคนแก้พร้อมกันจะจัดการยังไง
- **State sync** — ทำให้ทุก client เห็นข้อมูลตรงกัน

---

## 2. ขอบเขตงาน

### In Scope
- ระบบสมาชิก (reuse pattern จาก Tier 1)
- สร้าง board, column, card
- ลาก card ข้าม column (drag and drop)
- การเปลี่ยนแปลงทุกอย่าง sync ไปทุก client ที่เปิดบอร์ดเดียวกันแบบ realtime
- แสดงว่าใครออนไลน์อยู่ในบอร์ด (presence)

### Out of Scope
- comment / attachment ใน card (เพิ่มทีหลังได้)
- permission ละเอียด (เริ่มจากใครเข้าถึง board ได้ก็แก้ได้)
- มือถือ native

---

## 3. User Stories และ Acceptance Criteria

### US-1: จัดการ board/column/card
**Acceptance Criteria:**
- [ ] สร้าง/แก้/ลบ board ได้
- [ ] สร้าง/แก้/ลบ column ใน board
- [ ] สร้าง/แก้/ลบ card ใน column
- [ ] เรียงลำดับ card ใน column ได้

### US-2: Realtime sync (หัวใจ)
**Acceptance Criteria:**
- [ ] เปิดบอร์ดเดียวกัน 2 หน้าจอ — แก้ที่หนึ่ง อีกหน้าเห็นทันทีโดยไม่ refresh
- [ ] ลาก card ที่ client A → client B เห็น card ขยับตาม
- [ ] เมื่อมีคนเพิ่ม/ลบ card ทุก client อัปเดต
- [ ] ถ้า connection หลุด แล้วต่อใหม่ ข้อมูลต้อง sync กลับมาตรง

### US-3: Optimistic update
**Acceptance Criteria:**
- [ ] ลาก card แล้ว UI ขยับทันที (ไม่รอ server)
- [ ] ถ้า server ปฏิเสธ (เช่น card ถูกลบไปแล้ว) UI ต้อง rollback

### US-4: Presence
**Acceptance Criteria:**
- [ ] เห็น avatar ของคนที่กำลังเปิดบอร์ดเดียวกัน
- [ ] คนออก avatar หายไป

---

## 4. Data Model

```
User                 // reuse จาก Tier 1

Board
  id          uuid (PK)
  ownerId     uuid (FK -> User)
  title       string
  createdAt   datetime

Column
  id          uuid (PK)
  boardId     uuid (FK -> Board)
  title       string
  position    int          // ลำดับ column

Card
  id          uuid (PK)
  columnId    uuid (FK -> Column)
  title       string
  description text (nullable)
  position    int          // ลำดับใน column
  updatedAt   datetime     // ใช้ตรวจ conflict
```

**โจทย์ให้คิดเอง:** การเก็บ `position` เป็น int ทำให้ตอนลาก card แทรกกลางต้อง re-index ทั้ง column ลองหาวิธีอื่น (เช่น fractional indexing / lexicographic ordering) แล้วอธิบายว่าทำไมดีกว่าใน README

---

## 5. Architecture & WebSocket Flow

```
Client A ──┐
Client B ──┼──> WebSocket Server <──> Database
Client C ──┘         │
                     └─ broadcast การเปลี่ยนแปลงไปทุก client ในห้อง (board) เดียวกัน
```

**Flow เมื่อ client ลาก card:**
1. Client A อัปเดต UI ทันที (optimistic)
2. Client A ส่ง event ผ่าน WebSocket ไป server
3. Server validate + บันทึก database
4. Server broadcast event ไปทุก client ในห้องบอร์ดนั้น (รวม A เพื่อ confirm)
5. ถ้า server reject → ส่ง error กลับ A → A rollback UI

**ตัวเลือกเทคโนโลยี (⚠️ ตรวจสถานะปัจจุบันก่อนเลือก):**
- Socket.IO หรือ native WebSocket
- หรือ managed service เช่น Pusher, Ably (ลด infra ที่ต้องดูแล)
- Next.js อาจต้องแยก WebSocket server ต่างหาก (เพราะ serverless ไม่เหมาะกับ persistent connection) — ตรวจ best practice ปัจจุบัน

---

## 6. แผนการทำงานแบบ Phase

**Phase 0 — Setup + board/column/card CRUD (ปกติ ไม่ realtime ก่อน)**
ทำให้ใช้งานได้แบบ refresh เอาเองก่อน เข้าใจ data model
*เป้าหมายเข้าใจ:* ทำไมต้องมี position, การ order ข้อมูล

**Phase 1 — เพิ่ม WebSocket layer** ← หัวใจ
ต่อ WebSocket, ทำ room ตาม board, broadcast การเปลี่ยนแปลง
*เป้าหมายเข้าใจ:* WebSocket ต่างจาก HTTP ยังไง, room/channel คืออะไร, ทำไม serverless ไม่เหมาะ

**Phase 2 — Drag and drop + optimistic update**
ทำ drag and drop (เช่น dnd-kit), optimistic update + rollback
*เป้าหมายเข้าใจ:* optimistic update ดียังไง เสี่ยงยังไง

**Phase 3 — Conflict handling + reconnect**
จัดการเมื่อแก้ชนกัน, sync กลับเมื่อ reconnect
*เป้าหมายเข้าใจ:* ทำไม distributed state ถึงยาก

**Phase 4 — Presence + Deploy + README**

---

## 7. Definition of Done
- [ ] 2 หน้าจอ sync กันได้จริงแบบ realtime
- [ ] optimistic update + rollback ทำงาน
- [ ] reconnect แล้วข้อมูลตรง
- [ ] live demo (เปิด 2 แท็บโชว์ได้)
- [ ] README อธิบาย architecture realtime + decision log (โดยเฉพาะเรื่อง position/ordering)

**คุณค่าต่อ portfolio:** นี่คือ project ที่ "โชว์ได้สวยที่สุด" — เปิด 2 แท็บแล้วลากของให้ดูในสัมภาษณ์ ประทับใจทันที และ WebSocket เป็น concept ที่ frontend dev ส่วนใหญ่ไม่เคยทำฝั่ง server
