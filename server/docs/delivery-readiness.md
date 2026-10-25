# Persiapan Delivery dan Kesiapan Produk

**Versi:** 0.1 — rancangan awal  
Dokumen ini melengkapi PCD, kebutuhan, dan DFO. Keputusan bertanda **TBD** perlu ditetapkan sebelum fitur terkait masuk produksi.

## 1. Rencana bertahap

### Fase 0 — Validasi masalah

- Wawancarai kandidat dari beberapa tingkat pengalaman dan bidang.
- Wawancarai recruiter/hiring manager tentang bahan yang membantu menilai kandidat dan batas waktu membaca.
- Uji prototipe alur menulis, memilih privasi, dan berbagi.
- Validasi bahasa produk: “portofolio naratif” sebagai pelengkap lamaran, bukan bukti kompetensi yang diverifikasi.
- Hasil: keputusan MVP, persona yang tervalidasi, baseline indikator, dan prioritas aksesibilitas.

### Fase 1 — Fondasi aman

- Tetapkan schema user/profile/article, validasi request, otorisasi ownership, dan migration/index strategy.
- Implementasikan CRUD draft, preview, status privasi, portofolio publik, serta publish/unpublish.
- Tetapkan rendering teks aman, batas ukuran konten, dan penghapusan.
- Tambahkan test unit untuk aturan domain/controller dan test integrasi untuk boundary database/API.

### Fase 2 — Pilot terbatas

- Onboard kelompok kandidat kecil dan reviewer sukarela.
- Uji alur publikasi, link sharing, akses keyboard/mobile, dan pemahaman privasi.
- Pantau error, performa, laporan konten, permintaan penghapusan, dan kebingungan pengguna.
- Tinjau hasil bersama product/design/engineering sebelum memperluas akses.

### Fase 3 — Persiapan rilis

- Selesaikan threat model, privacy review, incident runbook, backup restore drill, monitoring, alert, dan support workflow.
- Verifikasi kebijakan privasi/retensi/hak cipta yang berlaku untuk wilayah operasi oleh pihak yang tepat.
- Rilis bertahap dengan rollback dan komunikasi perubahan.

## 2. Keputusan yang perlu dibuat

| Keputusan | Opsi awal | Pemilik yang disarankan | Kapan |
|---|---|---|---|
| Pengguna utama awal | Kandidat tech / semua bidang | Product | Sebelum validasi prototipe |
| Bahasa dan pasar pertama | Indonesia dahulu / multi-bahasa | Product + Research | Sebelum pilot |
| Profil dapat dicari mesin pencari | Opt-in public / noindex default | Product + Privacy | Sebelum public launch |
| Tautan unlisted | Slug acak revocable / secret URL | Engineering + Security | Sebelum implementasi berbagi |
| Format konten | Markdown terbatas / rich text sanitasi | Design + Engineering | Sebelum editor dibangun |
| Upload gambar/file | Tidak ada di MVP / gambar terbatas | Product + Security | MVP scope lock |
| Retensi akun terhapus dan backup | Jadwal retensi terdefinisi | Legal/Privacy + Engineering | Sebelum pilot |
| Moderasi dan dukungan | Email/portal internal, SLA awal | Operations | Sebelum karya publik tersedia |
| SLO produksi dan RPO/RTO | Target terukur setelah beban pilot | Engineering/Ops | Sebelum production |

## 3. Backlog awal

### Must untuk MVP

- Profil dan dashboard pemilik.
- CRUD draft dengan validasi panjang, batas request, dan indikator status simpan.
- Editor teks yang tidak menerima HTML mentah tanpa sanitasi.
- Preview yang identik/serupa dengan tampilan publik.
- Publish/unpublish dan status private/unlisted/public yang jelas.
- Portofolio shareable dan halaman publik yang hanya menyajikan field/karya terpilih.
- Kontrol kepemilikan pada seluruh operasi mutasi dan pembacaan privat.
- Permintaan penghapusan karya dan akun, plus kebijakan retensi yang transparan.
- Test unit, integrasi, dan pemeriksaan aksesibilitas untuk alur inti.

