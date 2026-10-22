"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "@/components/Lightbox";

export type Photo = { src: string; alt: string; width: number; height: number };

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [order, setOrder] = useState(photos);
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div data-reveal className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">{photos.length} photos · tap any photo to view</p>
        <button
          type="button"
          onClick={() => setOrder(shuffled(photos))}
          className="rounded-full bg-wine px-5 py-2 text-sm font-bold text-cream transition hover:bg-rose"
        >
          ⟳ Shuffle
        </button>
      </div>

      <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
        {order.map((p, i) => (
          <button
            data-reveal
            key={p.src}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
            aria-label={`Open photo ${i + 1}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
              className="h-auto w-full transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-wine/80 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink opacity-0 transition duration-300 group-hover:opacity-100">
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {index !== null && (
        <Lightbox
          photos={order}
          index={index}
          onClose={() => setIndex(null)}
          onNavigate={(next) => setIndex(next)}
        />
      )}
    </>
  );
}
