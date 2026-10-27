# Catatan Refaktor dan Pengembangan Server

Dokumen ini mencatat perubahan struktur dan fitur server yang telah dibuat, alasan di balik keputusan utamanya, serta batas implementasi saat ini.

## Ringkasan

Server dan client berkembang dari fondasi autentikasi menjadi aplikasi awal untuk portofolio naratif:

- Autentikasi register/login/logout dan pemeriksaan sesi memakai JWT di cookie HttpOnly.
- Profil profesional privat yang dapat dibaca dan diperbarui pemiliknya.
- CRUD karya yang dimulai sebagai draft privat.
- Preview khusus pemilik, publikasi eksplisit, unpublish, dan pembacaan karya melalui slug berbagi.
- Test controller dan middleware memakai mock sehingga tidak memerlukan MongoDB untuk unit test.
- Endpoint `GET /robots.txt` memberi crawler arahan untuk tidak mengindeks API.
- Client React terhubung ke API profil/karya, serta menyediakan halaman portofolio publik yang dapat dibagikan.

Portofolio publik hanya menampilkan profil yang diizinkan dan karya yang berstatus public. Draft dan karya private tidak ditampilkan; karya unlisted tetap dapat dibaca melalui slug individual.

## Perubahan struktur

| Bagian | Tanggung jawab setelah pengembangan | Alasan |
|---|---|---|
| `src/models/` | Bentuk dan aturan data MongoDB untuk User dan Article | Aturan data tidak bercampur dengan HTTP |
| `src/controllers/` | Validasi input, alur bisnis, pemanggilan model, dan respons HTTP | Logika tiap fitur lebih mudah dibaca dan diuji |
| `src/routes/` | Memetakan URL/metode HTTP ke middleware dan controller | Daftar endpoint mudah ditemukan |
| `src/middleware/authenticate.js` | Memvalidasi cookie JWT dan memasang user pada request | Satu aturan autentikasi dapat dipakai banyak route |
| `src/utils/auth.js` | Fungsi bersama untuk membuat token dan mengelola cookie | Detail sesi tidak perlu diduplikasi di controller |
| `test/` | Unit test controller, middleware, serta helper mock | Aturan bisnis dapat diperiksa tanpa database hidup |

Penambahan modul utama:

- `src/models/Article.js`, `src/controllers/articleController.js`, `src/routes/articleRoutes.js`
- `src/controllers/profileController.js`, `src/routes/profileRoutes.js`
- `src/routes/publicRoutes.js` untuk membaca karya terbit dan portofolio tanpa login
- `client/src/pages/PublicPortfolio.jsx` dan `client/src/styles/portfolio.css` untuk halaman berbagi portofolio
- `test/articleController.test.js` dan `test/profileController.test.js`

## Keputusan desain penting

### Profil berada di dokumen User

Profil awal berisi nama tampilan, ringkasan, bidang, keahlian, dan tautan. Data ini kecil dan dimiliki satu user, jadi untuk tahap awal disimpan sebagai subdokumen `profile` pada User. Endpoint menggunakan allowlist field supaya klien tidak dapat mengganti email, password, atau data lain melalui endpoint profil.

### Karya menjadi dokumen terpisah

Karya dapat bertambah banyak dan memiliki isi yang lebih besar. Karena itu setiap karya memakai model Article sendiri dengan `owner` yang merujuk ke User. Setiap query privat menyertakan `_id` karya dan `owner` dari sesi. Jika karya tidak ditemukan atau bukan milik pengguna, API mengembalikan 404 yang sama.

### Private sebagai keadaan awal

Karya baru berstatus `draft` dan visibilitas `private`. Pengguna perlu memanggil endpoint publish secara eksplisit untuk mengubahnya menjadi published. Ini menerjemahkan prinsip bisnis “jangan bagikan tulisan tanpa tindakan sadar pemilik” menjadi nilai default dan aturan API.

### Tautan berbagi tidak memakai ID database

Untuk karya unlisted/public, server membuat slug acak dengan `crypto.randomBytes`. Slug disimpan terpisah dari ID MongoDB dan dikembalikan ke pemilik melalui API pengelolaan karya. Pada API publik artikel, slug tidak dikembalikan dalam payload; pada daftar portofolio publik, slug disertakan sebagai metadata navigasi agar kartu dapat membuka karya yang sesuai. Unpublish atau perubahan visibilitas menjadi private menghapus slug agar tautan lama berhenti berfungsi.

### Respons publik memakai allowlist

