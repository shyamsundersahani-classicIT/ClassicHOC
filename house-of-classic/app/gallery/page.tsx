import type { Metadata } from "next";
import Slideshow, { type Slide } from "@/components/Slideshow";
import Gallery from "@/components/Gallery";
import { getPhotos, photo } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of the pool, party garden, dance floor, bedrooms, cinema and more at House of Classic, Jaipur.",
};

const featured: Slide[] = [
  { src: photo("ANK01934_1"), title: "The glass-roof pool", note: "Swim under open skies, even when it rains." },
  { src: photo("IMG_5599"), title: "Pool with a rainbow", note: "Light plays across the water all afternoon." },
  { src: photo("ANK01994-1"), title: "The balcony", note: "Sunrise and sunset views over Jaipur." },
  { src: photo("IMG_5619"), title: "The 17-seat cinema", note: "Recliners, surround sound and a private screen." },
  { src: photo("IMG_5601"), title: "The game zone", note: "Pool table, table tennis and more." },
  { src: photo("IMG_5709-1"), title: "The party garden", note: "Room for 70 guests under the open sky." },
];

export default function GalleryPage() {
  return (
    <>
      <Slideshow slides={featured} />
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">The full collection</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Every corner of the villa</h2>
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
