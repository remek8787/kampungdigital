# SQL schema

- `create-tables.sql` menyediakan schema modul utama.
- `add-*.sql` berisi migrasi tambahan historis yang perlu ditinjau sebelum produksi.
- `backend/init.sql` adalah entry point schema dasar untuk deployment baru.

Repository tidak menyertakan akun demo atau password default. Admin awal harus dibuat oleh operator menggunakan hash bcrypt, melalui proses privat dan terkontrol. Jangan menaruh kredensial pada file SQL atau Git.
