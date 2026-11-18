// Memindai public/konten/*.html lalu menulis lib/materi-data.ts
// Jalan otomatis lewat npm "predev" / "prebuild".
import { readdir, readFile, stat, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const KONTEN_DIR = path.join(ROOT, "public", "konten");
const OUT_FILE = path.join(ROOT, "lib", "materi-data.ts");
const OVERRIDES_FILE = path.join(ROOT, "konten.meta.json");

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&ndash;": "-",
  "&mdash;": "—",
  "&hellip;": "…",
};

function decode(input) {
  return input
    .replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html) {
  return decode(html.replace(/<[^>]*>/g, " "));
}

function pick(html, regex) {
  const m = html.match(regex);
  return m ? stripTags(m[1]) : "";
}

function judul(html, file) {
  const t = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t) return t;
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return h1;
  return file.replace(/\.html?$/i, "").replace(/[-_]+/g, " ");
}

function deskripsi(html) {
  const meta = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  );
  if (meta) return decode(meta[1]);
  const sub = pick(html, /<p[^>]*class=["'][^"']*(?:sub|lead|desc)[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
  if (sub && sub.length > 15) return potong(sub);
  const paras = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) =>
    stripTags(m[1]),
  );
  const kandidat = paras.find((p) => p.length > 40);
  return kandidat ? potong(kandidat) : "";
}

function potong(teks, max = 160) {
  if (teks.length <= max) return teks;
  return teks.slice(0, max).replace(/[\s,;.]+\S*$/, "") + "…";
}

function kategori(file, title) {
  const s = `${file} ${title}`.toLowerCase();
  if (/simulasi|ujian|try\s*out|tryout/.test(s)) return "Simulasi Ujian";
  if (/kuis|quiz|latihan|soal|challenge/.test(s)) return "Latihan Soal";
  return "Materi Belajar";
}

// Ambil tanggal dari nama file: 01-11-2026 / 2026-11-01
function tanggalDariNama(file) {
  let m = file.match(/(\d{2})-(\d{2})-(\d{4})(?!\d)/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  m = file.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return "";
}

function hitungSoal(html) {
  const kandidat = [
    (html.match(/\bq\s*:\s*["'`]/gi) || []).length,
    (html.match(/\bsoal\s*\d+/gi) || []).length,
    (html.match(/data-soal/gi) || []).length,
  ];
  return Math.max(...kandidat, 0);
}

async function main() {
  if (!existsSync(KONTEN_DIR)) {
    await mkdir(KONTEN_DIR, { recursive: true });
  }

  let overrides = {};
  if (existsSync(OVERRIDES_FILE)) {
    try {
      overrides = JSON.parse(await readFile(OVERRIDES_FILE, "utf8"));
    } catch (err) {
      console.warn("[manifest] konten.meta.json diabaikan:", err.message);
    }
  }

  const files = (await readdir(KONTEN_DIR)).filter((f) => /\.html?$/i.test(f));
  const items = [];

  for (const file of files) {
    const full = path.join(KONTEN_DIR, file);
    const [html, info] = await Promise.all([readFile(full, "utf8"), stat(full)]);
    const slug = file.replace(/\.html?$/i, "");
    const title = judul(html, file);
    const o = overrides[file] ?? overrides[slug] ?? {};

    items.push({
      slug,
      file,
      title: o.title ?? title,
      description: o.description ?? deskripsi(html),
      category: o.category ?? kategori(file, title),
      date: o.date ?? tanggalDariNama(file) ?? "",
      updatedAt: info.mtime.toISOString(),
      sizeKb: Math.round(info.size / 1024),
      questions: o.questions ?? hitungSoal(html),
    });
  }

  items.sort((a, b) => {
    const da = a.date || a.updatedAt.slice(0, 10);
    const db = b.date || b.updatedAt.slice(0, 10);
    if (da !== db) return da.localeCompare(db);
    return a.title.localeCompare(b.title, "id");
  });

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  const body = `// File ini dibuat otomatis oleh scripts/build-manifest.mjs — jangan diedit manual.
// Tambah materi: taruh file .html di public/konten/ lalu jalankan \`npm run manifest\`.
import type { Materi } from "./types";

export const materiList: Materi[] = ${JSON.stringify(items, null, 2)};
`;
  await writeFile(OUT_FILE, body, "utf8");
  console.log(`[manifest] ${items.length} materi ditulis ke lib/materi-data.ts`);
}

main().catch((err) => {
  console.error("[manifest] gagal:", err);
  process.exit(1);
});
