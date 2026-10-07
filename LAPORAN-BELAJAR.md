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
- `npm.cmd test`: **4 pengujian browser lulus**. Filter/favorit, detail kamar, galeri dan keyboard, perubahan pengalaman, tanggal yang tidak valid, kapasitas kamar, dan total menginap diperiksa pada Next.js serta HTML langsung.
- Layout desktop 1440 px dan ponsel 390 px diperiksa; tidak ada overflow horizontal. Screenshot hasil pengujian telah ditinjau.
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
