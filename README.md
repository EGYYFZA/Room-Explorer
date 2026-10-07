# Sela House · Hotel Room Explorer

Website hotel fiktif dengan Next.js App Router, React, dan CSS. Fokus pada tampilan dan interaksi browser. Tidak ada backend, pemesanan nyata, atau pembayaran.

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
- Klik foto/nama panah kamar untuk detail fasilitas dan harga.
- Buka galeri; gunakan panah tombol atau keyboard.
- Ganti pengalaman pada bagian Slow Living.
- Pilih kamar, tanggal, dan tamu untuk simulasi total per malam. Validasi tanggal dan kapasitas kamar tersedia.
- Menu untuk layar kecil; dialog dapat ditutup dengan Escape dan tombol ×.

## Struktur

- `app/page.jsx`: struktur halaman dan state interaksi React.
- `app/globals.css`: visual, responsivitas, dan reduced motion.
- `lib/content.mjs`: satu sumber konten kamar dan pengalaman.
- `scripts/export-preview.mjs`: ekspor Next.js serta versi HTML langsung.
- `public/offline.js`: adapter untuk interaksi versi HTML tanpa server.
- `LAPORAN-BELAJAR.md`: pemahaman konsep, panduan 120 menit, dan hasil praktik.

## Verifikasi

`npm.cmd test` menjalankan pengujian interaksi Next.js, versi HTML langsung, dan layout desktop/ponsel. Konfigurasi memakai Chrome yang terpasang di `C:/Program Files/Google/Chrome/Application/chrome.exe`; sesuaikan `playwright.config.mjs` jika lokasi browser berbeda. Screenshot hasil uji ada di `test-results/` dan tidak masuk Git.

## Git

Repository ini sudah memiliki commit pengaturan awal. Commit `feat: create initial hotel page` menambahkan implementasi halaman pertama dan mempertahankan riwayat tersebut. Untuk memeriksa:

```powershell
git log --oneline
git status --short
git show --stat HEAD
```

Commit adalah titik simpan bernama: snapshot perubahan yang membantu melacak, membandingkan, dan mengembalikan versi proyek. Commit lokal belum berarti proyek diunggah ke GitHub.
