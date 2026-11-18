const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/** "2026-11-14" -> "14 November 2026" (tanpa Intl, supaya server & client selalu sama). */
export function tanggalPanjang(iso: string): string {
  const m = iso.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const bulan = BULAN[Number(m[2]) - 1] ?? "";
  return `${Number(m[3])} ${bulan} ${m[1]}`;
}

/** "2026-11-14" -> "November 2026". Dipakai sebagai label tab. */
export function bulanTahun(iso: string): string {
  const m = iso.slice(0, 7).match(/^(\d{4})-(\d{2})$/);
  if (!m) return "Tanpa tanggal";
  const bulan = BULAN[Number(m[2]) - 1] ?? "";
  return `${bulan} ${m[1]}`;
}

/** Kunci pengelompokan tab: "2026-11". */
export function kunciBulan(item: { date: string; updatedAt: string }): string {
  return (item.date || item.updatedAt).slice(0, 7);
}

type Tone = {
  icon: string;
  tone: string;
  toneBg: string;
};

const TONE: Record<string, Tone> = {
  "Materi Belajar": {
    icon: "📘",
    tone: "var(--tone-indigo)",
    toneBg: "var(--tone-indigo-bg)",
  },
  "Latihan Soal": {
    icon: "✏️",
    tone: "var(--tone-emerald)",
    toneBg: "var(--tone-emerald-bg)",
  },
  "Simulasi Ujian": {
    icon: "⏱️",
    tone: "var(--tone-rose)",
    toneBg: "var(--tone-rose-bg)",
  },
  "Pembahasan Soal": {
    icon: "🧩",
    tone: "var(--tone-amber)",
    toneBg: "var(--tone-amber-bg)",
  },
};

const DEFAULT_TONE: Tone = {
  icon: "📄",
  tone: "var(--tone-indigo)",
  toneBg: "var(--tone-indigo-bg)",
};

export function gayaKategori(category: string): Tone {
  return TONE[category] ?? DEFAULT_TONE;
}
