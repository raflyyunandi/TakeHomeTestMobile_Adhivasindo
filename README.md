# Aplikasi Pinjam Buku – Frontend (Ionic React + Tailwind + Vite)

Frontend untuk sistem peminjaman buku yang terhubung ke API Laravel (JWT). Proyek ini menyediakan:
- Portal User: cari & filter buku, lihat penerbit, melihat pinjaman, dan meminjam buku.
- Panel Admin: dashboard ringkas dan CRUD Buku, Penerbit, Pembaca, Peminjaman.
- UI mobile‑first memakai Ionic Components dengan styling TailwindCSS.

## Teknologi
- Ionic React 8, React 19, React Router (v5 untuk kompatibilitas Ionic Router)
- Vite 8, TypeScript 5
- TailwindCSS 3
- Axios untuk HTTP client

## Prasyarat
- Node.js 18+ dan npm
- Backend Laravel berjalan dan dapat diakses melalui URL pada `VITE_API_URL` (default `http://localhost:8000`)

## Instalasi
1. Masuk ke folder proyek:
   - `cd pinjam-buku-ionic`
2. Instal dependensi:
   - `npm install`
3. Atur environment:
   - Salin/ubah `.env.local`
   - `VITE_API_URL=http://localhost:8000`

## Menjalankan
- Development: `npm run dev`
  - Buka alamat yang tampil di terminal, contoh `http://localhost:5174/`
- Build produksi: `npm run build`
- Preview build: `npm run preview`

## Rute & Halaman
### Autentikasi
- Login User: `/login-user`
- Login Admin: `/login-admin`
- Register User: `/register`

### Portal User
- Root User: `/user`
- Buku: `/user/books`
- Penerbit: `/user/publishers`
- Pinjaman: `/user/loans`
- Keluar: `/user/logout`

### Panel Admin
- Root Admin: `/admin` (navigasi tab bawah, mobile‑first)
- Buku: `/admin/buku`
- Penerbit: `/admin/penerbit`
- Pembaca: `/admin/pembaca`
- Peminjaman: `/admin/peminjaman`
- Keluar: `/admin/logout`

## Integrasi API
- Base URL dibaca dari `VITE_API_URL`.
- Semua permintaan protected otomatis menambahkan header:
  - `Authorization: Bearer <token>`
- Alur autentikasi:
  1. Login (user atau admin) menerima `token`/`access_token`.
  2. Set token ke header global klien via interceptor.
  3. Panggil `/api/me` untuk membaca profil dan role.

## Fitur Utama
### User
- Cari & filter buku (`q`, `kategori`, `id_penerbit`, `per_page`) dan status `available`.
- Lihat daftar penerbit (`per_page`).
- Lihat pinjaman saya.
- Pinjam buku dengan tanggal pinjam & kembali.

### Admin
- Dashboard: ringkasan total Buku/Penerbit/Pembaca/Peminjaman dan daftar peminjaman terbaru.
- CRUD Buku: ISBN, judul, edisi, kategori, harga, penerbit.
- CRUD Penerbit: nama, tahun_terbit.
- CRUD Pembaca: nama depan/belakang, email, no telepon, alamat.
- CRUD Peminjaman: pilih pembaca & buku, tanggal pinjam/kembali.
- Pagination, search, dan tombol Refresh pada setiap tabel.

## Styling & UX
- Ionic Components untuk input, modal, tabs, dsb.
- TailwindCSS untuk layout, spacing, tipografi, dan utilitas responsif.
- Desain mengikuti referensi layout dengan perhatian pada mobile‑first.

## Troubleshooting
- “Unauthenticated.” setelah login:
  - Pastikan token dipasang ke header `Authorization` sebelum memanggil `/api/me`.
  - Cek `VITE_API_URL` mengarah ke instance backend yang benar.
  - Pastikan backend JWT guard (`auth:api`) aktif dan CORS diizinkan.
- Port dev berbeda dari 5173:
  - Vite akan memilih port kosong otomatis; gunakan URL yang tampil di terminal.

## Skrip
- `npm run dev` – Menjalankan dev server.
- `npm run build` – Build produksi.
- `npm run preview` – Preview build.
- `npm run lint` – ESLint.

## Catatan
- Proyek ini mengutamakan kompatibilitas Ionic Router; karena itu digunakan React Router v5 pada integrasi `@ionic/react-router`.
