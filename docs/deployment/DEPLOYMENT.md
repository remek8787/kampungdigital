# Deployment produksi pada `/kampungdigital`

Dokumen ini menyiapkan deployment, tetapi **tidak menjalankan deploy**.

## Topologi
- Nginx publik: `https://lab.anantasatriya.my.id`
- Frontend internal: `127.0.0.1:3100`, base path `/kampungdigital`
- Backend internal: `127.0.0.1:5106`, API prefix `/api`
- MySQL private: jangan expose port ke internet

## Build
```bash
cd frontend
cp .env.example .env.production
npm ci
NEXT_PUBLIC_BASE_PATH=/kampungdigital NEXT_PUBLIC_API_URL=/kampungdigital/api npm run build

cd ../backend
cp .env.example .env
npm ci
npm run check
```

Gunakan secret acak, misalnya `openssl rand -base64 48`, hanya di env server. Jangan simpan outputnya di Git.

## Nginx location
Backup config lebih dulu dan jalankan `nginx -t` sebelum reload.

```nginx
location = /kampungdigital {
    return 308 /kampungdigital/;
}

location /kampungdigital/api/ {
    proxy_pass http://127.0.0.1:5106/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /kampungdigital/ {
    proxy_pass http://127.0.0.1:3100/kampungdigital/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Database
1. Buat database/user khusus dengan hak minimum.
2. Import `backend/init.sql` untuk schema dasar.
3. Jangan gunakan seed credential lama. Buat admin awal lewat prosedur operator terkontrol dengan hash bcrypt.
4. Uji backup dan restore sebelum memasukkan data warga nyata.

## Smoke test
```bash
curl -fsS https://lab.anantasatriya.my.id/kampungdigital/ >/dev/null
curl -fsS https://lab.anantasatriya.my.id/kampungdigital/api/health
```
Lanjutkan dengan login per role, deep link dashboard, asset `_next`, CRUD sintetis, dan tampilan mobile.

## Rollback
- Restore file konfigurasi Nginx hasil backup lalu `nginx -t` dan reload.
- Stop hanya service/container bernama `kampungdigital-*`.
- Restore database dari backup pra-deploy bila migrasi sudah dijalankan.
- Jangan menghapus atau mengubah aplikasi lain pada root domain.
