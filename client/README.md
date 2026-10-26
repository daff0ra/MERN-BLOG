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
    base.css              Aturan visual utama aplikasi
    theme.css             Token dan lapisan tema Neo-brutalist
    responsive.css        Penyesuaian tablet dan ponsel
  index.css               Font, reset, dan entry point stylesheet
```

### Batas tanggung jawab

- `App.jsx` menghubungkan state layar, navigasi, dan aksi pengguna. React Router mengelola URL serta tombol Back/Forward browser.
- `components/` menyimpan bagian presentasi mandiri seperti kartu karya dan statistik.
- `context/AuthContext.jsx` menangani sesi pengguna dan aksi autentikasi.
- Semua request HTTP melalui `services/api.js`; jangan memanggil Axios langsung dari komponen atau context.
- URL utama: `/dashboard`, `/dashboard/write`, `/dashboard/profile`, dan `/read/:slug`.
- Endpoint publikasi, profil, dan autentikasi didefinisikan berkelompok di modul service. Pertahankan payload sesuai kontrak server.

## Panduan styling

- Pertahankan class semantik yang sudah ada saat memperbarui komponen agar visual dan breakpoint konsisten.
- Aturan dasar dan komponen berada di `styles/base.css`; nilai tema dan override desain berada di `styles/theme.css`; breakpoint berada di `styles/responsive.css`.
- Letakkan token warna baru pada `:root` di `theme.css`, bukan menambah override warna acak. Token aksen yang sudah tersedia meliputi lime, biru, koral, lavender, sand, dan mint.
- Tambahkan aturan breakpoint di `responsive.css`. Gunakan pendekatan mobile-first untuk komponen baru dan pastikan layout tidak melebar pada viewport 320 px.
- Gunakan `:focus-visible`, label yang terhubung ke kontrol, nama tombol yang jelas, dan kontras yang memadai.
- CSS saat ini adalah CSS biasa yang dipecah menurut tanggung jawab file, tanpa framework tambahan. Ini menjaga bundle tetap ramping dan tidak mengubah hasil desain.

## Nilai UI saat ini

Penilaian heuristik berdasarkan implementasi yang tersedia, skala 1–5:

| Aspek | Nilai | Catatan |
| --- | ---: | --- |
| Konsistensi visual | 4/5 | Palet krem, hitam, dan hijau neon konsisten; gaya kartu dan tombol memiliki bahasa yang jelas. |
| Responsif | 3/5 | Breakpoint tablet dan ponsel tersedia. Sidebar menyusut menjadi ikon dan beberapa area beralih ke kolom. |
| Aksesibilitas | 3/5 | Fokus keyboard dan beberapa label/region tersedia; ikon navigasi, dialog publikasi, serta status dinamis masih bisa ditingkatkan. |
| Hierarki dan keterbacaan | 4/5 | Dashboard, statistik, status, dan aksi karya mudah dipindai. Ukuran teks kecil di beberapa metadata perlu dipantau. |
| Pemeliharaan UI | 3,5/5 | Tampilan dipisahkan ke halaman dan komponen; request API dipusatkan dan navigasi memakai React Router. CSS tetap global sehingga masih berpotensi berbenturan. |

Skor umum: **3,5/5**. Ini penilaian heuristik kode dan pola UI, bukan hasil audit pengguna atau pengukuran aksesibilitas otomatis. Prioritas berikutnya: migrasi bertahap ke CSS Modules dan audit navigasi keyboard serta screen reader.

Catatan arsitektur dan alur kontribusi lebih rinci tersedia di [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## Aturan kontribusi

1. Batasi satu komponen pada satu tanggung jawab dan gunakan nama file yang mencerminkan fungsi.
2. Hindari menambahkan aturan CSS di akhir file sebagai override tanpa memperbarui aturan asalnya.
3. Periksa lint dan build sebelum membuka perubahan untuk review.
4. Jika kontrak API berubah, dokumentasikan perubahan bersama endpoint terkait dan selaraskan tipe data antarmuka.
