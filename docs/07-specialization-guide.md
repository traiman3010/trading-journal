# TOR — Specialization Guide (Tier 4)

> Tier 4 คือการ "เลือกทางลึก" — ถึงจุดนี้คุณจะรู้แล้วว่าชอบอะไร
> เอกสารนี้เป็น decision guide + โครงของทางสาย trading (ที่ตรงความสนใจคุณ)
> ความยาก: ⭐⭐⭐⭐⭐
>
> ⚠️ FUTURE-PROOF NOTE: Tier นี้อยู่ไกลที่สุด (อาจ 6-12 เดือนข้างหน้า) — เมื่อถึงจริง ให้กลับมาขอ Claude
> เขียน TOR เต็มใน session ใหม่ เพราะตอนนั้นจะรู้ context และเครื่องมือปัจจุบันชัดกว่ามาก

---

## ถึงจุดนี้คุณควรมีอะไรแล้ว

- เข้าใจ backend ครบวงจร (Tier 1)
- ทำ realtime + transaction ได้ (Tier 2)
- คิดเรื่อง production เป็น (Tier 3)
- มี portfolio 3-5 project ที่อธิบายได้
- **น่าจะสมัครงาน fullstack ได้แล้วตั้งแต่จบ Tier 2-3** — Tier 4 ทำระหว่างทำงานก็ได้

---

## ทางเลือก specialization (เลือก 1 ที่ใช่)

### ทาง A: Algorithmic Trading / Trading Bot (แนะนำ — ตรงความชอบ)
ต่อยอดความสนใจ finance ไปสู่ระดับลึก เป็น niche ที่หายากและมีคุณค่าสูง

### ทาง B: System Design / Distributed Systems
microservices, event-driven architecture, message broker (Kafka) — สำหรับคนชอบ architecture

### ทาง C: DevOps / Cloud / Platform
AWS/GCP, Kubernetes, infrastructure as code — สำหรับคนชอบ infra

### ทาง D: AI Integration / LLM Apps
สร้างแอปที่ใช้ AI, RAG, agent — สาขาที่กำลังโต

---

## โครง TOR: Trading Bot / Backtesting Engine (ทาง A)

> นี่คือโครง ไม่ใช่ TOR เต็ม — เมื่อถึงเวลาทำจริง ขอ Claude ขยายเป็น TOR เต็มใน session ใหม่
> พร้อมตรวจสอบ API, library, และ regulation ปัจจุบัน

### ภาพรวม
ระบบทดสอบกลยุทธ์เทรดกับข้อมูลย้อนหลัง (backtesting) และ/หรือ bot ที่เทรดอัตโนมัติตามกลยุทธ์

### concept ที่จะฝึก
- **ประมวลผลข้อมูลปริมาณมาก** — ราคาย้อนหลังหลายปี เป็น time-series ขนาดใหญ่
- **Performance optimization** — การคำนวณ indicator กับข้อมูลล้านแถวต้องเร็ว
- **Algorithm design** — แปลงกลยุทธ์เทรดเป็นโค้ดที่ทดสอบได้
- **Statistical analysis** — วัดผลกลยุทธ์ (Sharpe ratio, max drawdown, win rate)
- (ถ้าทำ live bot) **Reliability** — ระบบที่รันต่อเนื่อง จัดการ error โดยไม่ล่ม

### ขอบเขตที่แนะนำ (เริ่มเล็ก)
1. **เริ่มจาก backtesting ก่อน** (ปลอดภัย ไม่ใช้เงินจริง):
   - ดึงข้อมูลราคาย้อนหลัง
   - implement กลยุทธ์ง่ายๆ (เช่น moving average crossover)
   - รันกับข้อมูลย้อนหลัง คำนวณผลตอบแทน
   - แสดงผลเป็นกราฟ + สถิติ
2. **ขยายทีหลัง:** หลายกลยุทธ์, optimization, paper trading (เทรดจำลองด้วยราคา realtime)
3. **ระวังมาก:** การเทรดด้วยเงินจริงมีความเสี่ยงและเรื่อง regulation — เริ่มจาก backtest/paper trading เท่านั้น

### ⚠️ สิ่งที่ต้องตรวจสอบเมื่อทำจริง
- API ข้อมูลราคาย้อนหลังที่ใช้ได้ (free tier มักจำกัด historical data)
- library สำหรับ backtesting (มีหลายตัว ตรวจว่าตัวไหน maintain อยู่)
- ถ้าจะ live trading: regulation ในประเทศ, API ของ broker, ความเสี่ยง
- ภาษา: งานประมวลผลข้อมูลหนักอาจเหมาะกับ Python มากกว่า — พิจารณาว่าจะใช้ Python ส่วน engine + TypeScript ส่วน UI ไหม

### Definition of Done (เวอร์ชันเริ่มต้น)
- [ ] backtest กลยุทธ์ 1 ตัวกับข้อมูลย้อนหลังได้
- [ ] แสดงผลตอบแทน + สถิติ (Sharpe, drawdown, win rate)
- [ ] เปรียบเทียบกับ buy-and-hold ได้
- [ ] README อธิบายกลยุทธ์ + ข้อจำกัด + decision log

---

## หลักคิดสำคัญของ Tier 4

- **เลือกจาก passion จริง** — Tier นี้ลึกและใช้เวลา ถ้าไม่ชอบจริงจะทำไม่จบ
- **อย่ายึดเอกสารนี้** — พอถึงจุดนี้คุณโตพอจะออกแบบ project เองได้แล้ว เอกสารนี้แค่จุดประกาย
- **project จาก pain point จริงชนะเสมอ** — ถ้าระหว่างทางเจอปัญหาจริงที่อยากแก้ ทำอันนั้นแทนได้เลย
- **กลับมาขอ Claude** — เมื่อถึง Tier 4 จริง โยน folder นี้เข้า session ใหม่ บอกว่าทำถึงไหนแล้ว แล้วขอ TOR เต็มของทางที่เลือก พร้อมข้อมูลที่ทันสมัย ณ ตอนนั้น

---

## 🎓 ปลายทาง

จบทั้ง 4 tier คุณจะไม่ใช่ "frontend dev ที่อยากเป็น fullstack" อีกต่อไป แต่เป็น fullstack developer ที่มี:
- ความเข้าใจ backend ครบวงจร
- portfolio ที่อธิบายได้ทุกบรรทัด
- depth ในสาขาที่ตัวเองเลือก
- ที่สำคัญที่สุด: **ความสามารถในการเรียนรู้สิ่งใหม่ด้วยตัวเอง** — ซึ่งเป็น skill ที่มีค่าที่สุดในอาชีพนี้

เส้นทางนี้ยาว แต่ทุก project ที่ทำเสร็จคือก้าวที่จับต้องได้ ขอให้สนุกกับการสร้างครับ
