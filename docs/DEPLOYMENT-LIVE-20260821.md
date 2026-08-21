# KampungDigital — Live Deployment Record

Tanggal: 2026-08-21

## Target

- URL aplikasi: `https://lab.anantasatriya.my.id/kampungdigital`
- API health: `https://lab.anantasatriya.my.id/kampungdigital/api/health`
- VPS: `43.156.128.43`
- Reverse proxy existing: Caddy
- Release: `/opt/kampungdigital/releases/20260821-1320`
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

Rollback aplikasi:

1. Arahkan `/opt/kampungdigital/current` ke release sebelumnya jika tersedia.
2. Restart hanya `kampungdigital-frontend` dan `kampungdigital-backend`.
3. Jika perlu membatalkan routing, pulihkan backup Caddy terakhir, jalankan `caddy validate`, lalu reload Caddy.
4. Jangan menghentikan service lain pada VPS.

## Bukti verifikasi

- Build Next.js 15.5.23 berhasil: 22 static pages.
- Backend syntax check berhasil.
- Database init berhasil: 8 tabel.
- Akun operator awal dibuat dengan bcrypt; password tidak disimpan di repository.
- Login operator, verifikasi JWT, dan endpoint terproteksi berhasil.
- HTTPS/Let's Encrypt berhasil diterbitkan oleh Caddy.
- 16 route frontend/API kritis mengembalikan HTTP 200.
- 16 aset yang ditemukan dari halaman login mengembalikan HTTP 200.
- Root host tetap HTTP 404 dan endpoint tanpa autentikasi mengembalikan HTTP 401.
- Caddy configuration valid.
- Caddy, MariaDB, kedua unit KampungDigital, dan service existing yang diperiksa tetap aktif.
- Port existing `18789`, `19081`, `5901`, dan `6081` tetap listening.
- Tidak ada failed systemd unit setelah deployment.

## Screenshot live

- `docs/screenshots/login-desktop-live.png` — 1440×1100
- `docs/screenshots/login-mobile-live.png` — 390×844

Inspeksi visual menunjukkan halaman termuat penuh, aset/logo benar, teks terbaca, tidak ada overflow/elemen terpotong, dan tampilan login responsif pada desktop maupun mobile.

## Catatan risiko lanjutan

- Warning lint transisional masih ada dan telah didokumentasikan.
- Temuan audit frontend terkait `xlsx@0.18.5` belum memiliki perbaikan npm langsung. Fitur spreadsheet tetap diperlakukan preview-only sampai library diganti atau dimigrasikan.
- JWT masih menggunakan penyimpanan frontend warisan; migrasi ke cookie HttpOnly direkomendasikan untuk fase hardening berikutnya.
