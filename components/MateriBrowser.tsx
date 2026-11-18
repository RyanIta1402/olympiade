"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Materi } from "@/lib/types";
import { bulanTahun, gayaKategori, kunciBulan, tanggalPanjang } from "@/lib/format";

const SEMUA = "semua";

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function MateriBrowser({ items }: { items: Materi[] }) {
  const [q, setQ] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [bulan, setBulan] = useState(SEMUA);

  const kategoriList = useMemo(
    () => ["Semua", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );

  // Daftar tab bulan, terbaru di depan, lengkap dengan jumlah materinya.
  const bulanList = useMemo(() => {
    const jumlah = new Map<string, number>();
    for (const i of items) {
      const k = kunciBulan(i);
      jumlah.set(k, (jumlah.get(k) ?? 0) + 1);
    }
    const urut = Array.from(jumlah.entries()).sort((a, b) =>
      b[0].localeCompare(a[0]),
    );
    return [
      { key: SEMUA, label: "Semua", count: items.length },
      ...urut.map(([key, count]) => ({ key, label: bulanTahun(key), count })),
    ];
  }, [items]);

  const hasil = useMemo(() => {
    const kata = q.trim().toLowerCase();
    return items.filter((i) => {
      const cocokBulan = bulan === SEMUA || kunciBulan(i) === bulan;
      const cocokKategori = kategori === "Semua" || i.category === kategori;
      const cocokKata =
        !kata ||
        `${i.title} ${i.description} ${i.category}`.toLowerCase().includes(kata);
      return cocokBulan && cocokKategori && cocokKata;
    });
  }, [items, q, kategori, bulan]);

  return (
    <>
      <div className="toolbar">
        <div className="tabs" role="tablist" aria-label="Kelompok bulan">
          {bulanList.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              className="tab"
              aria-selected={bulan === t.key}
              onClick={() => setBulan(t.key)}
            >
              {t.label}
              <span className="tab-count">{t.count}</span>
            </button>
          ))}
        </div>
        <label className="search">
          <IconSearch />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari materi, latihan, atau simulasi…"
            aria-label="Cari materi"
          />
        </label>
        <div className="chips">
          {kategoriList.map((k) => (
            <button
              key={k}
              type="button"
              className="chip"
              aria-pressed={kategori === k}
              onClick={() => setKategori(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {hasil.length === 0 ? (
        <p className="empty">
          Tidak ada materi yang cocok dengan pencarian itu.
          <br />
          Coba kata kunci lain atau pilih kategori <strong>Semua</strong>.
        </p>
      ) : (
        <ul className="list" role="tabpanel">
          {hasil.map((item) => {
            const gaya = gayaKategori(item.category);
            const tanggal = tanggalPanjang(item.date || item.updatedAt);
            return (
              <li key={item.slug}>
                <Link
                  href={`/materi/${item.slug}`}
                  className="card"
                  style={
                    {
                      "--tone": gaya.tone,
                      "--tone-bg": gaya.toneBg,
                    } as React.CSSProperties
                  }
                >
                  <span className="card-icon" aria-hidden="true">
                    {gaya.icon}
                  </span>
                  <div className="card-body">
                    <div className="card-top">
                      <span className="badge">{item.category}</span>
                    </div>
                    <h2>{item.title}</h2>
                    {item.description ? <p>{item.description}</p> : null}
                    <div className="meta">
                      {tanggal ? <span>📅 {tanggal}</span> : null}
                      {item.questions > 0 ? <span>❓ {item.questions} soal</span> : null}
                      <span>⚡ Interaktif</span>
                    </div>
                  </div>
                  <span className="card-go" aria-hidden="true">
                    <IconArrow />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
