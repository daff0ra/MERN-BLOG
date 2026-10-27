# Struktur stylesheet

`index.css` memuat Tailwind dan tiga stylesheet aggregator. Urutan impor penting: gaya dasar lebih dulu, override tema setelahnya, lalu breakpoint terakhir.

- `base/`: fondasi, shell aplikasi, komponen umum, dan gaya dasar per halaman.
- `theme/`: token visual dan override Neo-brutalist yang dikelompokkan mengikuti area pada `base/`.
- `responsive/`: aturan tablet, ponsel, lalu override tema responsif. Urutan di `responsive/index.css` mempertahankan cascade breakpoint yang lama.

Saat mengubah selector global yang sudah ada, edit file berdasarkan area, lalu perbarui aggregator jika menambah file. Styling halaman baru sebaiknya memakai utility Tailwind di komponennya.
