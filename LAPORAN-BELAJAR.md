# Laporan belajar — Hotel Room Explorer

Tanggal: 7 Oktober 2026 (Asia/Jakarta).

Dokumen ini menjelaskan hasil praktik dan panduan belajar 120 menit. Durasi berikut adalah alokasi latihan yang diminta, bukan klaim bahwa setiap sesi telah berlangsung selama waktu tersebut. Format laporan khusus belum disertakan setelah kalimat “kirim laporan ini”, sehingga laporan menggunakan format ringkas berikut.

## Pemahaman awal: Figma → kode → browser (10 menit)

Figma adalah tempat merencanakan tampilan: ukuran, jarak, warna, tipografi, komponen, dan alur. Desain Figma tidak otomatis menjadi website yang berjalan. Pengembang menerjemahkan rancangan menjadi struktur dan perilaku melalui kode. Browser membaca hasil kode dan menampilkan halaman yang dapat digunakan. Hasil perlu diperiksa pada beberapa ukuran layar karena rancangan statis tidak mewakili semua keadaan pengguna.

Pada praktik ini tidak ada file Figma yang diberikan. Website Art Estates dipakai sebagai referensi komposisi, kemudian identitas hotel Sela House dikembangkan dengan desain tersendiri.

## Peran teknologi (25 menit)

| Teknologi | Penjelasan dengan bahasa sederhana | Contoh pada halaman |
| --- | --- | --- |
| HTML | Menentukan isi dan susunannya. | Judul hotel, deskripsi, artikel kamar, gambar, tombol, formulir. |
| CSS | Menentukan bagaimana isi terlihat dan menyesuaikan layar. | Warna krem, ukuran judul, grid kamar, susunan satu kolom pada ponsel. |
| JavaScript | Merespons tindakan pengguna dan mengubah keadaan halaman. | Filter, favorit, galeri, detail kamar, perhitungan total menginap. |
| React | Menghubungkan data dan keadaan antarmuka dengan komponen. | State kamar tersimpan, dialog yang aktif, dan tanggal. |
| Next.js | Mengatur proyek React dan menghasilkan halaman siap browser. | App Router dan hasil ekspor statis. |
| Git | Mencatat riwayat perubahan berkas proyek. | Mengetahui file yang berubah dan versi yang tersimpan. |
| Commit | Titik simpan satu kumpulan perubahan dengan pesan. | `feat: create initial hotel page` menandai halaman hotel pertama. |

## Praktik editor dan proyek (65 menit)

Folder kerja sudah ada. Repository `roomexplorer` mempunyai commit pengaturan awal dan dilanjutkan tanpa mengganti sejarahnya. Node, npm, Git, dan perintah VS Code tersedia. Website dibuat di repository tersebut dengan Next.js dan React.

Hotel fiktif: **Sela House**, sebuah retreat butik yang dibayangkan di Ubud, Bali. Tiga kamar dummy:

| Kamar | Harga per malam | Kapasitas |
| --- | --- | --- |
| Garden Studio | Rp1.850.000 | 2 tamu |
| Canopy Suite | Rp2.750.000 | 3 tamu |
| Pool House | Rp4.200.000 | 4 tamu |

Ponytail dicari melalui direktori plugin dan file lokal, tetapi tidak ditemukan. Instalasi `/plugin install ponytail@ponytail` belum dilakukan dan skill Ponytail belum digunakan. Pengerjaan menggunakan panduan Sites dan Plugin Management yang tersedia.

## Pemeriksaan (15 menit)

Hasil verifikasi aktual:

