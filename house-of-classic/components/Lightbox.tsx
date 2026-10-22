"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/components/Gallery";

export default function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const [dir, setDir] = useState<1 | -1>(1);
  const touchX = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const activeThumb = useRef<HTMLButtonElement>(null);

  // key={index} below remounts the image on every navigation, which restarts the CSS animation.
  const go = (next: number, direction: 1 | -1) => {
    setDir(direction);
    onNavigate((next + photos.length) % photos.length);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(index + 1, 1);
      if (e.key === "ArrowLeft") go(index - 1, -1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    activeThumb.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const current = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex flex-col bg-ink/0 animate-[fadeIn_0.3s_ease-out_forwards]"
      onClick={onClose}
    >
      {/* blurred backdrop built from the current photo, for atmosphere */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image src={current.src} alt="" fill className="scale-125 object-cover opacity-30 blur-3xl" />
        <div className="absolute inset-0 bg-ink/80" />
      </div>

      <div className="flex items-center justify-between px-5 py-4 text-cream/80">
        <p className="text-sm tracking-wide">{index + 1} / {photos.length}</p>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full border border-cream/30 px-4 py-1.5 text-sm hover:bg-gold hover:text-ink hover:border-gold">
          Close ✕
        </button>
      </div>

      <div
        className="relative flex-1 overflow-hidden px-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchX.current;
          if (delta < -50) go(index + 1, 1);
          else if (delta > 50) go(index - 1, -1);
          touchX.current = null;
        }}
      >
        <div
          key={index}
          className={`relative mx-auto h-full max-w-5xl ${dir === 1 ? "animate-[slideInRight_0.45s_cubic-bezier(0.2,0.7,0.2,1)_forwards]" : "animate-[slideInLeft_0.45s_cubic-bezier(0.2,0.7,0.2,1)_forwards]"}`}
        >
          <Image src={current.src} alt={current.alt} fill sizes="90vw" className="object-contain drop-shadow-2xl" priority />
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go(index - 1, -1); }}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-xl text-cream backdrop-blur transition hover:bg-gold hover:text-ink md:left-6"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go(index + 1, 1); }}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-xl text-cream backdrop-blur transition hover:bg-gold hover:text-ink md:right-6"
        >
          ›
        </button>
      </div>

      {/* thumbnail filmstrip, scrolls to keep the active photo centred */}
      <div
        ref={stripRef}
        onClick={(e) => e.stopPropagation()}
        className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-5 pt-2"
      >
        {photos.map((p, i) => (
          <button
            key={p.src}
            ref={i === index ? activeThumb : undefined}
            type="button"
            onClick={() => go(i, i > index ? 1 : -1)}
            aria-label={`Go to photo ${i + 1}`}
            className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-300 ${
              i === index ? "border-gold opacity-100" : "border-transparent opacity-45 hover:opacity-80"
            }`}
          >
            <Image src={p.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
