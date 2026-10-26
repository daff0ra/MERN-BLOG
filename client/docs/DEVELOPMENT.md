# Panduan pengembangan client

## Arsitektur saat ini

Aplikasi menggunakan React 19, Vite, React Router, Axios, dan CSS biasa. Alur data dan tampilan dipisahkan agar perubahan bisa direview per bagian.

```text
src/
  App.jsx                 Komposisi dashboard dan orkestrasi aksi
  components/             Kartu artikel dan statistik
  context/AuthContext.jsx Sesi, login, registrasi, logout
  pages/                  Editor, profil, autentikasi, pembacaan artikel
  services/api.js         Satu konfigurasi Axios dan modul endpoint
  styles/                 Gaya dasar, tema, dan breakpoint
```

### Navigasi

`BrowserRouter` berada di entry point `index.jsx`. `App.jsx` membaca `pathname` untuk memilih layar dan menggunakan `navigate()` untuk berpindah halaman. Ini menjaga URL tetap sinkron dengan tombol Back/Forward tanpa listener `popstate` buatan.

- `/dashboard`: daftar karya
- `/dashboard/write`: editor karya
- `/dashboard/profile`: profil penulis
- `/read/:slug`: artikel publik
- Pratinjau menggunakan state navigasi React Router, sehingga URL artikel publik tidak berubah.

### Akses API

Gunakan fungsi dari `services/api.js`. Modul tersebut memakai satu Axios instance dengan `withCredentials`, mengelompokkan request menurut domain (`authApi`, `articleApi`, `profileApi`), serta menyimpan URL endpoint di satu tempat. Komponen boleh menangani state dan pesan yang terlihat pengguna, tetapi tidak membangun URL endpoint sendiri.

Jika endpoint atau payload server berubah, sesuaikan service dan dokumentasikan kontrak baru di sini. Periksa dampaknya pada context dan komponen pemanggil.

## Styling dan desain

- `styles/base.css` memuat aturan dasar layout dan komponen.
- `styles/theme.css` memuat tema Neo-brutalist dan token warna.
- `styles/responsive.css` memuat breakpoint yang menjaga layout pada tablet dan ponsel.
- `index.css` mengimpor stylesheet dalam urutan font, dasar, tema, lalu responsif.
- Pertahankan palet krem dan outline hitam. Untuk aksen gunakan token seperti `--accent-lime`, `--accent-blue`, `--accent-coral`, `--accent-lavender`, `--accent-sand`, dan `--accent-mint`.
- CSS masih global. Saat memindahkan aturan ke CSS Modules, migrasikan satu komponen beserta semua pemakaian class-nya, lalu periksa bahwa tidak ada selector global yang masih dibutuhkan.

## Alur kontribusi

1. Tempatkan tampilan halaman di `pages/`, elemen UI yang dipakai ulang di `components/`, dan request HTTP di `services/`.
2. Hindari memindahkan aturan warna ke inline style; gunakan token tema.
3. Untuk perubahan UI, pertahankan label kontrol, nama tombol yang jelas, dan indikator fokus keyboard.
4. Jalankan `npm run lint` dan `npm run build` dari direktori `client` sebelum review.
5. Perubahan kontrak API harus diselaraskan dengan server dan dicatat dalam dokumentasi.

## Riwayat refaktor

### 2026-10-26

- Memindahkan kartu statistik, kartu artikel, editor, profil, autentikasi, dan tampilan baca ke file tersendiri.
- Memecah stylesheet menjadi dasar, tema, dan breakpoint sambil mempertahankan tampilan yang ada.
- Mencerahkan aksen palet dan memusatkan warna aksen sebagai token tema.
- Menambahkan React Router untuk navigasi URL dan riwayat browser.
- Memusatkan request autentikasi, artikel, dan profil dalam `services/api.js`.
- Menghapus konfigurasi Axios global dari context agar credentials dikonfigurasi pada satu instance.

Pemeriksaan terakhir setelah refaktor: `npm run lint` dan `npm run build` berhasil.
