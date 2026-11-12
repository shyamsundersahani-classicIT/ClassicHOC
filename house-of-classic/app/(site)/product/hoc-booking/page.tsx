import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reserve the Villa",
  description: "Plan a private villa stay or lawn celebration at House of Classic, Jaipur. Explore evening packages and enquire about your preferred dates.",
};

// `includes` / `excludes` are the spaces as listed on the "Lawn & Party Packages" rate chart (HOC - Lawn Area_R2_12082026.pdf).
const parties = [
  { name: "Lawn Party", price: "20,000", included: "Lawn area", excluded: "Rooms, cinema, recreational area, bar, dining and pool.",
    includes: ["Lawn Area"], excludes: ["Rooms", "Cinema", "Recreational Area", "Bar & Dining", "Pool Area"] },
  { name: "Premium Party", price: "30,000", included: "Lawn, recreational area, bar, dining and pool", excluded: "Rooms and cinema.",
    includes: ["Lawn Area", "Recreational Area", "Bar", "Dining", "Pool"], excludes: ["Rooms", "Cinema"] },
  { name: "Entire House Party", price: "40,000", included: "Lawn, recreational area, bar, indoor kitchen, room, cinema and pool", excluded: "No space exclusions listed in this package.",
    includes: ["Lawn Area", "Recreational Area", "Bar", "Indoor Kitchen", "Room", "Cinema", "Pool Area"], excludes: [] },
];
const partyTiming = "6:00 PM – 1:00 AM";

export default function VillaBooking() {
  return <>
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose">Book Your Stay · Jaipur</p>
        <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">A place to stay.<br /><span className="text-teal italic">Room to celebrate.</span></h1>
        <p className="mt-6 max-w-lg leading-relaxed text-muted">Make yourself at home at House of Classic. Plan a private villa getaway or bring everyone together for an evening celebration.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#enquire" className="rounded-full bg-wine px-6 py-3 font-bold text-cream hover:bg-ink">Enquire about a stay</a>
          <a href="#party-packages" className="rounded-full border border-ink/20 px-6 py-3 font-bold hover:bg-blush">Explore party packages</a>
        </div>
        <p className="mt-6 text-sm text-muted">Check-in {site.checkIn} · Check-out {site.checkOut}</p>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-2xl">
        <Image src="/images/ANK01958.webp" alt="Bedroom at House of Classic" fill preload sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </div>
    </section>

    <section className="bg-blush px-6 py-14" id="party-packages">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose">An evening together</p>
        <h2 className="mt-3 font-serif text-4xl">Choose your celebration</h2>
        <p className="mt-4 text-muted">All party packages: 6 PM – 1 AM. These are evening event packages; overnight stays are quoted separately.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {parties.map((party) => <article key={party.name} className="flex flex-col rounded-2xl bg-cream p-6">
            <h3 className="font-serif text-2xl">{party.name}</h3>
            <p className="my-5 font-serif text-4xl">₹{party.price}</p>
            <p className="text-sm leading-relaxed"><strong>Includes:</strong> {party.included}</p>
            <p className="mb-6 mt-3 text-sm leading-relaxed text-muted">{party.name === "Entire House Party" ? party.excluded : `Not included: ${party.excluded}`}</p>
            <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hello, I'd like to enquire about the ${party.name} package (₹${party.price}, 6 PM – 1 AM). My preferred date and guest count: `)}`} target="_blank" rel="noopener noreferrer" className="mt-auto rounded-full border border-ink/20 px-4 py-3 text-center text-sm font-bold hover:bg-gold" aria-label={`Enquire about ${party.name} on WhatsApp`}>Check availability ↗</a>
          </article>)}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted">Food &amp; beverages, decoration, DJ/music and additional or customised services are charged separately. Confirm guest capacity, availability and the final quote with our team.</p>
        <Link href="/splash-relax" className="mt-6 inline-block font-bold underline underline-offset-4">Prefer a pool party? Explore Aqua Party packages →</Link>
      </div>
    </section>

    {/* Comparison table in the layout of the "Lawn & Party Packages" rate chart; open by default */}
    <section className="mx-auto max-w-6xl px-6 pt-16">
      <details open className="rounded-2xl border border-ink/15 p-6">
        <summary id="party-comparison-heading" className="cursor-pointer font-serif text-2xl">Compare lawn &amp; party packages</summary>
        <p id="party-comparison-help" className="mt-3 text-sm text-muted">What each package includes, side by side. On smaller screens, scroll across to see every column.</p>
        <div role="region" aria-labelledby="party-comparison-heading" aria-describedby="party-comparison-help" tabIndex={0} className="mt-6 overflow-x-auto rounded-xl border border-ink/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <caption className="sr-only">Lawn and party packages: spaces included and not included, timing and price.</caption>
            <thead className="bg-wine text-cream">
              <tr>
                <th scope="col" className="w-14 p-4 text-center">No.</th>
                <th scope="col" className="p-4">Package</th>
                <th scope="col" className="p-4">Access / Inclusions</th>
                <th scope="col" className="p-4">Not Included</th>
                <th scope="col" className="whitespace-nowrap p-4">Timing</th>
                <th scope="col" className="p-4 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {parties.map((party, i) => (
                <tr key={party.name} className="border-t border-ink/10 odd:bg-white even:bg-blush/40">
                  <td className="p-4 text-center font-bold text-muted">{i + 1}</td>
                  <th scope="row" className="p-4 font-serif text-lg font-normal">{party.name} Package</th>
                  <td className="p-4">{party.includes.join(" + ")}</td>
                  <td className="p-4 text-muted">{party.excludes.length ? party.excludes.join(", ") : <span aria-label="Nothing excluded">—</span>}</td>
                  <td className="whitespace-nowrap p-4">{partyTiming}</td>
                  <td className="whitespace-nowrap p-4 text-right font-serif text-xl">₹{party.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 rounded-xl bg-blush p-4 text-sm leading-relaxed">
          <strong className="text-rose">Note:</strong> Food &amp; beverages, decoration, DJ/music, and any other additional or customised services are not included in the package price and will be charged separately.
        </p>
      </details>
    </section>

    <section id="enquire" className="mx-auto grid max-w-6xl scroll-mt-24 gap-10 px-6 py-16 md:grid-cols-[1fr_1.4fr]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose">Let’s plan your visit</p>
        <h2 className="mt-3 font-serif text-4xl">Reserve the villa</h2>
        <p className="mt-5 leading-relaxed text-muted">Share your dates, guest count and plans. Our team will confirm availability and a quote for your stay on WhatsApp.</p>
        <p className="mt-4 text-sm text-muted">This is an enquiry. Your reservation is confirmed directly by our team.</p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm underline underline-offset-4"><Link href="/rules-regulations">House rules</Link><Link href="/cancellation-refund-policy">Cancellation policy</Link></div>
      </div>
      <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8"><EnquiryForm defaultPackage="Private villa stay" /></div>
    </section>
  </>;
}
