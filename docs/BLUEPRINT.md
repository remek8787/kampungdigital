---
title: KampungDigital Blueprint
description: Blueprint kanonis aplikasi tata kelola warga, iuran, ronda, dan transparansi kampung digital.
project: kampungdigital
created: 2026-08-21
updated: 2026-08-21
tags: [kampungdigital, warga, rt-rw, iuran, ronda, nextjs, express, mysql]
---

# KampungDigital — Blueprint Kanonis

## 1. Ringkasan

KampungDigital adalah aplikasi operasional untuk membantu lingkungan RT/RW mengelola data rumah dan warga, iuran/kas, petugas, ronda, presensi, barcode rumah, laporan, dan transparansi kepada warga.

Target preview awal:
- Public URL: `https://lab.anantasatriya.my.id/kampungdigital/`
- VPS: `43.156.128.43`
- Repo private: `git@github.com:remek8787/kampungdigital.git`
- Working copy Alvii: `/root/.openclaw/workspace/projects/kampungdigital`

## 2. Referensi dan lisensi

Referensi awal:
- Demo: `https://nalarin-dapung.acal.my.id/`
- Source: `https://github.com/heri99123/nalarin-dapung`
- Upstream commit audit awal: `f4f52b08a721e5f67361d3b9fb14f009147477c1`
- Lisensi source: MIT, Copyright (c) 2026 Heri Tico.

Batas penggunaan:
- Pertahankan `LICENSE` dan atribusi di `NOTICE`.
- Nama, logo, identitas visual, dan screenshot DaPUNG bukan bagian yang boleh diklaim. Seluruh produk turunan harus memakai identitas KampungDigital sendiri.
- KampungDigital dikembangkan sebagai produk berbeda, bukan situs resmi atau clone bermerek DaPUNG.

## 3. Tujuan produk

1. Memudahkan pengurus RT/RW bekerja tanpa spreadsheet dan buku catatan yang tercecer.
2. Membuat pembayaran/iuran warga mudah ditelusuri dan transparan.
3. Memberi warga akses terbatas untuk melihat status serta riwayat miliknya sendiri.
4. Memudahkan ronda: kelompok, jadwal, absensi, dan scan barcode rumah.
5. Menghasilkan laporan bulanan yang siap dibagikan dan diaudit.
6. Menjadi laboratorium produk civic-tech yang dapat dikembangkan menjadi multi-kampung di fase berikutnya.

## 4. Pengguna dan peran

- `SuperAdmin`: pengaturan sistem, jenis dana, admin, audit.
- `Admin/Pengurus`: data rumah, warga, petugas, transaksi, laporan.
- `Petugas`: scan barcode, input iuran, absensi ronda.
- `Warga`: melihat profil/status pembayaran/riwayat miliknya.

Fase awal mempertahankan role dan route upstream agar implementasi aman. Perubahan menuju multi-tenant perlu keputusan tersendiri.

## 5. Modul fase awal

- Login dan RBAC.
- Dashboard per peran.
- Data rumah + barcode unik.
- Data warga.
- Data petugas/pengurus.
- Jenis dana/iuran.
- Transaksi masuk/keluar.
- Kelompok dan jadwal ronda.
- Absensi ronda.
- Laporan dan ekspor.
- Notifikasi/pengaturan akun.

## 6. Arsitektur

Pertahankan stack referensi pada fase pertama:
- Frontend: Next.js 15 App Router + TypeScript + Tailwind v4 + shadcn/Radix.
- Backend: Node.js + Express REST API.
- Database: MySQL/MariaDB.
- Auth: JWT Bearer, dengan hardening bertahap.
- Deployment live: service systemd terisolasi di loopback, Caddy reverse proxy pada subpath `/kampungdigital`.

Routing target:
- Frontend: `/kampungdigital/*`
- API same-origin: `/kampungdigital/api/*`
- Port internal ditentukan saat preflight VPS dan tidak boleh bentrok dengan service existing.

## 7. Keamanan wajib sebelum data nyata

Temuan upstream yang tidak boleh dibawa mentah ke produksi:
- MD5/plaintext password compatibility.
- Endpoint lupa password yang dapat mengembalikan password.
- Kredensial dummy hard-coded pada frontend.
- JWT di `localStorage` memiliki risiko XSS; fase hardening lanjutan mempertimbangkan cookie HttpOnly.
- Build mengabaikan TypeScript/ESLint error.

Baseline KampungDigital:
- Password baru wajib bcrypt.
- Legacy MD5 hanya boleh diverifikasi sementara lalu di-upgrade ke bcrypt setelah login sukses.
- Lupa password tidak pernah menampilkan/mengirim password lama; gunakan reset token atau nonaktifkan sampai flow aman tersedia.
- Secret hanya di env server, tidak masuk repo.
- CORS dibatasi ke origin target.
- Tambahkan helmet, body limit, rate limit login/API sensitif, validasi input, dan log aman.
- Tidak ada data NIK/nomor HP nyata pada preview publik sebelum kontrol akses dan backup diverifikasi.