- `npm.cmd run build` berhasil: halaman Next.js diekspor menjadi halaman statis dan `index.html` langsung.
- `npm.cmd test`: **9 pengujian browser lulus** (6 skenario beranda dan 3 skenario halaman detail). Filter/favorit, detail kamar, galeri dan keyboard, perubahan pengalaman, tanggal yang tidak valid, kapasitas kamar, dan total menginap diperiksa pada Next.js serta HTML langsung.
- Layout beranda desktop 1440 px dan ponsel 390 px, serta detail kamar 320, 390, 768, dan 1280 px diperiksa; tidak ada overflow horizontal. Screenshot hasil pengujian telah ditinjau.
- Semua gambar utama diperiksa berhasil dimuat dari aset lokal.
- Chrome dibuka ke `index.html`, dan folder proyek dibuka di VS Code. Kontrol UI desktop langsung tidak tersambung; pemeriksaan visual dilakukan melalui screenshot Chrome pengujian otomatis.
- Sintaks skrip ekspor, preview, dan adapter HTML lulus pemeriksaan Node.
- Commit implementasi halaman memakai pesan **`feat: create initial hotel page`**. Hash dan keadaan akhir Git diverifikasi setelah penyimpanan.

Kedua kriteria latihan dipenuhi: HTML menampilkan hotel, deskripsi, nama kamar dan harga di browser; perubahan halaman disimpan dalam commit. Repository mempunyai commit pengaturan lama yang dipertahankan, sehingga commit halaman merupakan commit tambahan pertama untuk implementasi, bukan penggantian seluruh riwayat.

Foto menggunakan aset lokal; semua konten hotel dan harga bersifat ilustratif. Belum ada backend, ketersediaan kamar nyata, pembayaran, atau deployment publik.

## Refleksi (5 menit)

Desain yang baik membutuhkan lebih dari gambar yang menarik: isi harus terbaca, ruang antarelemen konsisten, dan setiap tombol memberi hasil yang jelas. Browser menjadi tempat menguji keputusan desain itu.

Dengan bahasa saya sendiri, commit seperti memotret keadaan proyek dan memberi nama pada foto itu. Sesudah membuat perubahan lain, saya masih bisa membandingkan keadaan baru dengan titik simpan tersebut. Commit juga menjelaskan tujuan perubahan kepada orang lain yang membaca riwayat Git.

Langkah belajar berikutnya: jalankan halaman, coba semua tombol, ubah satu warna atau harga di sumbernya, bangun ulang, lalu bandingkan perubahan sebelum membuat commit berikutnya.

## Pengembangan tampilan lanjutan

Beranda sekarang menggunakan lima bab horizontal dengan scroll halus, navigasi bab, parallax, dukungan keyboard, serta pengurangan animasi sesuai preferensi perangkat. Ponsel menggunakan alur vertikal.

Setiap kamar memiliki halaman sendiri: `/rooms/garden/`, `/rooms/canopy/`, dan `/rooms/pool/`. Detail memuat galeri foto yang dapat diperbesar, cerita kamar, fasilitas, FAQ, simulasi biaya berdasarkan tanggal dan kapasitas, serta tautan kamar lainnya. Tiga belas foto lokal digunakan; sumbernya tercatat di `public/media/credits.txt`. Semua properti dalam foto adalah ilustrasi dari beberapa sumber.

Build berhasil, keenam pengujian beranda lulus, dan ketiga pengujian detail lulus setelah selector skrip pengujian disesuaikan. Versi Next.js dan HTML langsung sama-sama diuji. Halaman kamar yang tidak dikenal memberikan respons 404.

Commit halaman pertama tetap tersimpan sebagai `4486e11 feat: create initial hotel page`. Pengembangan horizontal dan halaman detail terbaru masih merupakan perubahan lokal yang belum disimpan dalam commit tambahan.

## Penyempurnaan visual tanpa navbar dan footer

Beranda kini memakai foto hotel yang memenuhi layar, tipografi serif, dan satu ikon menu mengambang. Navbar, footer, serta bar navigasi bawah dihapus dari beranda dan halaman kamar. Menu layar penuh menyediakan navigasi bab dan perencana menginap.

Scroll horizontal tetap halus dengan parallax gambar dan kemunculan teks bertahap. Perpindahan halaman memakai efek tirai; preferensi reduced motion mematikan animasi. Pengujian juga memeriksa tombol Back agar transisi tidak menutupi halaman setelah kembali.

Build berhasil, sembilan pengujian browser lulus, serta pemeriksaan navigasi dan Back lulus pada Next.js dan HTML langsung. Screenshot desktop, laptop 720 px, dan ponsel ditinjau untuk memastikan konten terbaca dan muat.

