# Ruang Belajar Olimpiade Matematika

Portal Next.js untuk mengumpulkan semua materi HTML interaktif persiapan olimpiade
matematika SD — materi belajar, latihan soal, simulasi ujian, dan pembahasan — dalam
satu daftar yang rapi, dengan tab per bulan, pencarian, dan filter kategori.

Produksi: https://olympiade-cyan.vercel.app

## Struktur

```
app/
  page.tsx                   halaman depan: banner logo + daftar materi
  materi/[slug]/page.tsx     pembuka materi (iframe + tombol kembali)
  not-found.tsx              halaman 404
  layout.tsx                 metadata, font, preview share
  globals.css                seluruh styling (tema terang & gelap)
  icon.png                   favicon
  opengraph-image.png        gambar preview saat link dibagikan
components/
  MateriBrowser.tsx          tab bulan, pencarian, filter kategori
lib/
  types.ts                   tipe data materi
  format.ts                  format tanggal, label bulan, warna kategori
  materi-data.ts             DIBUAT OTOMATIS, jangan diedit, tidak masuk git
public/
  konten/*.html              file materi aslinya
  mark-olimpiade.png         simbol logo (lingkaran)
konten.meta.json             judul/deskripsi/kategori/tanggal custom
scripts/build-manifest.mjs   pemindai folder konten
vercel.json                  memaksa Vercel membangun sebagai Next.js
```

## Menambah materi baru

1. Simpan file `.html` ke `public/konten/`.

   Nama file jadi alamat halamannya, jadi pakai huruf kecil dan tanda hubung —
   `latihan-kpk-fpb-prima.html` akan terbuka di `/materi/latihan-kpk-fpb-prima`.
   Hindari spasi dan garis bawah.

   Kalau nama file memuat tanggal berformat `dd-mm-yyyy` (misalnya
   `simulasi-iob-kelas-5-14-11-2026.html`), tanggal itu dipakai untuk menentukan
   tab bulan. Kalau tidak ada, dipakai waktu file terakhir diubah — bisa bergeser
   sendiri, jadi lebih aman diset manual di `konten.meta.json`.

2. Judul diambil otomatis dari tag `<title>`, deskripsi dari meta description atau
   paragraf pertama. Untuk mengaturnya sendiri, tambahkan entri di `konten.meta.json`:

   ```json
   "latihan-kpk-fpb-prima": {
     "title": "Latihan KPK, FPB & Faktorisasi Prima",
     "description": "20 soal untuk menguasai kelipatan dan faktor persekutuan.",
     "category": "Latihan Soal",
     "date": "2026-11-18",
     "questions": 20
   }
   ```

   Kategori yang punya ikon dan warna sendiri:

   | Kategori          | Ikon | Warna  |
   | ----------------- | ---- | ------ |
   | `Materi Belajar`  | 📘   | indigo |
   | `Latihan Soal`    | ✏️   | hijau  |
   | `Simulasi Ujian`  | ⏱️   | merah  |
   | `Pembahasan Soal` | 🧩   | amber  |

3. Commit dan push. Daftar, tab bulan, dan angka statistik di halaman depan
   diperbarui otomatis saat build.

Menghapus materi caranya sama: hapus filenya dari `public/konten/`, lalu hapus juga
entrinya di `konten.meta.json` kalau ada.

## Menjalankan di komputer

```
npm install
npm run dev
```

Buka http://localhost:3000. Perintah `npm run manifest` memindai ulang folder konten
tanpa menjalankan server — berguna setelah menambah file baru.

## Deploy ke Vercel

Project ini tersambung ke repo GitHub `RyanIta1402/olympiade`, jadi setiap push ke
`main` otomatis memicu deployment.

`vercel.json` sudah mengunci `framework: nextjs`, jadi setelan Framework Preset di
dashboard tidak perlu diubah lagi. Manifest materi dibangkitkan ulang tiap build lewat
script `prebuild`.

Catatan: commit harus dibuat dengan email yang terhubung ke akun GitHub pemilik project
Vercel. Commit dari email lain akan ditolak Vercel dengan status **Blocked**.

## Aset logo

`app/icon.png`, `app/opengraph-image.png`, dan `public/mark-olimpiade.png` dibuat dari
satu file logo sumber memakai `sharp`. Simbol infinity dipotong terpisah dari tulisan
"Olimpiade Matematika", karena judul di halaman depan ditulis sebagai teks, bukan gambar.