Endpoint publik membentuk respons berisi judul, isi, ringkasan, topik, nama penulis, dan waktu pembaruan. Ia tidak meneruskan dokumen database utuh, sehingga email, ID internal, dan slug tidak ikut terkirim.

## Endpoint yang tersedia

| Metode dan path | Tujuan | Akses |
|---|---|---|
| `GET /api/profile` | Baca profil sendiri | Login |
| `PATCH /api/profile` | Ubah field profil yang diizinkan | Login |
| `GET /api/profile/portfolio-articles` | Baca daftar karya portofolio beserta urutannya | Login |
| `PATCH /api/profile/portfolio-articles` | Pilih dan urutkan hingga 20 karya public milik sendiri | Login |
| `GET /api/articles` | Daftar karya sendiri | Login |
| `POST /api/articles` | Buat draft | Login |
| `GET /api/articles/:id` | Baca karya sendiri | Login |
| `PATCH /api/articles/:id` | Ubah judul/isi/ringkasan/topik | Login, pemilik |
| `DELETE /api/articles/:id` | Hapus karya | Login, pemilik |
| `GET /api/articles/:id/preview` | Baca pratinjau karya sendiri | Login, pemilik |
| `POST /api/articles/:id/publish` | Terbitkan dengan visibilitas private/unlisted/public | Login, pemilik |
| `POST /api/articles/:id/unpublish` | Kembali ke draft dan cabut slug | Login, pemilik |
| `GET /api/public/articles/:slug` | Baca karya terbit melalui slug | Publik |
| `GET /api/public/portfolios/:id` | Baca profil aktif dan daftar karya public | Publik |

## Validasi yang telah ditambahkan

- Profil dan karya memakai Zod untuk memeriksa bentuk input sebelum akses database.
- Field yang tidak dikenal ditolak pada operasi profil, create/update karya, dan publish.
- Ukuran judul, isi, ringkasan, topik, keahlian, dan jumlah tautan dibatasi.
- Tautan profesional dibatasi ke URL HTTP/HTTPS.
- Request JSON dibatasi 10 KB pada aplikasi Express.
- API publik hanya mencari karya berstatus `published` dengan visibilitas `unlisted` atau `public`.
- Endpoint portofolio hanya memilih metadata karya yang diperlukan untuk kartu; isi lengkap tetap diambil melalui endpoint artikel publik tersendiri.

## Pemeriksaan otomatis

Suite `node --test test/*.test.js` terakhir dijalankan setelah penambahan route robots: **26 test lulus**. Cakupannya meliputi validasi/hashing auth, token, profil, CRUD karya, ownership, preview, publish/unpublish, allowlist respons publik, dan respons endpoint robots.

Unit test memakai mock dan tidak membuktikan bahwa konfigurasi MongoDB, index unik, atau perilaku HTTP end-to-end di deployment sudah benar. Pengujian integrasi database dan UI masih menjadi pekerjaan berikutnya.

## Batas saat ini

- Pemilik dapat memilih dan mengurutkan hingga 20 karya portofolio; drag-and-drop belum tersedia, urutan diatur dengan tombol naik/turun.
- Halaman portofolio memakai ID akun pada URL, belum memakai slug khusus yang mudah dibaca atau kontrol indeks mesin pencari.
- `public` dan `unlisted` saat ini sama-sama dibaca lewat slug. Daftar publik untuk discovery belum dibuat.
- Isi karya diperlakukan sebagai teks biasa; belum ada editor Markdown/rich text atau renderer.
- Kebijakan produk untuk indeks mesin pencari, pelaporan, dan retensi/penghapusan akun masih perlu diputuskan.

## Catatan revisi mendatang: fungsi induk portofolio publik

`readPublicPortfolio()` pada `src/controllers/profileController.js` adalah fungsi induk dan titik paling berpengaruh untuk fitur ini. Fungsi tersebut memeriksa ID dan status publik profil, membaca pilihan karya pemilik, mempertahankan urutannya, lalu memvalidasi ulang status public sebelum mengirim metadata. Revisi berikutnya perlu mempertimbangkan pagination/batas jumlah karya, strategi cache, dan pengujian regresi privasi untuk profil nonaktif serta karya non-public. Perubahan pada fungsi ini berdampak langsung pada privasi seluruh portofolio publik.

Dokumen kebutuhan dan rancangan produk tetap menjadi tujuan yang lebih luas; implementasi berjalan bertahap dan belum seluruh acceptance criteria terpenuhi.
