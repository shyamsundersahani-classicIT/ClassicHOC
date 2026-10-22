"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Slide = { src: string; title: string; note: string };

// Auto-advancing featured slideshow with a progress bar, arrows and dots.
export default function Slideshow({ slides, interval = 5000 }: { slides: Slide[]; interval?: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [slides.length, interval]);

  const go = (n: number) => setActive((n + slides.length) % slides.length);
  const current = slides[active];

  return (
    <section className="relative isolate h-[78vh] min-h-[460px] overflow-hidden bg-wine text-cream">
      {slides.map((s, i) => (
        <div
          key={s.src}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === active ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== active}
        >
          <Image
            src={s.src}
            alt={s.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover ${i === active ? "animate-kenburns" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-wine via-wine/30 to-wine/10" />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-16">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">
          Featured · {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
        <h2 key={current.src} className="animate-rise mt-3 font-serif text-4xl md:text-6xl">
          {current.title}
        </h2>
        <p className="mt-2 max-w-md text-cream/80">{current.note}</p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div className="flex gap-2">
            <button type="button" onClick={() => go(active - 1)} aria-label="Previous slide" className="h-12 w-12 rounded-full border border-cream/50 text-xl hover:bg-gold hover:text-ink">‹</button>
            <button type="button" onClick={() => go(active + 1)} aria-label="Next slide" className="h-12 w-12 rounded-full border border-cream/50 text-xl hover:bg-gold hover:text-ink">›</button>
          </div>
          <div className="flex gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-10 bg-gold" : "w-4 bg-cream/40 hover:bg-cream"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* filmstrip: thumbnails that light up as the slideshow moves */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${s.title}`}
            className={`relative h-16 w-24 overflow-hidden rounded-lg border-2 transition duration-500 ${
              i === active ? "scale-110 border-gold shadow-xl shadow-gold/30" : "border-cream/30 opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={s.src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* progress bar restarts on every slide change */}
      <div key={active} className="absolute bottom-0 left-0 h-1 bg-gold" style={{ animation: `progress ${interval}ms linear forwards` }} />
    </section>
  );
}
