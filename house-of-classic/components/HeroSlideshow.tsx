"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { site } from "@/lib/site";

const slides = [
  { image: site.heroImage, caption: "The pool at House of Classic", position: "object-[center_65%] lg:object-[40%_center]" },
  { image: "IMG_5709-1", caption: "The party garden", position: "object-[center_75%]" },
  { image: "IMG_5667", caption: "A lounge for your get-togethers", position: "object-center" },
  { image: "IMG_5619", caption: "The 17-seat cinema", position: "object-center" },
];

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const preference = window.matchMedia(motionQuery);
  preference.addEventListener("change", callback);
  return () => preference.removeEventListener("change", callback);
}

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, () => window.matchMedia(motionQuery).matches, () => true);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, active]);

  const changeSlide = (direction: number) => setActive((current) => (current + direction + slides.length) % slides.length);

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Photos of House of Classic" className="relative h-60 overflow-hidden bg-wine sm:h-80 lg:order-2 lg:h-auto">
      {slides.map((slide, index) => (
        <div key={slide.image} aria-hidden={index !== active} className={`absolute inset-0 transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`}>
          <Image
            src={`/images/${slide.image}.webp`}
            alt={slide.caption}
            fill
            preload={index === 0}
            loading={index === 0 ? undefined : "eager"}
            sizes="(min-width:1600px) 800px, (min-width:1024px) 50vw, 100vw"
            className={`object-cover ${slide.position} ${index === active && !paused && !reducedMotion ? "animate-kenburns" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-4 pb-3 pt-10 text-cream sm:px-6">
        <p className="text-sm" aria-live={paused || reducedMotion ? "polite" : "off"}>{slides[active].caption}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs tabular-nums text-cream/80">{active + 1} / {slides.length}</span>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous hero photo" onClick={() => changeSlide(-1)} className="h-11 w-11 rounded-full border border-cream/40 bg-ink/30 text-xl hover:bg-wine">‹</button>
            {!reducedMotion && <button type="button" aria-label={paused ? "Play hero slideshow" : "Pause hero slideshow"} onClick={() => setPaused(!paused)} className="h-11 rounded-full border border-cream/40 bg-ink/30 px-4 text-xs font-bold hover:bg-wine">{paused ? "Play" : "Pause"}</button>}
            <button type="button" aria-label="Next hero photo" onClick={() => changeSlide(1)} className="h-11 w-11 rounded-full border border-cream/40 bg-ink/30 text-xl hover:bg-wine">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
