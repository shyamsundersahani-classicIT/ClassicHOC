import type { Metadata } from "next";
import Image from "next/image";
import { tieUps } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Tie-ups",
  description: "Trusted event management and catering partners for events at House of Classic, Jaipur.",
};

export default function TieUps() {
  const { events, food } = tieUps;
  return (
    <section className="mx-auto max-w-5xl space-y-16 px-4 py-16">
      <h1 data-reveal className="text-center font-serif text-4xl">Our Tie-ups</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
          <Image src={`/images/${events.image}.webp`} alt={events.name} fill sizes="(min-width:768px) 50vw, 100vw" className="object-contain p-4" />
        </div>
        <div data-reveal>
          <h2 className="font-serif text-2xl">For Event &amp; Decoration</h2>
          <p className="mt-2 font-bold">{events.name}</p>
          <p className="mt-3 leading-relaxed text-muted">{events.text}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {events.contacts.map((c) => <li key={c}>{c}</li>)}
            <li><a href={events.website} className="underline" rel="noopener" target="_blank">{events.website}</a></li>
          </ul>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div data-reveal>
          <h2 className="font-serif text-2xl">For Food</h2>
          <p className="mt-2 font-bold">{food.name}</p>
          <p className="mt-3 leading-relaxed text-muted">{food.text}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {food.contacts.map((c) => <li key={c}>{c}</li>)}
          </ul>
          <a href="/menus/Menu-chowka.pdf" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full bg-wine px-6 py-3 font-bold text-cream transition hover:bg-ink">
            View full menu (PDF)
          </a>
          <p className="mt-3 text-sm text-muted">4 pages · PDF · 1.8 MB</p>
        </div>
        <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
          <Image src={`/images/${food.menuImage}.webp`} alt="Chowka logo" fill sizes="(min-width:768px) 50vw, 100vw" className="object-contain p-4" />
        </div>
      </div>
    </section>
  );
}
