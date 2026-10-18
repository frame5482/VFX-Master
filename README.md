# VFX-Master

เว็บออกแบบ VFX สำหรับ Unity อยู่ใน [vfx-forge](vfx-forge/README.md)

ก่อนแก้ไขงาน ให้อ่าน README.md นี้และ README.md ในโฟลเดอร์ที่เกี่ยวข้อง เมื่อทำเสร็จให้อัปเดตเอกสารตามพฤติกรรมจริงและผลการตรวจสอบ

## เริ่มใช้งาน

ต้องมี Node.js 22 ขึ้นไป ไม่ต้องติดตั้ง dependencies

```powershell
cd D:\Project\VFX-Master\vfx-forge
npm start
```

เครื่องนี้ติดตั้งบน Apache/XAMPP ที่มีอยู่แล้ว เปิด **http://localhost/** ได้ทันที ไม่ต้องเรียก npm start ซ้ำ ใช้ `vfx-forge/install-localhost.ps1` เพื่ออัปเดตไฟล์ที่ Apache เสิร์ฟหลังแก้ source

คำสั่ง npm start ด้านบนใช้กับเครื่องที่ไม่มีเซิร์ฟเวอร์อื่นใช้พอร์ต 80 หากพอร์ตถูกใช้อยู่ ให้ตรวจโปรแกรมที่ครอบครองพอร์ตก่อน ห้ามหยุดโปรแกรมอื่นโดยไม่ได้รับอนุญาต

อัปเดต 2026-10-18: สร้างตัวแก้ไข VFX แบบเลเยอร์ พร้อม PNG/flipbook/Shader Graph/VFX Graph export ตรวจ syntax, โครงสร้าง Graph/ZIP และ HTTP 200 แล้ว ดูข้อจำกัดเรื่อง Unity import และ browser QA ใน README ของแอป

แก้อาการหน่วง: เพิ่ม glow/grid cache, จำกัดพรีวิว 30 FPS/960 px, ลด DOM/layout ในลูป และหยุดวาดเมื่อ Pause/ซ่อนแท็บ โดยคงคุณภาพ Export เดิม รายละเอียดและผลทดสอบใน README ของแอป
