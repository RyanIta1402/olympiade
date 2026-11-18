# Ruang Belajar Olimpiade

Portal Next.js untuk menampilkan semua materi HTML interaktif (materi, latihan soal,
simulasi ujian) dalam satu daftar yang rapi, lengkap dengan pencarian dan filter kategori.

## Struktur

```
app/
  page.tsx                 daftar materi (halaman depan)
  materi/[slug]/page.tsx   pembuka materi (iframe + tombol kembali)
components/MateriBrowser.tsx  pencarian + filter kategori
lib/
  types.ts                 tipe data materi
  format.ts                format tanggal & warna kategori
  materi-data.ts           DIBUAT OTOMATIS, jangan diedit
public/konten/*.html       file materi aslinya
konten.meta.json           judul/deskripsi/kategori custom (opsional)
scripts/build-manifest.mjs pemindai folder konten
```

## Menambah materi baru

1. Simpan file `.html` ke `public/konten/`. Pakai nama tanpa spasi, misalnya
   `hari-4-geometri.html` — nama file inilah yang jadi alamat halamannya
   (`/materi/hari-4-geometri`).
2. Judul dan deskripsi diambil otomatis dari tag `<title>` dan paragraf pertama.
   Mau diatur sendiri? Tambahkan entri di `konten.meta.json`:

   ```json
   "hari-4-geometri": {
     "title": "Hari 4 — Geometri Dasar",
     "description": "Sesi latihan bangun datar dan sudut.",
     "category": "Materi Belajar",
     "date": "2026-11-20",
     "questions": 8
   }
   ```

   Kategori yang punya ikon & warna sendiri: `Materi Belajar`, `Latihan Soal`,
   `Simulasi Ujian`, `Pembahasan Soal`.
3. Commit dan push — daftar di halaman depan diperbarui otomatis saat build.

## Menjalankan di komputer

```
npm install
npm run dev
```

Buka http://localhost:3000.

## Deploy ke Vercel

Project ini Next.js biasa, jadi Vercel mendeteksinya sendiri:

- Framework Preset: **Next.js**
- Build Command: `npm run build` (default)
- Output Directory: biarkan default
- Root Directory: folder repo ini

Daftar materi dibangkitkan ulang setiap build lewat script `prebuild`, jadi cukup
push file HTML baru dan Vercel akan menampilkannya.
