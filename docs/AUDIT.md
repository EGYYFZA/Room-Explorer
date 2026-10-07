# Audit folder Sela House

Audit lokal pada 7 Oktober 2026 mencakup sumber aplikasi, komponen, modul interaksi, CSS, skrip, pengujian, aset, dokumentasi, konfigurasi, serta folder hasil build/cache. Dependensi pihak ketiga dan isi internal Git diperiksa sebagai kategori penyimpanan, bukan diubah sebagai sumber aplikasi.

## Temuan dan penyesuaian

| Temuan | Penyesuaian |
| --- | --- |
| Tujuh CSS bercampur dengan rute di `app/` | Dipindahkan ke `styles/` dengan nama berdasarkan peran. Urutan cascade dipertahankan. |
| Laporan belajar berada di root | Dipindahkan ke `docs/LAPORAN-BELAJAR.md`; panduan tetap di README root. |
| `public/offline.js` hanya dibaca saat ekspor | Dipindahkan ke `scripts/offline-home.js`, sehingga tidak ikut tersaji sebagai aset publik atau tersalin dalam `out/`. |
| `out/` disalin lagi ke `preview/` setiap build | Salinan dihapus; server preview kini membaca `out/` langsung. Skrip ekspor menjadi `scripts/export-html.mjs`. |
| Salinan `preview/` mengandung output lama | Folder dihapus seluruhnya. Build berikutnya tidak membuatnya kembali. |
| Style header/footer/bar lama tertinggal | 28 aturan CSS yang tidak memiliki elemen pengguna di sumber dihapus, termasuk `.room-header`, `.back-to-rooms`, `.room-footer`, `.room-stay-bar`, dan `.sr-only`. Variabel `--rail-height` yang tidak digunakan dihapus. |
| Cache dan screenshot lama memenuhi workspace | `.npm-cache/`, `preview/`, dan `test-results/` dibersihkan, sekitar 268 MB berdasarkan ukuran file sebelum audit. |
| Belum ada perintah cleanup terbatas | Ditambahkan `npm.cmd run clean` untuk cache npm lokal, hasil uji, laporan Playwright, dan preview lama. Target dibatasi pada folder yang ditentukan di dalam proyek. |

## File yang tetap diperlukan

- Seluruh 13 foto dipakai oleh konten beranda, kamar, pengalaman, atau galeri; sumber foto tetap di `public/media/credits.txt`.
- Semua komponen dan modul runtime terhubung melalui import atau proses ekspor HTML. Fungsi yang disisipkan saat build tetap diperlukan meskipun bukan import browser langsung.
- `index.html` dan tiga file `room-pages/*.html` adalah hasil build yang sengaja dipertahankan agar website dapat dibuka langsung tanpa server, sesuai kebutuhan awal proyek.
- `tests/` berisi verifikasi interaksi dan responsivitas, bukan file sementara. Hasil pengujiannya boleh dibersihkan dan akan dibuat kembali.
- `package-lock.json` diperlukan untuk pemasangan dependensi yang konsisten. `AGENTS.md`, konfigurasi Next.js/Playwright, ikon, dan file Git tetap dipertahankan.
- `node_modules/` dibutuhkan untuk menjalankan alat; `.next/` untuk Next.js; `out/` untuk preview produksi. Ketiganya diabaikan Git dan dapat dibuat ulang melalui instalasi/build.
- Selector `.room-page-canopy` tetap dipakai melalui class dinamis `room-page-${room.id}`; tidak dihapus berdasarkan pencarian teks literal saja.

## Batas perubahan

Audit ini merapikan struktur dan menghapus artefak atau aturan yang terbukti usang. Perilaku horizontal, animasi, rute, konten, dan interaksi website tetap dipertahankan. CSS yang masih dipakai tidak digabung secara agresif agar urutan override responsif tetap sama. Tidak ada pemasangan dependensi baru, deployment, atau commit tambahan.

## Verifikasi

- Build produksi Next.js dan ekspor empat HTML langsung berhasil setelah seluruh pemindahan file.
- Referensi import lokal pada sumber diperiksa tanpa target yang hilang. Sintaks keempat skrip lolos pemeriksaan Node.
- Seluruh 75 referensi lokal dalam markup HTML hasil build menunjuk file yang tersedia. URL dinamis di dalam skrip diperiksa melalui pengujian browser.
- Tidak ada foto duplikat berdasarkan SHA-256; seluruh 13 foto masih dipakai.
- `out/offline.js` dan folder duplikat `preview/` tidak ada lagi setelah build.
- Seluruh 17 pengujian Playwright lulus (2,4 menit, dua worker), meliputi rute HTTP, HTML langsung, horizontal pada empat ukuran layar, swipe, filter/Saved, galeri, popup, simulasi harga, splash/menu, dan animasi seluruh section.
- Artefak pengujian terbaru dibersihkan setelah hasilnya dicatat. Perintah `npm.cmd test` akan membuatnya kembali.
