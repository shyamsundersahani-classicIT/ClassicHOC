import type { Metadata } from "next";
import Slideshow, { type Slide } from "@/components/Slideshow";
import Gallery from "@/components/Gallery";
import { getPhotos, photo } from "@/lib/photos";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of the pool, party garden, dance floor, bedrooms, cinema and more at House of Classic, Jaipur.",
};

const featured: Slide[] = pages.gallery.slides.map((s) => ({ src: photo(s.image), title: s.title, note: s.note }));

export default function GalleryPage() {
  return (
    <>
      <Slideshow slides={featured} />
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">The full collection</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{pages.gallery.heading}</h2>
            <div className="mx-auto mt-6 h-px w-40 overflow-hidden bg-gold/30">
              <div className="h-full w-full origin-left animate-[draw_1.4s_ease-out_forwards] bg-gold" />
            </div>
          </div>
          <Gallery photos={getPhotos()} />
        </div>
      </section>
    </>
  );
}
