# VFX Forge

เว็บประกอบเอฟเฟกต์สำหรับ Unity ได้แรงบันดาลใจด้าน workflow จาก https://vfx.gamemellow.dev/ ใช้ Canvas 2D สร้างภาพ procedural บนเครื่อง ไม่ต้องมีบัญชีหรือ API key

## ความสามารถ

- พรีเซ็ต 8 แบบ และชิ้นส่วน 12 แบบ: rune, ring, sparks, beam, slash, burst, flame, lightning, smoke, orb, shield, vortex
- ซ้อนสูงสุด 12 เลเยอร์ ปรับสีหลัก/ไฮไลต์ ขนาด ความเข้ม หมุน ตำแหน่ง ความเร็ว จำนวนชิ้นส่วน seed และเวลาแต่ละเลเยอร์
- ทำสำเนา ลบ เรียงลำดับ ซ่อนเลเยอร์ ธีมสี 6 แบบ
- พรีวิว เล่น/หยุด เลื่อนเวลา เริ่มใหม่ เดินทีละเฟรม ซูม และเปลี่ยนพื้นหลัง
- บันทึกอัตโนมัติใน localStorage นำเข้า/ส่งออก JSON โปรเจกต์ พร้อมตรวจค่าก่อนนำเข้า
- Ctrl+S ส่งออกโปรเจกต์, Space เล่น/หยุด, Ctrl+Z และ Ctrl+Shift+Z ย้อนกลับ/ทำซ้ำ

## โหมด 2D / 3D

เลือกปุ่ม **2D / 3D** เหนือพรีวิว โปรเจกต์ใหม่เริ่มใน 3D ส่วน JSON เก่าที่ไม่มี mode จะเปิดใน 2D เพื่อรักษารูปแบบเดิม ปุ่มรีเซ็ตมุมมองคืนกล้องเริ่มต้น

- 2D ใช้ตัววาดเลเยอร์เดิม
- 3D สร้าง geometry จากพิกัด X/Y/Z จริงสำหรับชิ้นส่วนทั้ง 12 แบบ ใช้ perspective projection ลง Canvas พร้อม depth sorting ลากบนพรีวิวเพื่อ orbit กล้อง และใช้ scroll ซูม มีกริดพื้นในโลก 3D
- เลเยอร์ในโหมด 3D มีตำแหน่ง Z, หมุนแกน X/Y เพิ่มจากการหมุน Z เดิม และความลึกการกระจายอนุภาค กล้องและโหมดบันทึกในโปรเจกต์
- ระบบใช้เส้น/แท่งและ wire geometry จึงยังไม่มีพื้นผิวทึบ การชน เงาจริง หรือ volumetric simulation; พรีวิวคงจำกัด 30 FPS/960 px

## Export

| รูปแบบ | ผลลัพธ์ |
| --- | --- |
| PNG texture | RGBA โปร่งใสของเฟรมปัจจุบัน ไม่รวมพื้นหลัง กริด หรือการซูม |
| PNG flipbook | ZIP มี atlas PNG, texture .meta, frame metadata JSON และโปรเจกต์ต้นฉบับ |
| Shader Graph | ZIP เพิ่ม .shadergraph มี Time → Multiply → Flipbook → Sample Texture 2D เชื่อม PNG ผ่าน GUID |
| VFX Graph | ZIP เพิ่ม .vfx จาก Unity FullLoop flipbook template ปรับ texture GUID, grid, frame rate, lifetime และ emission |
| Unity 3D Mesh package | ใช้ได้เมื่อเลือก 3D: ZIP มี geometry animation JSON, C# Mesh component และ URP shader เก็บมิติจริงโดยไม่ bake กล้อง |

เลือกขนาดต่อเฟรม 128–1024 px และ 16/36/64 เฟรม (atlas สูงสุด 8192px) ระยะเวลา 1–4 วินาที ใน ZIP มี README.md วิธีนำเข้าและ notices

แตกไฟล์ทั้งชุดลงโฟลเดอร์ใหม่ภายใน Assets เพื่อรักษาการเชื่อม texture กับ .meta ใช้ Unity 6 + Shader Graph / VFX Graph 17.x และ pipeline ที่รองรับ Templates มาจาก Graphics/master จึงอาจต้องอัปเกรดหรือปรับตาม package version

**ข้อจำกัด:** PNG/Shader Graph/VFX Graph ยังคงเป็น baked 2D flipbook บน quad โดยโหมด 3D จะ bake มุมกล้องปัจจุบัน หากต้องการเก็บมิติจริงให้เลือก **Unity 3D Mesh package** ซึ่งเป็น Mesh animation ไม่ใช่ .vfx graph และไม่ใช่ volumetric simulation ยังไม่ได้ตรวจ import/compile ด้วย Unity Editor ใน workspace นี้

นำเข้าแพ็กเกจ 3D ใน Unity URP: แตก ZIP ลง Assets → สร้าง Empty GameObject → เพิ่ม component VFXForge3D_… ที่ส่งออก → ใส่ไฟล์ .world3d.json ใน Animation Json → สร้าง Material ด้วย shader VFXForge/WorldLines_… แล้วใส่ Effect Material → Play ระบบสร้าง Mesh ต่อเฟรมและแคชไว้ในหน่วยความจำ จึงใช้หน่วยความจำเพิ่มตามจำนวนเฟรม/เลเยอร์ การเรืองแสงใน Unity ต้องใช้ Bloom ส่วน Alpha blend ของเลเยอร์จะประมาณเป็น Additive ในแพ็กเกจ 3D

## การพัฒนา

```powershell
npm start
npm test
```

