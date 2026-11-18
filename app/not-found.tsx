import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <header className="hero">
        <span className="eyebrow">404</span>
        <h1>Halaman tidak ditemukan</h1>
        <p>
          Materi yang kamu cari sudah dipindahkan atau alamatnya salah ketik.
          Kembali ke daftar materi untuk memilih ulang.
        </p>
        <div className="stats">
          <Link href="/" className="viewer-open" style={{ padding: "12px 20px" }}>
            ← Daftar materi
          </Link>
        </div>
      </header>
    </main>
  );
}
