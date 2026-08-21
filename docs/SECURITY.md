# Security baseline

- Password baru disimpan dengan bcrypt (default cost 12).
- Hash MD5/plaintext warisan hanya diverifikasi sementara dan otomatis di-upgrade setelah login sukses.
- Akun tanpa password tidak lagi memperoleh password universal.
- Endpoint lupa password tidak mengembalikan password/hash dan tidak mengonfirmasi keberadaan akun.
- Endpoint ganti password memakai ID dari JWT, bukan ID bebas dari body request.
- Login dan forgot-password diberi rate limit; CORS production dibatasi env; Helmet dan body limit aktif.
- JWT saat ini masih memakai localStorage untuk kompatibilitas stack. Migrasi ke cookie HttpOnly adalah fase lanjutan dan memerlukan perubahan kontrak auth/CSRF.
- NIK, nomor HP, alamat, transaksi, dan presensi dianggap data sensitif. Gunakan data sintetis sampai kontrol akses, TLS, backup, dan audit terverifikasi.
