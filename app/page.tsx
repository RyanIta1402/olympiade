import MateriBrowser from "@/components/MateriBrowser";
import { materiList } from "@/lib/materi-data";
import { tanggalPanjang } from "@/lib/format";

export default function Home() {
  const total = materiList.length;
  const totalSoal = materiList.reduce((n, m) => n + m.questions, 0);
  const terbaru = materiList
    .map((m) => m.updatedAt)
    .sort()
    .at(-1);

  return (
    <main className="shell">
      <header className="hero">
        <span className="eyebrow">🎯 Persiapan Olimpiade Matematika SD</span>
        <h1>Ruang Belajar Olimpiade</h1>
        <p>
          Semua materi, latihan soal, dan simulasi ujian dikumpulkan di satu tempat.
          Pilih salah satu di bawah, lalu kerjakan langsung dari HP atau laptop.
        </p>
        <div className="stats">
          <div className="stat">
            <b>{total}</b>
            <span>Materi</span>
          </div>
          <div className="stat">
            <b>{totalSoal}</b>
            <span>Soal latihan</span>
          </div>
          <div className="stat">
            <b>{terbaru ? tanggalPanjang(terbaru) : "-"}</b>
            <span>Update terakhir</span>
          </div>
        </div>
      </header>

      <MateriBrowser items={materiList} />

      <p className="footer">
        Tambah materi baru: simpan file <code>.html</code> ke folder{" "}
        <code>public/konten/</code>, lalu deploy ulang — otomatis muncul di daftar ini.
      </p>
    </main>
  );
}
