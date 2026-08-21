# KampungDigital

Aplikasi tata kelola warga, rumah, iuran, ronda, barcode, dan laporan untuk lingkungan RT/RW. Proyek ini mempertahankan stack dan model data referensi, lalu melakukan rebranding, dukungan subpath, dan hardening keamanan terarah.

## Stack
- Frontend: Next.js 15, TypeScript, Tailwind CSS, Radix/shadcn
- Backend: Express, JWT, MySQL/MariaDB
- Target path: `/kampungdigital`
- Target API publik: `/kampungdigital/api`

## Mulai lokal
```bash
cd backend && cp .env.example .env && npm install && npm run dev
cd frontend && cp .env.example .env.local && npm install && npm run dev
```
Sesuaikan database dan origin lokal pada env. Jangan gunakan nilai contoh untuk produksi.

## Dokumentasi
- Blueprint kanonis: `docs/BLUEPRINT.md`
- Tracker: `docs/TRACKER.md`
- Security baseline: `docs/SECURITY.md`
- Deployment subpath/Nginx: `docs/deployment/DEPLOYMENT.md`

## Lisensi dan atribusi
Kode turunan tersedia di bawah MIT License. Lihat `LICENSE` dan `NOTICE`. Identitas visual KampungDigital adalah orisinal dan tidak memakai aset merek upstream.