เครื่องนี้มี Apache/XAMPP ใช้พอร์ต 80 อยู่แล้ว จึงติดตั้งเว็บที่ `C:\xampp\htdocs\vfx-forge` และเพิ่ม DirectoryIndex ใน `C:\xampp\htdocs\.htaccess` ให้เปิดได้ที่ **http://localhost/** โดยไม่ต้องเปิด Node server พร้อมกัน หากมี .htaccess เดิม สคริปต์จะสำรองก่อนแก้ หน้า dashboard เดิมของ XAMPP ยังอยู่ที่ /dashboard/

หลังแก้ source ให้เรียก `powershell -NoProfile -File ./install-localhost.ps1` เพื่อคัดลอกเวอร์ชันใหม่ไปยัง Apache สคริปต์แก้ไฟล์นอก workspace จึงอาจต้องอนุมัติสิทธิ์ผ่านเครื่องมือ การยกเลิกหน้าเริ่มต้นนี้ให้ลบสองบรรทัดส่วน `# VFX FORGE LOCALHOST` ใน .htaccess หรือคืน backup

สำหรับเครื่องที่ไม่มี Apache ใช้ Node.js built-in HTTP ฟังที่ 127.0.0.1:80 ไม่มี dependency ตั้ง PORT เพื่อใช้พอร์ตอื่นได้ ข้อมูลโปรเจกต์ไม่ถูกส่งออกนอกเบราว์เซอร์ (ฟอนต์โหลดจาก Google Fonts และมี fallback)

ไฟล์หลัก: dist/index.html, style.css, app.js, engine.js, export.js; server.mjs สำหรับ localhost; test.mjs สำหรับตรวจโครงสร้าง export

## สถานะการตรวจสอบ

### เพิ่ม 3D (2026-10-18)

- เพิ่มตัวเลือก 2D/3D, กล้อง orbit, Z/tilt/depth, export ภาพจากกล้อง และแพ็กเกจ geometry 3D สำหรับ Unity URP
- `node scene3d-test.mjs`: ตรวจ geometry ทั้ง 12 แบบมีความลึกจริง ค่า finite/deterministic, Z transform, camera projection, timing/visibility, JSON mesh frames, ชื่อ C# class/shader ตรงกัน และ ZIP 3D export
- `npm test` ผ่านทั้ง export, performance, geometry 3D และ app smoke test (จำลอง DOM): เปิดแอป สลับ 2D/3D, เลือก renderer, จำกัด native export ให้โหมด 3D, preset คงโหมด และ migrate JSON เก่า
- ติดตั้ง source เวอร์ชัน 1.1.0 บน Apache localhost แล้ว พร้อม cache version `3d1`
- การทดสอบนี้เป็นระดับโค้ด ยังไม่ได้ยืนยัน UI ด้วยเบราว์เซอร์หรือ compile runtime ด้วย Unity Editor

### แก้อาการหน่วง (2026-10-18)

- พรีวิวใช้ glow sprite cache ร่วมกันตามสี แทนการสร้าง radial gradient ต่ออนุภาคทุกเฟรม จำกัด cache 64 สี และลดงาน shadow blur เฉพาะพรีวิว/thumbnail
- จำกัดพรีวิว 30 FPS และขนาดภาพวาดไม่เกิน 960 px ต่อด้าน ไม่คูณตามจอ Retina/DPR; เวลาการเล่นยังอิงเวลาจริง ส่วน Export คงขนาดและวิธีเรนเดอร์เต็มคุณภาพเดิม
- แคชกริด/พื้นหลัง ใช้ ResizeObserver แทนอ่าน layout ทุกเฟรม และอัปเดตข้อความเวลา/slider ไม่เกิน 10 ครั้งต่อวินาที โดยไม่สร้าง DOM ใหม่ในลูป
- หยุดลูปวาดเมื่อกด Pause, สลับแท็บ หรือเปิด dialog และเริ่มใหม่เมื่อมีการแก้ไข/เล่นต่อ
- `node performance-test.mjs` ตรวจการใช้ cache, ไม่มี path blur ในพรีวิว, render ครบ 12 ชิ้นส่วน, export ยังใช้ gradient/blur เดิม และ scheduling ของ 30 FPS/Pause/แท็บซ่อน โดยใช้ context จำลอง ไม่ใช่ benchmark FPS บน GPU จริง
- คัดลอกเวอร์ชันแก้ไขไป Apache localhost แล้ว หลังอัปเดตให้รีเฟรชด้วย Ctrl+F5

อัปเดต 2026-10-18:

- JavaScript syntax checks ผ่าน
- `node test.mjs` ผ่าน: Shader Graph object IDs และ edge slot references, texture GUID, atlas 4×4/6×6/8×8, VFX grid/cycles/lifetime/velocity, ZIP headers และ CRC32
- ZIP ตัวอย่างเปิดอ่านได้ด้วย .NET ZipFile รวมชื่อไฟล์ภาษาไทย
- Apache ตอบ HTTP 200 สำหรับ http://localhost/ และ JavaScript module ของแอป
- ยังไม่ได้ตรวจภาพและ workflow ผ่านเบราว์เซอร์: ระบบอนุมัติอัตโนมัติปฏิเสธ Computer Use สำหรับ Google Chrome
- ยังไม่ได้ทดสอบ import/compile ใน Unity Editor การตรวจโครงสร้างไฟล์ไม่เท่ากับการยืนยันว่าคอมไพล์ได้ใน Unity

ตัวอย่างผล export และ ZIP test อยู่ใน qa/ ใช้เพื่อการตรวจสอบเท่านั้น ไม่ต้องนำไป deploy

## สิทธิ์ของเทมเพลต

อ่าน dist/THIRD-PARTY-NOTICES.txt และ dist/UNITY-COMPANION-LICENSE.txt เทมเพลต Unity อยู่ภายใต้ Unity Companion License สำหรับโครงการที่ใช้งานร่วมกับ Unity
