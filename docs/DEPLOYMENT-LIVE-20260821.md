# KampungDigital — Live Deployment Record

Tanggal: 2026-08-21

## Target

- URL aplikasi: `https://lab.anantasatriya.my.id/kampungdigital`
- API health: `https://lab.anantasatriya.my.id/kampungdigital/api/health`
- VPS: `43.156.128.43`
- Reverse proxy existing: Caddy
- Release aktif: `/opt/kampungdigital/releases/20260821-1510-showcase`
- Rollback cepat: `/opt/kampungdigital/releases/20260821-1412-redesign`
- Release awal: `/opt/kampungdigital/releases/20260821-1320`
- Symlink aktif: `/opt/kampungdigital/current`

## Isolasi

- Frontend: `127.0.0.1:3100`
- Backend: `127.0.0.1:5106`
- MariaDB: `127.0.0.1:3306`
- Database khusus: `kampungdigital`
- User database khusus: `kampungdigital_app@127.0.0.1`
- Unit khusus:
  - `kampungdigital-frontend.service`
  - `kampungdigital-backend.service`
- Environment private: `/etc/kampungdigital/backend.env` (`0640`, tidak disimpan di repo)
- Blok Caddy khusus hanya untuk host `lab.anantasatriya.my.id` dan subpath `/kampungdigital`.

## Backup dan rollback

Backup Caddy sebelum perubahan disimpan di `/var/backups/kampungdigital/`.
Backup pointer release dan unit sebelum promosi redesain disimpan di `/opt/kampungdigital/backups/` dengan cap waktu `20260821-144119`.
Backup pointer sebelum showcase publik: `/opt/kampungdigital/backups/current-before-showcase-20260821-232759.txt`.

Rollback aplikasi:

1. Arahkan `/opt/kampungdigital/current` ke release sebelumnya jika tersedia.
2. Restart hanya `kampungdigital-frontend` dan `kampungdigital-backend`.
3. Jika perlu membatalkan routing, pulihkan backup Caddy terakhir, jalankan `caddy validate`, lalu reload Caddy.
4. Jangan menghentikan service lain pada VPS.

## Bukti verifikasi

- Build Next.js 15.5.23 berhasil: 22 static pages; lint final 0 error dan 87 warning transisional.
- Backend syntax check berhasil.
- Database init berhasil: 8 tabel.
- Akun operator awal dibuat dengan bcrypt; password tidak disimpan di repository.
- Login operator, verifikasi JWT, dan endpoint terproteksi berhasil.
- HTTPS/Let's Encrypt berhasil diterbitkan oleh Caddy.
- Smoke test redesain: 10 route frontend dan 5 endpoint API terautentikasi mengembalikan HTTP 200.
- 16 aset yang ditemukan dari halaman login mengembalikan HTTP 200.
- Root host tetap HTTP 404 dan endpoint tanpa autentikasi mengembalikan HTTP 401.
- Caddy configuration valid.
- Caddy, MariaDB, kedua unit KampungDigital, dan service existing yang diperiksa tetap aktif.
- Port existing `18789`, `19081`, `5901`, dan `6081` tetap listening.
- Tidak ada failed systemd unit setelah deployment.
- Login `ananta` tetap terbaca sebagai `super_admin`; dashboard live menampilkan data nyata (`1` warga dan `1` tim pengelola).
- Browser test terautentikasi pada 1440×1000 dan 390×844 lulus tanpa horizontal overflow, gambar rusak, console/page error, atau status sinkronisasi yang menggantung.
- Showcase publik aktif pada `/kampungdigital`; login aplikasi sekarang berada di `/kampungdigital/login`.
- Live smoke showcase/login/dashboard/assets lulus HTTP 200, konten SEO/CTA terdeteksi, login `super_admin` dan API tetap berfungsi, root host tetap 404.
- Vercel Analytics dilepas dari runtime self-hosted dan ikon aplikasi lokal ditambahkan agar tidak ada request analytics/favicon 404.

## Screenshot live

- `docs/screenshots/login-desktop-live.png` — 1440×1100
- `docs/screenshots/login-mobile-live.png` — 390×844
- `docs/screenshots/redesign/dashboard-desktop.png` — preview redesign 1440×1000
- `docs/screenshots/redesign/dashboard-mobile.png` — preview redesign 390×844
- `docs/screenshots/redesign/live-dashboard-desktop.png` — verifikasi live 1440×1000
- `docs/screenshots/redesign/live-dashboard-mobile.png` — verifikasi live 390×844
- `docs/screenshots/showcase/showcase-desktop.png` — showcase publik 1440×1000
- `docs/screenshots/showcase/showcase-mobile.png` — showcase publik 390×844

Inspeksi visual menunjukkan halaman login dan dashboard termuat penuh, aset/logo benar, teks terbaca, tidak ada overflow horizontal, dan shell baru responsif pada desktop maupun mobile.

## Catatan risiko lanjutan

- Warning lint transisional masih ada dan telah didokumentasikan.
- Temuan audit frontend terkait `xlsx@0.18.5` belum memiliki perbaikan npm langsung. Fitur spreadsheet tetap diperlakukan preview-only sampai library diganti atau dimigrasikan.
- JWT masih menggunakan penyimpanan frontend warisan; migrasi ke cookie HttpOnly direkomendasikan untuk fase hardening berikutnya.