## 8. Arah UI/UX

Arah: civic-tech hangat, terpercaya, dekat dengan warga Indonesia—bukan dashboard korporat generik.

Prinsip:
- Bahasa Indonesia natural dan mudah dipahami pengurus lapangan.
- Mobile-first untuk petugas ronda yang memakai ponsel.
- Hierarki sederhana: tindakan utama, status, lalu detail.
- Warna khas KampungDigital: hijau gotong royong, biru kepercayaan, aksen tanah/amber secukupnya.
- Identitas visual orisinal; jangan menyalin logo/screenshot/upstream branding.
- Empty/loading/error state jelas.
- Tabel penting memiliki pencarian, filter, dan tampilan mobile yang masuk akal.
- Aksesibilitas dasar: semantic HTML, kontras, label, focus state, keyboard.

## 9. Data dan privasi

- NIK, nomor telepon, alamat, transaksi, dan presensi adalah data sensitif.
- Preview awal memakai seed demo sintetis, bukan data warga nyata.
- Database tidak boleh diekspos publik.
- Backup database harus terenkripsi/private dan diuji restore.
- Audit trail penting untuk perubahan transaksi, limit/peran, dan penghapusan.
- Penghapusan data operasional sebaiknya soft-delete/arsip bila memungkinkan.

## 10. Deployment aman

Sebelum deploy:
1. Akses SSH/sudo VPS terverifikasi.
2. Audit service, port, resource, reverse proxy, dan TLS existing.
3. Tentukan webroot/service names dan port yang tidak bentrok.
4. Backup konfigurasi reverse proxy dan service terkait.
5. Siapkan env private dan database khusus KampungDigital.
6. Build dan test lokal.

Deployment live 2026-08-21:
- Release: `/opt/kampungdigital/releases/20260821-1320`, aktif melalui `/opt/kampungdigital/current`.
- Frontend: `127.0.0.1:3100`; backend: `127.0.0.1:5106`; MariaDB: `127.0.0.1:3306`.
- Unit khusus: `kampungdigital-frontend.service` dan `kampungdigital-backend.service`.
- Database/user khusus: `kampungdigital` / `kampungdigital_app@127.0.0.1`.
- Reverse proxy existing ternyata Caddy. Konfigurasinya dibackup, divalidasi dengan `caddy validate`, dan di-reload tanpa menghentikan service lain.
- Root host tidak dialihkan ke aplikasi; hanya `/kampungdigital` dan `/kampungdigital/api/*` yang dirutekan.
- Rollback: ubah symlink release, restart hanya unit KampungDigital, atau pulihkan backup Caddy setelah validasi.

## 11. Acceptance criteria fase pertama

- Repo KampungDigital berisi source rebranded, LICENSE/NOTICE, blueprint, env examples, dan deployment docs.
- Tidak ada kredensial atau password hard-coded.
- Login/API dasar dapat berjalan dengan password aman.
- Frontend build sukses dengan base path `/kampungdigital`.
- Backend smoke test dan DB init sukses.
- Preview HTTPS bisa dibuka pada target subpath tanpa merusak root domain.
- Route/asset/API tidak menghasilkan 404/mixed content.
- Tampilan login/dashboard nyaman pada mobile dan desktop.
- Ada bukti build, health, HTTP smoke test, serta rollback path.

## 12. Roadmap

### Fase 1 — Preview aman
Rebrand, hardening auth minimum, seed sintetis, build/deploy subpath, dokumentasi.

### Fase 2 — Operasional RT/RW
Perbaikan workflow transaksi, audit trail, bukti bayar, rekap bulanan, import data, SOP operator.

### Fase 3 — Transparansi warga
Portal warga, pengumuman, status iuran, laporan publik teragregasi tanpa membocorkan data pribadi.

### Fase 4 — Multi-kampung/SaaS
Tenant isolation, onboarding kampung, branding per tenant, paket/limit, backup per tenant. Perlu desain arsitektur dan persetujuan baru; jangan dicampur diam-diam ke fase awal.

## 13. Status live

- DNS `lab.anantasatriya.my.id` menuju `43.156.128.43`.
- Preview aktif pada `https://lab.anantasatriya.my.id/kampungdigital`.
- TLS Let's Encrypt berhasil diterbitkan dan HTTPS health check lulus.
- Login operator bcrypt, verifikasi JWT, endpoint terproteksi, route, dan aset telah diuji.
- Screenshot live desktop/mobile tersimpan di `docs/screenshots/` dan telah diinspeksi.
- Service lama yang diperiksa tetap aktif; deployment KampungDigital hanya memakai unit, direktori, database, dan port loopback khusus.
- Bukti teknis lengkap: `docs/DEPLOYMENT-LIVE-20260821.md`.
