# Kebutuhan Pengguna, User Story, dan Acceptance Criteria

**Versi:** 0.1 — baseline MVP  
Kriteria di bawah adalah kriteria penerimaan sistem yang bisa diuji. `MUST` berarti wajib untuk MVP; `SHOULD` berarti penting tetapi dapat dijadwalkan setelah MVP.

## 1. Kebutuhan pengguna

| ID | Kebutuhan | Prioritas | Hasil yang diharapkan |
|---|---|---|---|
| UN-01 | Sebagai kandidat, saya perlu membuat akun dan masuk dengan aman. | MUST | Hanya pemilik akun yang dapat mengelola profil dan draftnya. |
| UN-02 | Saya perlu menulis, menyimpan, mengedit, dan menghapus tulisan. | MUST | Saya dapat menyusun portofolio secara bertahap. |
| UN-03 | Saya perlu menjelaskan konteks, kontribusi, proses, hasil, dan refleksi. | MUST | Reviewer memahami bagaimana kemampuan digunakan, bukan hanya membaca klaim. |
| UN-04 | Saya perlu menentukan karya mana yang dibagikan dan kepada siapa. | MUST | Draft tidak tampil ke publik; karya dapat dipublikasikan atau ditarik kembali. |
| UN-05 | Saya perlu membagikan satu tautan portofolio yang mudah dinavigasi. | MUST | Reviewer dapat memahami profil dan membuka karya pilihan. |
| UN-06 | Saya perlu melihat pratinjau sebelum menerbitkan. | MUST | Kesalahan dan informasi sensitif dapat diperiksa lebih dulu. |
| UN-07 | Sebagai reviewer, saya perlu membaca karya tanpa membuat akun untuk akses publik/unlisted. | MUST | Hambatan membaca rendah; batas akses tetap dihormati. |
| UN-08 | Saya perlu meminta penghapusan akun dan data. | MUST | Pengguna memiliki jalur penghapusan yang dapat dipahami. |
| UN-09 | Saya perlu mengetahui apakah profil saya ditemukan melalui mesin pencari. | SHOULD | Ekspektasi keterlihatan jelas dan bisa diubah. |
| UN-10 | Saya perlu pengalaman yang dapat digunakan dengan keyboard dan pembaca layar. | MUST | Alur inti tidak bergantung pada mouse atau warna saja. |

## 2. User stories

### Akun dan identitas

- **US-01:** Sebagai kandidat, saya ingin mendaftar dengan email dan kata sandi agar dapat memiliki ruang portofolio pribadi.
- **US-02:** Sebagai kandidat, saya ingin masuk dan keluar dengan aman agar hanya saya yang mengelola konten pribadi.
- **US-03:** Sebagai kandidat, saya ingin mengubah nama tampilan dan ringkasan profesional agar profil saya sesuai tujuan lamaran.

### Menulis dan mengelola karya

- **US-04:** Sebagai kandidat, saya ingin membuat draft dengan judul, isi, dan topik agar saya dapat menyusun gagasan secara bertahap.
- **US-05:** Sebagai kandidat, saya ingin mengedit atau menghapus karya saya agar isi portofolio tetap akurat.
- **US-06:** Sebagai kandidat, saya ingin melihat pratinjau agar dapat memeriksa tampilan dan informasi sebelum publikasi.
- **US-07:** Sebagai kandidat, saya ingin mengaitkan tulisan dengan konteks pengalaman atau kompetensi agar reviewer memahami kontribusi saya.

### Privasi dan berbagi

- **US-08:** Sebagai kandidat, saya ingin memilih private, unlisted, atau public untuk setiap karya agar jangkauan pembaca sesuai niat saya.
- **US-09:** Sebagai kandidat, saya ingin menarik publikasi atau menonaktifkan tautan agar saya dapat mengubah keputusan berbagi.
- **US-10:** Sebagai kandidat, saya ingin memilih karya yang tampil di halaman portofolio agar tautan lamaran menampilkan cerita paling relevan.
- **US-11:** Sebagai reviewer, saya ingin membaca profil dan karya yang dibagikan tanpa login agar saya dapat meninjau kandidat dengan mudah.
- **US-12:** Sebagai pengguna, saya ingin melaporkan konten yang melanggar hak atau memuat informasi sensitif agar tim dapat menindaklanjuti.

## 3. Acceptance criteria sistem

### AC-AUTH — register/login

**Given** pengunjung mengirim detail akun valid, **when** registrasi berhasil, **then** akun tersimpan, kata sandi disimpan sebagai hash, sesi dibuat melalui cookie HttpOnly, dan respons tidak memuat kata sandi/hash.  
**Given** email sudah terdaftar, **when** registrasi dikirim, **then** sistem mengembalikan konflik yang konsisten dan tidak membuat akun kedua.  
**Given** kredensial salah, **when** login dicoba, **then** sistem mengembalikan pesan generik tanpa membedakan apakah email terdaftar.  
**Given** jumlah percobaan melampaui batas, **when** permintaan auth berikutnya masuk dalam jendela pembatasan, **then** sistem menolak sementara dan memberi pesan retry yang aman.  
**Given** logout berhasil, **when** token lama dipakai untuk endpoint terlindungi, **then** akses ditolak setelah cookie dihapus dari client.

### AC-WRITE — draft dan kepemilikan

