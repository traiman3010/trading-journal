# TOR — Mini E-commerce Backend (โปรเจกต์ที่ 5 · Tier 2)

> Tier 2: ความซับซ้อนระดับงานจริง · ความยาก: ⭐⭐⭐
> สอน database transaction และ race condition — concept ที่ใกล้งานบริษัทมากที่สุด
>
> ⚠️ FUTURE-PROOF NOTE: concept transaction/ACID ไม่ล้าสมัย แต่ตรวจ syntax ของ Prisma transaction ปัจจุบันก่อนใช้

---

## 1. ภาพรวมโปรเจกต์

**ชื่อ:** Mini E-commerce Backend — ระบบสินค้า + ตะกร้า + คำสั่งซื้อ

**ปัญหาที่แก้:** จำลองระบบ e-commerce ที่ต้องจัดการ stock อย่างถูกต้องเมื่อมีคนซื้อพร้อมกัน

**concept ใหม่ที่ฝึก:**
- **Database transaction** — operation หลายอย่างที่ต้องสำเร็จพร้อมกันหรือ fail พร้อมกัน (atomic)
- **Race condition** — เมื่อหลายคนซื้อของชิ้นสุดท้ายพร้อมกัน จะไม่ขายเกิน
- **Order state machine** — สถานะคำสั่งซื้อ (pending → paid → shipped → completed)
- **การคำนวณราคา** — subtotal, ส่วนลด, รวม

---

## 2. ขอบเขตงาน

### In Scope
- ระบบสมาชิก (reuse)
- จัดการสินค้า (admin): สร้าง/แก้/ลบ + จัดการ stock
- ดูรายการสินค้า (ลูกค้า)
- ตะกร้าสินค้า (เพิ่ม/ลบ/แก้จำนวน)
- สร้างคำสั่งซื้อจากตะกร้า (ตัด stock แบบ atomic)
- ดูประวัติคำสั่งซื้อ + สถานะ

### Out of Scope
- การชำระเงินจริง (จำลองสถานะ paid พอ ไม่ต่อ payment gateway)
- ระบบ shipping จริง
- review/rating

---

## 3. User Stories และ Acceptance Criteria

### US-1: จัดการสินค้า (admin)
**Acceptance Criteria:**
- [ ] สร้าง/แก้/ลบ สินค้า (ชื่อ, ราคา, stock, รูป)
- [ ] เฉพาะ admin ทำได้ (role-based access)

### US-2: ตะกร้าสินค้า
**Acceptance Criteria:**
- [ ] เพิ่มสินค้าลงตะกร้า ระบุจำนวน
- [ ] แก้จำนวน / ลบออกจากตะกร้า
- [ ] เพิ่มได้ไม่เกิน stock ที่มี
- [ ] ตะกร้าผูกกับ user (login แล้วเห็นตะกร้าเดิม)

### US-3: สร้างคำสั่งซื้อ (หัวใจ — transaction)
**Acceptance Criteria:**
- [ ] สร้าง order จากตะกร้า
- [ ] ตัด stock ของทุกสินค้าในคำสั่งซื้อ **แบบ atomic** (ทั้งหมดสำเร็จหรือทั้งหมด fail)
- [ ] ถ้า stock ไม่พอระหว่างสร้าง order → ยกเลิกทั้ง transaction ไม่ตัด stock บางตัว
- [ ] **ป้องกัน race condition:** คน 2 คนซื้อชิ้นสุดท้ายพร้อมกัน ต้องมีแค่คนเดียวที่ได้
- [ ] เคลียร์ตะกร้าหลังสั่งซื้อสำเร็จ
- [ ] บันทึกราคา ณ ตอนซื้อ (ไม่อ้างอิงราคาปัจจุบันที่อาจเปลี่ยน)

### US-4: ดูคำสั่งซื้อ
**Acceptance Criteria:**
- [ ] ดูประวัติคำสั่งซื้อของตัวเอง
- [ ] เห็นสถานะ (pending/paid/shipped/completed)
- [ ] admin เปลี่ยนสถานะ order ได้

---

## 4. Data Model

```
User
  id, email, password, role (enum: CUSTOMER, ADMIN)

Product
  id          uuid (PK)
  name        string
  price       decimal
  stock       int
  imageUrl    string (nullable)

CartItem
  id          uuid (PK)
  userId      uuid (FK)
  productId   uuid (FK)
  quantity    int

Order
  id          uuid (PK)
  userId      uuid (FK)
  status      enum(PENDING, PAID, SHIPPED, COMPLETED, CANCELLED)
  totalAmount decimal      // ราคารวม ณ ตอนซื้อ
  createdAt   datetime

OrderItem
  id          uuid (PK)
  orderId     uuid (FK)
  productId   uuid (FK)
  quantity    int
  priceAtPurchase decimal  // ราคา ณ ตอนซื้อ (snapshot)
```

**โจทย์ให้คิดเอง:** ทำไมต้องเก็บ `priceAtPurchase` ใน OrderItem แทนที่จะอ้างราคาจาก Product? (คำใบ้: ราคาสินค้าเปลี่ยนได้ แต่ใบเสร็จต้องไม่เปลี่ยน) เขียนเหตุผลใน README

---

## 5. หัวใจของ project: Transaction + Race Condition

**ปัญหา race condition ที่ต้องแก้:**
```
เวลา T0: สินค้า A มี stock = 1
เวลา T1: ลูกค้า X เช็ค stock → เห็น 1 → สั่งซื้อ
เวลา T1: ลูกค้า Y เช็ค stock → เห็น 1 → สั่งซื้อ (พร้อมกัน)
ผลที่ผิด: ทั้งคู่ได้สินค้า → stock = -1 (ขายเกิน!)
```

**วิธีแก้ที่ต้องเรียนรู้:**
- ใช้ database transaction ครอบการเช็ค stock + ตัด stock + สร้าง order
- ใช้ row lock หรือ conditional update (`UPDATE ... WHERE stock >= quantity`)
- เข้าใจ isolation level ของ database

*เป้าหมายเข้าใจ:* นี่คือคำถามสัมภาษณ์คลาสสิก — "ออกแบบระบบไม่ให้ขายของเกิน stock ยังไง?"

---

## 6. แผนการทำงานแบบ Phase

**Phase 0 — Setup + Product CRUD + role**
**Phase 1 — Cart**
**Phase 2 — Order + Transaction** ← หัวใจ
ทำการสร้าง order ที่ตัด stock แบบ atomic
*เป้าหมายเข้าใจ:* transaction, atomicity
**Phase 3 — แก้ Race Condition**
ทดสอบยิง request พร้อมกัน, ใส่ lock/conditional update
*เป้าหมายเข้าใจ:* race condition, isolation level
**Phase 4 — Order status + Deploy + README**

---

## 7. Definition of Done
- [ ] สร้าง order ตัด stock แบบ atomic
- [ ] **พิสูจน์ได้ว่ากัน race condition** (เขียน test ยิงพร้อมกันแล้วไม่ขายเกิน)
- [ ] role-based access ทำงาน (customer/admin)
- [ ] เก็บราคา snapshot ตอนซื้อ
- [ ] live demo + README + decision log (เรื่อง transaction strategy)

**คุณค่าต่อ portfolio:** transaction และ race condition เป็น concept ที่บริษัท e-commerce/fintech ถามแน่นอน การมี project ที่พิสูจน์ว่าคุณเข้าใจเรื่องนี้ = แต้มต่อชัดเจน