## Horizontal pada seluruh halaman dan ukuran layar

Beranda dan ketiga halaman kamar kini menggunakan viewport horizontal native pada semua ukuran layar. Swipe ponsel, roda mouse, trackpad, keyboard, menu, serta tautan ke galeri dan formulir tetap bekerja. Bagian dengan banyak kartu atau foto memanjang ke samping. Seluruh elemen journey-rail beserta indikator dan navigasinya dihapus dari sumber dan HTML hasil build.

Build berhasil. Sebelas pengujian browser mencakup interaksi hotel, semua rute pada empat ukuran layar, swipe sentuh, galeri, simulasi menginap, dan HTML langsung. Konten pada jendela sangat pendek tetap dapat dibaca melalui area formulir di dalam panel.

## Revisi splash, menu, dan popup

Tombol panah bulat di hero dihapus. Gradasi tipis melembutkan pertemuan slide; bagian kamar memakai putih hangat dengan teks hijau gelap. Splash berlangsung 2,8 detik dan menahan posisi di Arrival agar reload tidak membawa pengunjung ke slide berikutnya. Tautan langsung ke bab tetap berfungsi.

Menu meluas dari ikon selama 1,25 detik, menampilkan teks bertahap, lalu mengecil saat ditutup. Popup kamar memiliki foto besar, fasilitas dalam kartu, harga, dan tombol yang lebih jelas. Perencana menginap menampilkan foto sesuai kamar yang dipilih, sedangkan galeri memakai bingkai gelap dan kontrol yang lebih rapi. Semua popup menyesuaikan layar kecil dan dapat ditutup dengan Escape. Preferensi reduced motion mematikan animasi.

Build berhasil dan 14 pengujian browser lulus. Pengujian baru memeriksa scroll yang tertahan saat splash, reload kembali ke Arrival, durasi menu, pemulihan fokus setelah Escape, serta ukuran popup dan pergantian foto pada layar 320, 390, dan 1440 px di Next.js maupun HTML langsung. Screenshot splash, menu, batas slide, galeri, dan popup ditinjau. Kolom tanggal pada layar terkecil ditata vertikal untuk mencegah konten melebar.

## Logo bersama dan navbar transparan

Logo beserta tagline memakai satu komponen BrandMark di navbar dan splash. Navbar transparan menempatkan logo dan ikon menu sejajar, tetap di viewport saat scroll horizontal, dan menyesuaikan warna pada bagian terang. Label lama SELA HOUSE / BALI dihapus.

Jarak konten dari navbar, proporsi foto, galeri, kartu kamar terkait, dan formulir diperbaiki per ukuran layar. Teks bergerak sedikit saat mouse masuk, kartu terangkat, foto mendapat zoom atau sorotan lembut, dan ikon fasilitas berputar sedikit. Efek hover hanya aktif untuk mouse dan tetap menghormati reduced motion.

Build serta 14 pengujian browser berhasil, dilanjutkan tiga pemeriksaan responsivitas dan swipe setelah tinggi foto disesuaikan. Hover pada judul di 26 section dan reduced motion diperiksa langsung di Chrome tanpa error browser. Tinjauan visual mencakup desktop, tablet, ponsel, dan jendela pendek.

## Animasi kemunculan seluruh section

Judul hero kini muncul dari bawah per baris dengan jeda bertahap setelah splash selesai, termasuk di ponsel. Observer viewport memulai animasi ketika judul, teks, kartu, fasilitas, formulir, dan foto benar-benar masuk layar. Efek berulang setelah konten keluar dan masuk lagi, sehingga perpindahan kembali ke section tetap terasa hidup. Foto mendapat zoom lembut yang terpisah dari parallax dan hover.

Mesin animasi dipakai bersama oleh Next.js dan HTML langsung. Kartu yang muncul setelah perubahan filter ikut dianimasikan. Fokus keyboard langsung memperlihatkan kontrol, klik mouse tetap stabil, dan reduced motion menampilkan konten tanpa gerakan. Tiga pengujian khusus animasi lulus, mencakup urutan hero setelah splash, seluruh 26 section, filter, fokus, dan perubahan preferensi animasi.
