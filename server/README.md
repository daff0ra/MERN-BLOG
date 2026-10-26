# MERN API

## Dokumen produk

Rancangan pengembangan aplikasi menjadi portofolio naratif profesional tersedia di [`docs/`](./docs/README.md): konsep produk (PCD), kebutuhan pengguna, user story dan acceptance criteria, aliran data (DFO), serta persiapan delivery. Dokumen tersebut adalah rancangan target; implementasi saat ini mencakup autentikasi, profil dasar, draft karya, dan publikasi karya individual.

Catatan struktur perubahan ada di [`docs/refactor-notes.md`](./docs/refactor-notes.md). Panduan belajar lokal tersimpan di `docs/learning-guide.md` dan sengaja masuk `.gitignore`, jadi tidak diikutkan dalam commit Git.

## Yang sudah dikembangkan

- Alur register, login, logout, dan pemeriksaan sesi (`/me`) menggunakan JWT dalam cookie HttpOnly.
- Model user MongoDB dengan email unik dan password yang di-hash menggunakan bcrypt.
- Validasi request, middleware autentikasi, pembatasan percobaan auth, CORS, Helmet, dan penanganan error API.
- Vite client mem-proxy request `/api` ke server pada development.
- Endpoint profil profesional privat (`GET` dan `PATCH /api/profile`) dengan allowlist field dan validasi.
- CRUD karya dan draft privat (`/api/articles`), preview pemilik, serta publish/unpublish dengan pemeriksaan kepemilikan.
- `GET /robots.txt` menyajikan arahan crawler agar tidak mengindeks endpoint API.
- Test auth, profil, dan karya dengan mock database, serta test endpoint robots. Jalankan dengan `npm test`.

Test saat ini mencakup validasi dan hashing register, email duplikat, login berhasil/gagal, logout, respons user publik, autentikasi token, validasi profil, CRUD karya, pemeriksaan kepemilikan, aturan preview/publikasi, dan endpoint robots.

## Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and a random `JWT_SECRET` (at least 32 characters).
2. Run `npm install` and `npm run dev` from this directory.
3. The API listens on port 5000 by default. Set `CLIENT_ORIGIN` to the client origin when it differs from `http://localhost:5173`.

## Authentication flow

- `POST /api/auth/register` accepts `{ "username", "email", "password" }`, hashes the password with bcrypt, creates the user, sets an HttpOnly JWT cookie, and returns the public user.
- `POST /api/auth/login` accepts `{ "email", "password" }` and returns the same public user shape with a new cookie.
- `POST /api/auth/logout` clears the cookie. A GET alias remains for the starter client compatibility; clients should migrate to POST.
- `GET /api/auth/me` verifies the cookie and returns the current public user.
- `GET /api/profile` returns the authenticated user's professional profile. `PATCH /api/profile` updates one or more of `displayName`, `summary`, `field`, `skills` (up to 10), and `links` (up to 5 valid URLs). Unknown fields are rejected.
- `GET/POST /api/articles`, `GET/PATCH/DELETE /api/articles/:id` manage the authenticated user's articles. `GET /api/articles/:id/preview` is owner-only. `POST /api/articles/:id/publish` accepts `{ "visibility": "private" | "unlisted" | "public" }`; `POST /api/articles/:id/unpublish` returns the article to a private draft and revokes its share slug. New drafts require a title and body; optional summary and topics are validated. Article ownership cannot be supplied or changed by the client.
- `GET /api/public/articles/:slug` serves only published unlisted/public articles and returns an allowlisted author/content shape. Unlisted and public content can be read by anyone with its generated slug; public portfolio discovery/listing is not implemented yet. Article bodies are returned as plain text and clients must render them as text, not raw HTML.
- `GET /api/health` is a basic health check.
- `GET /robots.txt` returns plain-text crawler rules with `/api/` disallowed. Robots rules are advisory and do not replace authentication or authorization.

Authentication endpoints have an IP rate limit. Passwords are never returned, and the model excludes password hashes from normal queries. Cookie security is enabled in production; serve the API over HTTPS and set the correct `CLIENT_ORIGIN` there.

Vite client mem-proxy `/api` ke `http://localhost:5000` selama development. Restart Vite setelah mengubah konfigurasi proxy. Untuk deployment, arahkan client ke API yang sesuai dan aktifkan pengiriman credentials.
