"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Materi } from "@/lib/types";
import { gayaKategori, tanggalPanjang } from "@/lib/format";

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

  const kategoriList = useMemo(
    () => ["Semua", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );

  const hasil = useMemo(() => {
    const kata = q.trim().toLowerCase();
    return items.filter((i) => {
      const cocokKategori = kategori === "Semua" || i.category === kategori;
      const cocokKata =
        !kata ||
        `${i.title} ${i.description} ${i.category}`.toLowerCase().includes(kata);
      return cocokKategori && cocokKata;
    });
  }, [items, q, kategori]);

  return (
    <>
      <div className="toolbar">
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
        <ul className="list">
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
