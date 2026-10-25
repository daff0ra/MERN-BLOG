# PCD — Product Concept Document

**Nama kerja:** Ruang Karya  
**Versi:** 0.1 — rancangan awal  
**Status:** perlu validasi dengan calon pengguna dan reviewer  
**Pemilik produk:** TBD

## 1. Ringkasan

Ruang Karya adalah aplikasi untuk membantu seseorang menyusun tulisan dan bukti kerja menjadi portofolio profesional yang dapat dibagikan. Kandidat dapat menceritakan cara berpikir, pengalaman, kemampuan, dan pemahamannya melalui tulisan yang dipilih sendiri. Portofolio menjadi bahan pendamping lamaran kerja dan percakapan interview, sehingga kemampuan kandidat dapat dinilai melalui contoh yang lebih kaya daripada jawaban singkat saat interview.

Produk tidak menjamin kandidat diterima dan tidak menggantikan CV, referensi, tes, atau interview. Kandidat tetap memegang kendali atas apa yang dipublikasikan dan kepada siapa tautan dibagikan.

## 2. Masalah dan peluang

Interview berdurasi terbatas dan dapat dipengaruhi kecemasan, gaya komunikasi, aksesibilitas, perbedaan bahasa, atau situasi saat itu. Akibatnya, pengalaman dan pola pikir seseorang belum tentu terlihat utuh. Di sisi lain, tulisan kandidat tersebar di berbagai tempat dan sulit dipilih serta disajikan secara terarah kepada perekrut.

Peluangnya adalah memberi kandidat ruang untuk menyusun narasi dan contoh kerja secara bertahap, lalu memberi reviewer satu tempat untuk memahami konteks, proses, kontribusi, dan refleksi kandidat.

## 3. Visi dan proposisi nilai

**Visi:** setiap kandidat dapat menunjukkan potensi melalui karya dan pemikiran yang mereka pilih sendiri.

- **Kandidat:** menulis dengan ritme sendiri, mengkurasi karya, dan membagikan profil yang profesional.
- **Reviewer/perekrut:** memperoleh konteks dan contoh kerja yang terstruktur sebelum atau sesudah interview.
- **Tim perekrutan:** memiliki bahan diskusi yang lebih konsisten, dengan tetap melakukan penilaian manusia dan proses seleksi yang adil.

## 4. Persona awal

### Kandidat / penulis

Ingin menunjukkan kompetensi dengan bukti dan refleksi, tetapi kesulitan merangkai pengalaman menjadi cerita yang mudah dinilai. Membutuhkan editor sederhana, kendali privasi, dan tautan yang layak dibagikan.

### Reviewer / perekrut / hiring manager

Memerlukan gambaran ringkas tentang kandidat dan beberapa tulisan relevan. Tidak ingin menghadapi halaman yang sulit dinavigasi, klaim tanpa konteks, atau data pribadi yang tidak berkaitan dengan pekerjaan.

## 5. Prinsip produk

1. **Kendali ada pada penulis:** setiap karya memiliki status dan audiens yang jelas.
2. **Bukti lebih kuat daripada label:** dorong konteks, kontribusi, proses, hasil, dan refleksi; jangan menyamakan klaim dengan verifikasi.
3. **Aman secara default:** tulisan baru bersifat draft/pribadi; publikasi memerlukan tindakan eksplisit.
4. **Aksesibel dan tidak menghukum gaya komunikasi:** bahasa sederhana, navigasi keyboard, dan pengalaman membaca yang baik.
5. **Reviewer tetap manusia:** produk menyajikan bahan, bukan memberi skor kelayakan atau keputusan otomatis.
6. **Privasi minimal:** jangan meminta data sensitif yang tidak diperlukan untuk portofolio.

## 6. Ruang lingkup

### MVP