**Given** kandidat yang sudah login, **when** ia membuat karya dengan input valid, **then** karya tersimpan dengan status private/draft secara default dan pemilik sesuai sesi.  
**Given** pengguna A meminta, mengubah, atau menghapus karya milik pengguna B, **when** API menerima permintaan itu, **then** sistem menolak tanpa membocorkan isi karya B.  
**Given** isi atau judul tidak memenuhi batas validasi, **when** disimpan, **then** API mengembalikan error validasi yang dapat ditindaklanjuti dan data lama tidak tertimpa.  
**Given** penulis menghapus karya, **when** penghapusan dikonfirmasi, **then** karya tidak lagi dapat dibaca melalui dashboard maupun URL publik.

### AC-PUBLISH — publikasi dan privasi

**Given** draft private, **when** pihak tanpa otorisasi meminta URL karya, **then** konten tidak diberikan dan respons tidak mengungkap keberadaan draft.  
**Given** penulis mengubah karya menjadi unlisted, **when** pembaca memiliki tautan berbagi yang benar, **then** karya dapat dibaca; karya tidak dicantumkan di daftar publik atau sitemap.  
**Given** karya public, **when** pembaca membuka profil/portofolio publik, **then** hanya karya public yang tampil.  
**Given** karya published ditarik kembali atau diubah menjadi private, **when** URL lama diminta, **then** konten tidak lagi disajikan pada permintaan berikutnya.  
**Given** penulis memublikasikan karya, **when** sistem menyimpan perubahan, **then** penulis melihat status dan audiens sebelum/ketika konfirmasi.

### AC-PORTFOLIO — halaman yang dibagikan

**Given** portofolio aktif, **when** reviewer membuka tautannya tanpa login, **then** reviewer dapat melihat nama tampilan, ringkasan yang dipilih, dan karya yang secara eksplisit disertakan.  
**Given** portofolio tidak aktif atau slug tidak valid, **when** URL diminta, **then** sistem memberi halaman tidak ditemukan yang tidak mengungkap data privat.  
**Given** penulis mengubah urutan atau pilihan karya, **when** perubahan disimpan, **then** urutan/daftar publik mengikuti konfigurasi terbaru.

### AC-PRIVACY — perlindungan data

**Given** endpoint memerlukan identitas, **when** request tidak memiliki sesi valid, **then** endpoint mengembalikan 401.  
**Given** respons API dikirim, **when** memuat objek user/karya, **then** respons hanya memuat field yang diperlukan dan tidak pernah memuat hash kata sandi atau token rahasia.  
**Given** pengguna meminta penghapusan akun, **when** prosedur penghapusan selesai, **then** profil dan karya yang terkait tidak lagi dapat diakses sesuai kebijakan retensi yang diumumkan.

### AC-A11Y — aksesibilitas dan kualitas

**Given** pengguna menavigasi alur daftar, login, tulis, pratinjau, dan publikasi, **when** hanya menggunakan keyboard, **then** semua kontrol penting dapat dijangkau dan fokus terlihat.  
**Given** validasi gagal, **when** error ditampilkan, **then** pesan terhubung ke field terkait dan dapat dibaca teknologi bantu.  
**Given** halaman publik dibuka di layar kecil, **when** konten panjang dibaca, **then** tidak ada scroll horizontal yang menghalangi konten utama.

## 4. Kebutuhan fungsional

- **FR-01 (MUST):** autentikasi, otorisasi berbasis kepemilikan, dan sesi.
- **FR-02 (MUST):** CRUD profil dan karya dengan validasi server.
- **FR-03 (MUST):** status private, unlisted, public, serta transisi publish/unpublish yang eksplisit.
- **FR-04 (MUST):** portofolio publik yang menampilkan hanya data terpilih.
- **FR-05 (MUST):** sanitasi output/rendering konten untuk mencegah XSS.
- **FR-06 (MUST):** penghapusan karya dan jalur permintaan penghapusan akun.
- **FR-07 (SHOULD):** status indeks mesin pencari dan metadata preview yang dapat dikendalikan.
- **FR-08 (SHOULD):** pelaporan konten dan alur admin untuk moderasi.
- **FR-09 (SHOULD):** autosave draft dengan indikator status dan penanganan konflik perubahan.

## 5. Kebutuhan nonfungsional

- **NFR-01 Keamanan:** gunakan HTTPS, cookie HttpOnly/Secure/SameSite sesuai deployment, validasi input, rate limit, proteksi XSS, pengamanan header, dan manajemen secret di luar source control.
- **NFR-02 Privasi:** default private, minimisasi data, kontrol akses diuji, dan kebijakan retensi/penghapusan diumumkan.
- **NFR-03 Kinerja:** target awal p95 API baca/tulis < 500 ms pada beban pilot yang disepakati; halaman portofolio utama p95 < 2,5 s pada profil perangkat/jaringan yang disepakati.
- **NFR-04 Ketersediaan:** target pilot awal 99,5% bulanan setelah monitoring dan prosedur incident siap.
- **NFR-05 Aksesibilitas:** target WCAG 2.2 AA untuk alur inti; audit manual keyboard dan screen reader selain pemeriksaan otomatis.
- **NFR-06 Kompatibilitas:** dukung dua versi mayor browser desktop/mobile yang disepakati saat peluncuran.
- **NFR-07 Maintainability:** API tervalidasi, pemisahan route/controller/model, migrasi/indeks terkelola, test otomatis, dan log terstruktur tanpa secret.
- **NFR-08 Pemulihan:** backup database terenkripsi dan uji restore berkala; tetapkan RPO/RTO sebelum produksi.

Target numerik di atas adalah baseline usulan dan perlu disetujui product/engineering sebelum menjadi SLO produksi.