### Could setelah MVP

- Tag/kompetensi dan pengurutan karya.
- Template refleksi (situasi, tujuan, tindakan, hasil, pembelajaran) yang opsional, bukan wajib.
- Metadata sosial dan kontrol mesin pencari.
- Beberapa versi portofolio untuk jenis lamaran berbeda.
- Analitik agregat yang menghormati privasi dan tidak melakukan tracking reviewer secara tersembunyi.

## 4. Risiko dan mitigasi operasional

| Risiko | Mitigasi produk/teknis | Sinyal pemantauan |
|---|---|---|
| Draft bocor | Private default, owner checks, test negatif lintas pemilik, serializer allowlist | Alert akses 401/403/404 abnormal, audit sampel |
| XSS dari konten | Plain text/Markdown terbatas, sanitasi saat render, CSP | Dependency/security scanning dan uji payload |
| Rahasia/PII terbit | Checklist sebelum publish, preview, report/takedown, edukasi | Jumlah laporan, waktu takedown |
| Tautan unlisted tersebar | Token acak, pencabutan, penjelasan risiko, noindex | Penggunaan/rotasi token agregat tanpa identitas pembaca |
| Data hilang | Backup terenkripsi, restore drill, versioning/soft delete sesuai kebijakan | Backup success dan hasil uji restore |
| Bias penilaian | Tidak memberi skor/ranking; jelaskan konteks; uji dengan reviewer beragam | Riset kualitatif dan feedback kandidat |
| Abuse/spam | Rate limit, laporan, proses moderasi dan blokir | Volume laporan dan waktu respons |

## 5. Instrumentasi dan privasi analitik

Kumpulkan event minimum yang membantu memahami keberhasilan: `portfolio_created`, `article_draft_saved`, `article_published`, `portfolio_shared`, `article_unpublished`, dan `account_deletion_requested`. Hindari mengirim isi tulisan, email, token, atau URL unlisted mentah ke analytics/log. Tetapkan consent, retensi, akses, dan agregasi sebelum mengaktifkan analytics.

## 6. Definition of Ready

Story siap dikerjakan bila:

- Aktor, masalah, dan hasil pengguna jelas.
- Acceptance criteria positif, negatif, dan batas privasi tersedia.
- Desain state/error/loading dan aksesibilitas alur utama tersedia.
- Perubahan data, otorisasi, validasi, serta kebutuhan migrasi/index teridentifikasi.
- Dependency, risiko keamanan/privacy, dan rencana test diketahui.
- Event analitik (jika ada) telah diminimalkan dan disetujui.

## 7. Definition of Done

Story selesai bila:

- Acceptance criteria lulus dan tidak ada akses lintas pemilik.
- Unit/integration test relevan lulus; regression test ditambahkan untuk bug yang diperbaiki.
- Validasi, sanitasi, error response, loading/empty state, dan logging aman tersedia.
- Keyboard, focus, label/error screen reader, responsivitas, dan kontras alur inti ditinjau.
- Dokumentasi API/data/privacy diperbarui.
- Monitoring, rollback, dan migrasi aman tersedia bila perubahan berdampak ke produksi.
- Tidak ada secret atau konten pengguna sensitif dalam log, analytics, fixture, atau screenshot.

## 8. Kesiapan produksi

Sebelum membuka portofolio publik secara luas, pastikan tersedia:

- Privacy notice, terms/content policy, hak cipta/takedown, dan mekanisme penghapusan yang ditinjau sesuai yurisdiksi.
- Threat model untuk auth cookie/CSRF, konten buatan user, akses unlisted, upload (jika ditambahkan), dan admin.
- Secret management, HTTPS, CORS allowlist, CSRF decision, backup/restore, audit log, monitoring dan alert.
- Runbook untuk account compromise, data exposure, abuse report, rollback, dan komunikasi insiden.
- Proses support/moderasi dengan pemilik, SLA awal, dan pembatasan akses operator.
- Uji beban dan aksesibilitas sesuai target yang disetujui.
