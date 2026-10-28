"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { pages } from "@/lib/site";
import { photo } from "@/lib/image-path";

// "focus" is chosen in the admin page: which part of the photo stays visible when it's cropped.
const focusClass: Record<string, string> = {
  center: "object-center",
  lower: "object-[center_65%]",
  bottom: "object-[center_75%]",
  top: "object-top",
};

const slides = pages.home.slides.map((s) => ({ ...s, position: focusClass[s.focus] ?? focusClass.center }));
const INTERVAL = 5000;

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const preference = window.matchMedia(motionQuery);
  preference.addEventListener("change", callback);
  return () => preference.removeEventListener("change", callback);
}

// Full-width home banner in the style of the Gallery slideshow (components/Slideshow.tsx):
// the photos fill the background under a wine gradient, the banner text (children)
// sits on top, with thumbnails on the right and a progress bar along the bottom.
export default function HeroSlideshow({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, () => window.matchMedia(motionQuery).matches, () => true);
  const playing = !paused && !reducedMotion;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % slides.length);
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [playing, active]);

  return (
    // There are no play/pause buttons, so the slideshow pauses while the mouse is
    // over the banner or keyboard focus is inside it.
    <section
      aria-roledescription="carousel"
      aria-label="Welcome to House of Classic"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      className="relative isolate overflow-hidden bg-wine text-cream"
    >
      {slides.map((slide, index) => (
        <div key={slide.image} aria-hidden={index !== active} className={`absolute inset-0 -z-10 transition-opacity duration-[1200ms] ${index === active ? "opacity-100" : "opacity-0"}`}>
          <Image
            src={photo(slide.image)}
            alt={slide.caption}
            fill
            preload={index === 0}
            loading={index === 0 ? undefined : "eager"}
            sizes="100vw"
            className={`object-cover ${slide.position} ${index === active && playing ? "animate-kenburns" : ""}`}
          />
        </div>
      ))}
      {/* Same bottom-up wine gradient as the Gallery slideshow, plus a left-side one so the banner text stays readable. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-wine via-wine/30 to-wine/10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-wine/35 lg:bg-transparent lg:bg-gradient-to-r lg:from-wine/80 lg:via-wine/30 lg:via-40% lg:to-transparent lg:to-65%" />

      <div className="mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-6xl flex-col justify-end px-6 pb-16 pt-14 lg:min-h-[46rem] lg:pr-44">
        <div className="min-w-0">{children}</div>
      </div>

      {/* Filmstrip: thumbnails that light up as the slideshow moves (wide screens only) */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${slide.caption}`}
            className={`relative h-16 w-24 overflow-hidden rounded-lg border-2 transition duration-500 ${
              i === active ? "scale-110 border-gold shadow-xl shadow-gold/30" : "border-cream/30 opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={photo(slide.image)} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Progress bar restarts on every slide change; hidden while paused */}
      {playing && <div key={active} aria-hidden className="absolute bottom-0 left-0 h-1 bg-gold" style={{ animation: `progress ${INTERVAL}ms linear forwards` }} />}
    </section>
  );
}
