# Sela House · Hotel Room Explorer

Website hotel fiktif dengan Next.js App Router, React, dan CSS. Fokus pada tampilan dan interaksi browser. Tidak ada backend, pemesanan nyata, atau pembayaran.

Layout menggunakan viewport horizontal native pada beranda dan semua halaman detail kamar. Roda mouse vertikal maupun horizontal menggeser konten ke samping dengan interpolasi halus. Ponsel mendukung swipe native; gambar tetap bergerak dengan parallax dan teks muncul bertahap. Mesin scroll dipakai bersama oleh Next.js dan HTML langsung.

Semua ukuran layar menggunakan alur horizontal, termasuk ponsel dan jendela pendek. Gunakan mouse/trackpad, swipe kiri/kanan, pilihan di ikon menu, atau tombol panah saat tidak sedang mengisi formulir. Preferensi reduced motion mematikan animasi. Konten formulir yang panjang tetap dapat dibaca di dalam panel pada jendela sangat pendek.

Tampilan terbaru menggunakan fotografi hotel yang memenuhi layar dan navbar transparan yang tetap saat scroll. Logo Sela House beserta tagline memakai komponen yang sama dengan splash dan sejajar dengan ikon menu. Menu layar penuh menyediakan navigasi dan perencana menginap. Footer dan journey-rail tetap dihapus. Foto bergerak dengan parallax, teks muncul bertahap, dan navigasi halaman memakai transisi tirai ringan yang juga bekerja pada HTML langsung. Hover halus pada teks, kartu, foto, dan fasilitas tersedia untuk mouse; preferensi reduced motion mematikannya.

Inspirasi komposisi: [Art Estates](https://www.artestates.co/). Identitas Sela House memakai warna krem dan zaitun, tipografi besar, foto dominan, serta alur cerita hotel. Foto lokal dan sumbernya ada di `public/media/credits.txt`.

## Mulai

Di Windows PowerShell, gunakan `npm.cmd` jika `npm.ps1` diblokir execution policy.

```powershell
npm.cmd ci
npm.cmd run dev
```

Buka http://127.0.0.1:3000. Untuk hasil produksi:

```powershell
npm.cmd run build
npm.cmd run preview
```

`index.html` juga bisa dibuka langsung dengan klik dua kali, tanpa server atau pemasangan npm. HTML, CSS, dan adapter interaksi disertakan di dalam file; gambar menggunakan folder `public/media` yang harus tetap berada di sampingnya. Build menghasilkan ulang file tersebut dari halaman Next.js yang sama. Font memakai Google Fonts bila internet tersedia, dengan fallback Arial/Georgia.

## Yang bisa dicoba

- Filter Studio, Suite, Villa, dan Saved; simpan kamar dengan tombol hati untuk kunjungan aktif.
- Klik foto atau tombol panah untuk ringkasan kamar; klik nama kamar untuk halaman lengkap.
- Tiga halaman detail: `/rooms/garden/`, `/rooms/canopy/`, dan `/rooms/pool/`. Masing-masing memiliki cerita, galeri foto, fasilitas, FAQ, kamar terkait, serta simulasi biaya menginap.
- Tiga belas foto lokal memberi variasi interior, dining, spa, kolam, dan pemandangan Bali. Semua foto bersifat ilustratif dari beberapa properti.
- Buka galeri; gunakan panah tombol atau keyboard.
- Ganti pengalaman pada bagian Slow Living.
- Pilih kamar, tanggal, dan tamu untuk simulasi total per malam. Validasi tanggal dan kapasitas kamar tersedia.
- Menu untuk layar kecil; dialog dapat ditutup dengan Escape dan tombol ×.

## Struktur

- `app/page.jsx`: struktur halaman dan state interaksi React.
- `components/Journey.jsx`: lima layar presentasi dan navigasi bab.
- `app/rooms/[id]/page.jsx`: rute statis dan metadata setiap kamar.
- `components/RoomExperience.jsx`, `app/room.css`: desain halaman detail responsif.
- `lib/room-experience.mjs`: galeri dan kalkulasi tanggal yang dipakai bersama Next.js dan HTML langsung.
- `components/PageTransitions.jsx`, `lib/page-transitions.mjs`: perpindahan halaman, dukungan reduced motion, dan pemulihan tampilan setelah tombol Back.
- `room-pages/*.html`: halaman detail yang dapat dibuka langsung dari `index.html` tanpa server.
- `app/journey.css`: identitas visual dan animasi.
- `app/horizontal.css`: viewport horizontal universal, panel foto/kartu yang memanjang ke samping, dan responsivitas.
- `app/refinements.css`: gradasi tepi slide, bagian kamar putih hangat, splash 2,8 detik, menu meluas, dan popup responsif.
- `app/polish.css`: navbar transparan, proporsi konten per ukuran layar, dan hover teks, kartu, foto, serta fasilitas.
- `components/BrandMark.jsx`: logo dan tagline yang dipakai bersama oleh navbar dan splash.
- `lib/section-motion.mjs`, `app/motion.css`: judul hero per baris dan kemunculan bertahap saat teks, kartu, fasilitas, serta foto masuk viewport. Animasi dapat berulang setelah keluar layar; konten baru dari filter ikut didaftarkan. Fokus keyboard dan reduced motion menjaga konten langsung terbaca.
- `lib/dialog-motion.mjs`: animasi penutupan menu dan popup yang digunakan bersama Next.js dan HTML langsung.
- `app/globals.css`: font dan tampilan dialog.
- `lib/journey.mjs`: mesin scroll, navigasi, progres, parallax, dan cleanup.
- `lib/content.mjs`: satu sumber konten kamar dan pengalaman.
- `scripts/export-preview.mjs`: ekspor Next.js serta versi HTML langsung.
- `public/offline.js`: adapter untuk interaksi versi HTML tanpa server.
- `LAPORAN-BELAJAR.md`: pemahaman konsep, panduan 120 menit, dan hasil praktik.

## Verifikasi

`npm.cmd test` menjalankan pengujian interaksi Next.js, versi HTML langsung, dan layout desktop/ponsel. Konfigurasi memakai Chrome yang terpasang di `C:/Program Files/Google/Chrome/Application/chrome.exe`; sesuaikan `playwright.config.mjs` jika lokasi browser berbeda. Screenshot hasil uji ada di `test-results/` dan tidak masuk Git.

Pembuka menahan scroll selama splash dan memulai di Arrival saat halaman utama dibuka atau dimuat ulang. Tautan langsung ke bab seperti `/#rooms` dan navigasi Back tetap mempertahankan tujuan yang diminta. Menu meluas dari ikon selama 1,25 detik dan menutup selama 0,7 detik. Preferensi reduced motion melewati splash dan animasi.

## Git

Repository ini sudah memiliki commit pengaturan awal. Commit `feat: create initial hotel page` menambahkan implementasi halaman pertama dan mempertahankan riwayat tersebut. Untuk memeriksa:

```powershell
git log --oneline
git status --short
git show --stat HEAD
```

Commit adalah titik simpan bernama: snapshot perubahan yang membantu melacak, membandingkan, dan mengembalikan versi proyek. Commit lokal belum berarti proyek diunggah ke GitHub.
