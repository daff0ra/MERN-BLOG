# Panduan pengembangan client

## Arsitektur saat ini

Aplikasi menggunakan React 19, Vite, React Router, Axios, Tailwind CSS v4, dan stylesheet CSS untuk tema yang sudah ada.

```text
src/
  App.jsx                 Komposisi dashboard dan orkestrasi aksi
  components/             Kartu artikel dan statistik
  context/AuthContext.jsx Sesi, login, registrasi, logout
  pages/                  Editor, profil, autentikasi, halaman publik
  services/api.js         Satu konfigurasi Axios dan modul endpoint
  styles/
    base/                 Fondasi dan gaya dasar per area
    theme/                Token dan override visual per area
    responsive/           Penyesuaian tablet, ponsel, dan override tema
```

### Navigasi

`BrowserRouter` berada di entry point `index.jsx`. `App.jsx` membaca `pathname` untuk memilih layar dan menggunakan `navigate()` untuk berpindah halaman. Ini menjaga URL tetap sinkron dengan tombol Back/Forward tanpa listener `popstate` buatan.

- `/dashboard`: daftar karya
- `/dashboard/write`: editor karya
- `/dashboard/profile`: profil penulis
- `/read/:slug`: artikel publik
- `/portfolio/:id`: portofolio publik
- Pratinjau menggunakan state navigasi React Router, sehingga URL artikel publik tidak berubah.

### Akses API

Gunakan fungsi dari `services/api.js`. Modul tersebut memakai satu Axios instance dengan `withCredentials`, mengelompokkan request menurut domain (`authApi`, `articleApi`, `profileApi`), serta menyimpan URL endpoint di satu tempat. Komponen boleh menangani state dan pesan yang terlihat pengguna, tetapi tidak membangun URL endpoint sendiri.

Jika endpoint atau payload server berubah, sesuaikan service dan dokumentasikan kontrak baru di sini. Periksa dampaknya pada context dan komponen pemanggil.

## Styling dan desain

- Tailwind CSS v4 dipakai untuk utility layout dan styling halaman baru. Plugin Vite terpasang di `vite.config.js`, sedangkan `index.css` menjadi entry point styling.
- `styles/base/` menyimpan aturan dasar. File dipecah berdasarkan area seperti shell, dashboard, editor, profil, autentikasi, dan halaman baca.
- `styles/theme/` menyimpan token Neo-brutalist dan override tema dengan pembagian area yang sama.
- `styles/responsive/` memuat breakpoint lebar, tablet, ponsel, dan override tema responsif. `index.css` di tiap folder mencatat urutan impor.
- Pertahankan palet krem dan outline hitam. Untuk aksen gunakan token seperti `--accent-lime`, `--accent-blue`, `--accent-coral`, `--accent-lavender`, `--accent-sand`, dan `--accent-mint`.
- Tailwind diimpor dengan mode `important` agar utility dapat digunakan berdampingan dengan selector global yang sudah ada.

## Alur kontribusi

1. Tempatkan tampilan halaman di `pages/`, elemen UI yang dipakai ulang di `components/`, dan request HTTP di `services/`.
2. Gunakan utility Tailwind untuk styling komponen baru. Untuk aturan CSS global yang sudah ada, edit file sesuai area dan hindari menambah override di akhir stylesheet.
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
