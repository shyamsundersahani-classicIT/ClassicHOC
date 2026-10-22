import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { amenities } from "@/lib/site";
import { photo } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Amenities",
  description: "Pool, dance floor, party garden, cinema hall, terrace gym, bar, game zone and bedrooms at House of Classic, Jaipur.",
};

export default function Amenities() {
  return (
    <>
      <section className="relative isolate flex min-h-[50vh] items-center justify-center overflow-hidden text-center text-cream grain">
        <Image src={photo("ANK01934_1")} alt="Glass-roof swimming pool" fill priority sizes="100vw" className="-z-10 animate-kenburns object-cover" />
        <div className="absolute inset-0 -z-10 bg-ink/65" />
        <div className="px-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">House of Classic</p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">Amenities</h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/85">Splash, relax and celebrate with everything you need under one roof.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-20 px-6 py-24">
        {amenities.map((a, i) => (
          <div key={a.title} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
            <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              {a.image ? (
                <Image src={photo(a.image)} alt={a.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition duration-700 hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-gold to-gold-dark font-serif text-4xl text-ink">
                  {a.title}
                </div>
              )}
            </div>
            <div data-reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">{String(i + 1).padStart(2, "0")} · {a.tag}</p>
              <h2 className="mt-3 font-serif text-4xl">{a.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{a.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-night py-20 text-center text-cream">
        <p className="mx-auto max-w-2xl px-6 text-cream/85">
          Also included: outdoor and indoor kitchens, living and dining halls, an outdoor glass lounge, a suite room with
          steam and jacuzzi tub, and a rain dance area.
        </p>
        <Link href="/contact" className="gold-shine mt-8 inline-block rounded-full px-8 py-4 font-bold text-ink">
          Check availability
        </Link>
      </section>
    </>
  );
}
