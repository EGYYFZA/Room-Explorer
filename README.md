# Sela House · Hotel Room Explorer

Website hotel fiktif dengan Next.js App Router, React, dan CSS. Fokus pada tampilan dan interaksi browser: semua halaman memakai scroll horizontal, foto lokal, menu meluas, splash, galeri, filter kamar, serta simulasi menginap. Tidak ada backend atau pembayaran.

Inspirasi komposisi: [Art Estates](https://www.artestates.co/). Identitas Sela House memakai krem dan zaitun, tipografi serif, serta fotografi dominan. Sumber seluruh foto ada di [credits.txt](public/media/credits.txt).

## Menjalankan

Jalankan perintah dari folder `roomexplorer`. Di Windows PowerShell, gunakan `npm.cmd` bila `npm.ps1` diblokir execution policy.

```powershell
npm.cmd ci
npm.cmd run dev
```

Buka http://127.0.0.1:3000. Untuk memeriksa hasil produksi, hentikan server dev terlebih dahulu:

```powershell
npm.cmd run build
npm.cmd run preview
```

Preview langsung melayani `out/`; tidak ada lagi salinan kedua dalam `preview/`. Build juga menghasilkan `index.html` dan `room-pages/*.html` yang dapat dibuka dengan klik dua kali tanpa server. Pertahankan `public/media/` dan `app/icon.svg` di lokasinya. Jangan mengedit HTML hasil build: ubah sumber, lalu jalankan build kembali. Font memakai Google Fonts jika tersedia, dengan fallback Arial/Georgia.

## Struktur file

```text
roomexplorer/
├── app/                 Rute Next.js, layout, metadata, dan ikon
│   └── rooms/[id]/      Rute detail Garden, Canopy, dan Pool
├── components/          Journey, RoomExperience, BrandMark, PageTransitions
├── lib/                 Konten bersama dan mesin interaksi browser
├── styles/              CSS sesuai peran; urutan import di app/layout.jsx
├── public/media/        13 foto lokal dan credits.txt
├── scripts/             Ekspor HTML, adapter offline, preview, cleanup
├── tests/               Pengujian Playwright
├── docs/                Laporan belajar dan hasil audit
├── room-pages/          HTML detail hasil build untuk dibuka langsung
├── index.html           HTML beranda hasil build untuk dibuka langsung
├── README.md            Panduan proyek
└── package*.json        Dependensi dan lockfile
```

| File CSS | Peran |
| --- | --- |
| `styles/base.css` | Font dan dialog bersama |
| `styles/home.css` | Fondasi visual dan section beranda |
| `styles/rooms.css` | Detail kamar, galeri, fasilitas, formulir |
| `styles/horizontal.css` | Viewport horizontal dan responsivitas |
| `styles/transitions.css` | Gradasi slide, splash, menu, popup |
| `styles/interactions.css` | Navbar fixed, proporsi, hover |
| `styles/motion.css` | Animasi kemunculan section dan hero |

`lib/content.mjs` adalah sumber konten kamar dan pengalaman. `lib/journey.mjs`, `section-motion.mjs`, `page-transitions.mjs`, `dialog-motion.mjs`, dan `room-experience.mjs` dipakai oleh React dan versi HTML langsung. `scripts/offline-home.js` adalah adapter beranda khusus ekspor HTML; tidak perlu disajikan sebagai aset publik. `scripts/export-html.mjs` menyisipkan adapter dan fungsi bersama ke HTML saat build.

`node_modules/`, `.next/`, dan `out/` merupakan dependensi atau hasil alat. Semuanya diabaikan Git. Folder `node_modules/` dibutuhkan saat pengembangan, `.next/` digunakan Next.js, dan `out/` dipakai oleh perintah preview.

## Interaksi dan pengujian

- Mouse/trackpad, swipe, keyboard, tautan section, dan menu menavigasi horizontal pada semua ukuran layar.
- Filter Studio, Suite, Villa, dan Saved; tombol hati menyimpan kamar untuk kunjungan aktif.
- Halaman detail `/rooms/garden/`, `/rooms/canopy/`, dan `/rooms/pool/` menyediakan galeri, fasilitas, FAQ, simulasi biaya, serta kamar terkait.
- Popup dapat ditutup dengan Escape; formulir memvalidasi tanggal dan kapasitas.
- Hero muncul per baris setelah splash. Seluruh section dianimasikan ketika masuk viewport. Fokus keyboard tetap terbaca dan reduced motion mematikan gerakan.

```powershell
npm.cmd run build
npm.cmd test
```

Playwright menjalankan browser Chrome pada `C:/Program Files/Google/Chrome/Application/chrome.exe`; sesuaikan `playwright.config.mjs` jika lokasinya berbeda. Pengujian meliputi versi HTTP, HTML langsung, tampilan responsif, interaksi, dan animasi. Screenshot serta hasil pengujian tersimpan di `test-results/` dan tidak masuk Git.

Untuk membersihkan cache npm lokal, hasil pengujian, laporan Playwright, dan folder preview lama:

```powershell
npm.cmd run clean
```

Perintah ini mempertahankan sumber, dependensi, hasil HTML, `out/`, dan `.next/`, sehingga tidak mengganggu server Next.js yang sedang berjalan.

## Dokumentasi dan Git

[Laporan belajar](docs/LAPORAN-BELAJAR.md) memuat konsep desain, kode, browser, serta riwayat praktik. [Audit folder](docs/AUDIT.md) menjelaskan pengelompokan file, penghapusan, dan verifikasi terbaru.

```powershell
git log --oneline
git status --short
```

Commit merupakan snapshot bernama untuk membandingkan dan memulihkan versi proyek. Commit lokal tidak otomatis mengunggah proyek ke GitHub. Commit halaman pertama `feat: create initial hotel page` tetap ada dalam riwayat.
