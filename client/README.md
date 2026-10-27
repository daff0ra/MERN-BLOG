# Ruang Karya client

Frontend aplikasi Ruang Karya dibangun dengan React 19 dan Vite. Dokumentasi ini menjelaskan struktur client, alur pengembangan, aturan styling, serta evaluasi UI saat ini.

## Menjalankan client

```powershell
cd client
npm install
npm run dev
```

Perintah lain: `npm run lint`, `npm run build`, dan `npm run preview`.

Client mengharapkan API tersedia di origin yang sama melalui proxy/deployment. Pastikan server berjalan dan konfigurasi Vite atau reverse proxy mengarahkan `/api` ke server.

## Struktur sumber

```text
src/
  App.jsx                 Pengendali alur dashboard dan permintaan API
  components/             Komponen UI yang dapat dipakai ulang
  context/                State autentikasi lintas halaman
  pages/                  Tampilan tingkat halaman
  services/api.js         Modul akses endpoint dan konfigurasi Axios
  styles/
    base/                 Fondasi dan gaya dasar per area
    theme/                Token dan override tema per area
    responsive/           Breakpoint tablet, ponsel, dan override tema
  index.css               Font, reset, dan entry point stylesheet
```

### Batas tanggung jawab

- `App.jsx` menghubungkan state layar, navigasi, dan aksi pengguna. React Router mengelola URL serta tombol Back/Forward browser.
- `components/` menyimpan bagian presentasi mandiri seperti kartu karya dan statistik.
- `context/AuthContext.jsx` menangani sesi pengguna dan aksi autentikasi.
- Semua request HTTP melalui `services/api.js`; jangan memanggil Axios langsung dari komponen atau context.
- URL utama: `/dashboard`, `/dashboard/write`, `/dashboard/profile`, `/read/:slug`, dan `/portfolio/:id`.
- Endpoint publikasi, profil, dan autentikasi didefinisikan berkelompok di modul service. Pertahankan payload sesuai kontrak server.

### Route halaman publik

| Halaman frontend | API publik | Cara navigasi di UI |
| --- | --- | --- |
| `/read/:slug` | `GET /api/public/articles/:slug` | Dashboard menyediakan **Buka artikel** dan **Salin tautan** untuk karya terbit. Karya public dan unlisted dapat dibaca lewat slug; karya private tidak memiliki tautan publik. |
| `/portfolio/:id` | `GET /api/public/portfolios/:id` | Dashboard menyediakan tautan portofolio, dan halaman profil menyediakan **Lihat portofolio publik** ketika portofolio diaktifkan. Kartu karya pada portofolio membuka `/read/:slug`. Pilihan dan urutan diatur dari halaman profil melalui `GET/PATCH /api/profile/portfolio-articles`. |

Di halaman artikel, tautan **Lihat portofolio penulis** hanya muncul jika penulis mengaktifkan portofolio publik. Dengan begitu, navigasi publik mengikuti pilihan privasi pemilik.

## Panduan styling

- Pertahankan class semantik yang sudah ada saat memperbarui komponen agar visual dan breakpoint konsisten.
- Aturan dasar dipecah menurut area di `styles/base/`; nilai tema dan override berada di `styles/theme/`; breakpoint berada di `styles/responsive/`. File `index.css` pada setiap folder mengatur urutan impor.
- Letakkan token warna baru pada `:root` di `styles/theme/tokens.css`, bukan menambah override warna acak. Token aksen yang sudah tersedia meliputi lime, biru, koral, lavender, sand, dan mint.
- Tambahkan aturan breakpoint di file yang sesuai dalam `styles/responsive/`. Gunakan pendekatan mobile-first untuk komponen baru dan pastikan layout tidak melebar pada viewport 320 px.
- Gunakan `:focus-visible`, label yang terhubung ke kontrol, nama tombol yang jelas, dan kontras yang memadai.
- Tailwind CSS v4 digunakan untuk layout halaman portofolio dan pemilihan karya. Styling dasar aplikasi tetap memakai token dan stylesheet global yang sudah ada.

## Nilai UI saat ini

Penilaian heuristik berdasarkan implementasi yang tersedia, skala 1–5:

| Aspek | Nilai | Catatan |
| --- | ---: | --- |
| Konsistensi visual | 4/5 | Palet krem, hitam, dan hijau neon konsisten; gaya kartu dan tombol memiliki bahasa yang jelas. |
| Responsif | 3/5 | Breakpoint tablet dan ponsel tersedia. Sidebar menyusut menjadi ikon dan beberapa area beralih ke kolom. |
| Aksesibilitas | 3/5 | Fokus keyboard dan beberapa label/region tersedia; beberapa elemen dashboard dan input editor masih memerlukan audit lanjutan. |
| Hierarki dan keterbacaan | 4/5 | Dashboard, statistik, status, dan aksi karya mudah dipindai. Ukuran teks kecil di beberapa metadata perlu dipantau. |
| Pemeliharaan UI | 3,5/5 | Tampilan dipisahkan ke halaman dan komponen; halaman portofolio menggunakan utility Tailwind, sedangkan tampilan lama masih memakai stylesheet global. |

Skor umum: **3,5/5**. Ini penilaian heuristik kode dan pola UI, bukan hasil audit pengguna atau pengukuran aksesibilitas otomatis. Prioritas berikutnya: perluas penggunaan utility Tailwind saat halaman lama disentuh dan lanjutkan audit keyboard serta screen reader pada komponen lain.

Catatan arsitektur dan alur kontribusi lebih rinci tersedia di [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## Aturan kontribusi

1. Batasi satu komponen pada satu tanggung jawab dan gunakan nama file yang mencerminkan fungsi.
2. Hindari menambahkan aturan CSS di akhir file sebagai override tanpa memperbarui aturan asalnya.
3. Periksa lint dan build sebelum membuka perubahan untuk review.
4. Jika kontrak API berubah, dokumentasikan perubahan bersama endpoint terkait dan selaraskan tipe data antarmuka.