- Akun kandidat dan autentikasi.
- Profil profesional dasar: nama tampilan, ringkasan, bidang/keahlian pilihan, dan tautan opsional.
- CRUD tulisan: judul, isi, ringkasan, topik, dan status draft/published.
- Pratinjau dan publikasi karya secara eksplisit.
- Halaman portofolio publik dengan karya terpilih serta tautan yang dapat dibagikan.
- Pilihan privasi minimum: private (draft), unlisted (akses melalui tautan), public (dapat ditemukan melalui URL publik; indeks mesin pencari dikendalikan terpisah).
- Aksi unpublish dan penghapusan konten.
- Pelaporan konten dan jalur dukungan administratif dasar.
- Pengalaman responsif dan aksesibel.

### Di luar MVP

- Marketplace lowongan dan lamaran kerja di dalam platform.
- Endorsement atau verifikasi kompetensi oleh pihak ketiga.
- Ranking kandidat, rekomendasi otomatis, skor AI, atau penyaringan kandidat.
- Pesan langsung, komentar publik, monetisasi kreator, dan analitik perekrut yang invasif.
- Klaim bahwa tulisan merupakan karya asli/terverifikasi tanpa mekanisme pembuktian.

## 7. Alur nilai utama

1. Kandidat membuat akun dan melengkapi profil minimum.
2. Kandidat menulis satu atau beberapa karya sebagai draft.
3. Kandidat memilih karya yang relevan, memperbaiki konteks, lalu melihat pratinjau.
4. Kandidat menerbitkan karya dan portofolio dengan tingkat akses yang dipilih.
5. Kandidat menyalin tautan untuk disertakan pada lamaran atau dibagikan kepada reviewer.
6. Reviewer membaca profil dan karya tanpa harus membuat akun untuk konten publik/unlisted.
7. Kandidat dapat memperbarui, membatasi akses, atau menghapus karya.

## 8. Indikator keberhasilan awal

Target numerik ditetapkan setelah baseline dan riset pilot, bukan diasumsikan di awal.

- **Aktivasi:** persentase akun kandidat yang membuat dan memublikasikan portofolio pertama.
- **Penyelesaian portofolio:** persentase profil aktif dengan minimal satu karya terbit.
- **Kegunaan reviewer:** reviewer dapat menemukan konteks dan karya relevan tanpa bantuan penulis.
- **Kendali privasi:** keberhasilan pengguna mengubah private/unlisted/public dan menarik publikasi.
- **Kepercayaan:** tingkat pemahaman pengguna tentang siapa yang dapat melihat kontennya.
- **Kualitas layanan:** ketersediaan, waktu muat halaman publik, dan tingkat error API.
- **Keamanan:** insiden akses tanpa izin dan paparan data pribadi yang tidak diinginkan.

## 9. Asumsi dan validasi

- Kandidat bersedia menulis bila pengalaman menulis dan publikasi terasa aman serta tidak memberatkan.
- Reviewer bersedia membaca tulisan terkurasi bila relevan, ringkas untuk dinavigasi, dan terhubung dengan kompetensi yang dibutuhkan.
- Tautan portofolio dapat melengkapi, bukan menggantikan, kanal lamaran yang sudah digunakan.

Validasikan melalui wawancara kandidat dan reviewer, uji prototipe, lalu pilot kecil. Cari tahu jenis tulisan yang paling membantu, kebutuhan aksesibilitas, siklus lamaran, dan preferensi privasi.

## 10. Risiko produk utama

- Tulisan memuat rahasia perusahaan, data pribadi, atau karya pihak lain.
- Kandidat mengira publikasi otomatis berarti klaim telah diverifikasi.
- Reviewer menilai kemampuan menulis sebagai pengganti semua jenis kompetensi.
- Kandidat merasa harus membagikan informasi pribadi agar dianggap layak.
- Tautan unlisted diteruskan kepada orang lain.

Mitigasi dan kontrol operasional dibahas dalam [delivery readiness](./delivery-readiness.md) dan [DFO](./data-flow-overview.md).
