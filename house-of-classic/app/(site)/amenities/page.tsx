import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { amenities, pages } from "@/lib/site";
import { photo } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Amenities",
  description: "Pool, dance floor, party garden, cinema hall, terrace gym, bar, game zone and bedrooms at House of Classic, Jaipur.",
};

export default function Amenities() {
  return (
    <>
      <section className="relative isolate flex min-h-[50vh] items-center justify-center overflow-hidden text-center text-cream grain">
        <Image src={photo(pages.amenities.heroImage)} alt="House of Classic" fill priority sizes="100vw" className="-z-10 animate-kenburns object-cover" />
        <div className="absolute inset-0 -z-10 bg-ink/65" />
        <div className="px-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">House of Classic</p>
          <h1 className="display-xl mt-4 font-serif">Amenities</h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/85">{pages.amenities.heroText}</p>
        </div>
      </section>

      {/* Each amenity is a large photo panel; the panels scroll normally, one after another.
          (A pinned, overlapping "deck of cards" version was tried and dropped: it covered the text.) */}
      <section aria-label="Our amenities" className="space-y-3 bg-cream py-3">
        {amenities.map((a, i) => (
          <article
            key={a.title}
            className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-night text-cream"
          >
            {a.image ? (
              <Image src={photo(a.image)} alt={a.title} fill sizes="100vw" className="-z-10 object-cover" />
            ) : (
              <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-gold-dark via-night to-wine" />
            )}
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
            <div className="mx-auto w-full max-w-6xl px-6 pb-10 sm:pb-16">
              <div data-reveal className="glass max-w-xl rounded-[28px] p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
                  {String(i + 1).padStart(2, "0")} / {String(amenities.length).padStart(2, "0")} · {a.tag}
                </p>
                <h2 className="display-lg mt-3 font-serif">{a.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-cream/90 sm:text-lg">{a.text}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-night py-20 text-center text-cream">
        <p className="mx-auto max-w-2xl px-6 text-cream/85">
          {pages.amenities.alsoIncluded}
        </p>
        <Link href="/contact" className="gold-shine mt-8 inline-block rounded-full px-8 py-4 font-bold text-ink">
          Check availability
        </Link>
      </section>
    </>
  );
}
