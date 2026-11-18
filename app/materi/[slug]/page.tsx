import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { materiList } from "@/lib/materi-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return materiList.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = materiList.find((m) => m.slug === slug);
  if (!item) return { title: "Materi tidak ditemukan" };
  return { title: item.title, description: item.description };
}

export default async function MateriPage({ params }: Props) {
  const { slug } = await params;
  const item = materiList.find((m) => m.slug === slug);
  if (!item) notFound();

  const src = `/konten/${encodeURIComponent(item.file)}`;

  return (
    <div className="viewer">
      <div className="viewer-bar">
        <Image
          className="viewer-mark"
          src="/mark-olimpiade.png"
          alt="Olimpiade Matematika"
          width={128}
          height={128}
          priority
        />
        <Link href="/" className="viewer-back">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H6" />
            <path d="m12 5-7 7 7 7" />
          </svg>
          Daftar materi
        </Link>
        <span className="viewer-title">{item.title}</span>
        <a className="viewer-open" href={src} target="_blank" rel="noopener noreferrer">
          Buka penuh
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 4h6v6" />
            <path d="M20 4 10 14" />
            <path d="M18 14v6H4V6h6" />
          </svg>
        </a>
      </div>
      <iframe className="viewer-frame" src={src} title={item.title} />
    </div>
  );
}
