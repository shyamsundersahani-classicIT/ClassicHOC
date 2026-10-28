import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fromPrice, pages, rupees, sharedGuestLimit, site, splashInclusions, splashPackages, splashSecurityDeposit } from "@/lib/site";
import { photo } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Splash & Relax Packages",
  description: `Compare Aqua Party packages at House of Classic, Jaipur, from ${fromPrice}. Choose the hours and spaces that suit your group, with pool access and more.`,
};

const text = pages.splash;

export default function SplashRelax() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-wine px-6 py-20 text-center text-cream sm:py-24">
        <Image src={photo(text.heroImage)} alt="House of Classic pool" fill preload sizes="100vw" className="-z-10 object-cover object-[center_65%]" />
        <div className="absolute inset-0 -z-10 bg-ink/70" />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Aqua Party · House of Classic</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl">Splash &amp; <span className="gold-text italic">Relax</span></h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream/90">
          {text.heroText}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20" aria-labelledby="packages-heading">
        <div data-reveal className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose">Choose your experience</p>
          <h2 id="packages-heading" className="mt-3 font-serif text-3xl sm:text-4xl">{text.packagesHeading}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{text.packagesText}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {splashPackages.map((p) => (
            <article data-reveal id={p.id} key={p.id} className={`flex scroll-mt-24 flex-col rounded-2xl border p-6 ${p.recommended ? "border-gold bg-wine text-cream shadow-lg" : "border-ink/10 bg-white"}`}>
              <p className={`text-xs font-bold uppercase tracking-widest ${p.recommended ? "text-gold" : "text-teal"}`}>
                {p.recommended ? "Recommended · " : ""}{p.hours}-hour package
              </p>
              <h3 className="mt-4 font-serif text-2xl">{p.name}</h3>
              <p className="mt-3 text-sm font-bold">{p.timing}</p>
              <p className={`mt-2 text-sm ${p.recommended ? "text-cream/80" : "text-muted"}`}>Maximum {p.maxGuests} guests</p>
              <p className={`mt-6 font-serif text-4xl ${p.recommended ? "text-gold" : "text-ink"}`}>{rupees(p.price)}</p>
              <p className={`mt-2 text-xs ${p.recommended ? "text-cream/80" : "text-muted"}`}>Fixed package charge · INR</p>
              <p className={`mt-3 text-sm leading-relaxed ${p.recommended ? "text-cream/80" : "text-muted"}`}>+ {rupees(splashSecurityDeposit)} refundable security deposit</p>
              <ul className={`my-6 space-y-3 border-t pt-5 text-sm ${p.recommended ? "border-cream/20" : "border-ink/10"}`}>
                {p.inclusions.map((inclusion) => (
                  <li key={inclusion} className="flex gap-2"><span aria-hidden="true" className={p.recommended ? "text-gold" : "text-teal"}>✓</span>{inclusion}</li>
                ))}
              </ul>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`I'd like to check availability for ${p.name} (${p.timing}, ${p.hours} hours, up to ${p.maxGuests} guests), priced at ${rupees(p.price)} plus a ${rupees(splashSecurityDeposit)} refundable security deposit. Preferred date: `)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Check availability for ${p.name}, ${p.timing}, ${rupees(p.price)} on WhatsApp`}
                className={`mt-auto rounded-full px-4 py-3 text-center text-sm font-bold transition ${p.recommended ? "bg-gold text-ink hover:bg-cream" : "bg-ink text-cream hover:bg-wine"}`}
              >Check on WhatsApp</a>
            </article>
          ))}
        </div>

        <details className="mt-10 rounded-2xl border border-ink/15 p-6">
          <summary id="comparison-heading" className="cursor-pointer font-serif text-2xl">Compare all package inclusions</summary>
          <p id="comparison-help" className="mt-3 text-sm text-muted">Included spaces are marked below. On smaller screens, scroll across to compare all packages.</p>
          <div role="region" aria-labelledby="comparison-heading" aria-describedby="comparison-help" tabIndex={0} className="mt-6 overflow-x-auto rounded-xl border border-ink/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <caption className="sr-only">Aqua Party package prices, timings and included spaces.{sharedGuestLimit ? ` All packages allow a maximum of ${sharedGuestLimit} guests.` : ""}</caption>
              <thead className="bg-wine text-cream">
                <tr>
                  <th scope="col" className="p-4">Included space</th>
                  {splashPackages.map((p) => (
                    <th scope="col" key={p.id} className="p-4">
                      <span className="block">{p.name}</span>
                      <span className="mt-2 block font-normal text-cream/80">{p.timing}</span>
                      <span className="mt-2 block text-gold">{rupees(p.price)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {splashInclusions.map((inclusion) => (
                  <tr key={inclusion} className="border-t border-ink/10 odd:bg-white even:bg-blush/40">
                    <th scope="row" className="p-4 font-normal">{inclusion}</th>
                    {splashPackages.map((p) => (
                      <td key={p.id} className="p-4">
                        <span aria-hidden="true" className={p.inclusions.includes(inclusion) ? "font-bold text-teal" : "text-muted"}>{p.inclusions.includes(inclusion) ? "✓" : "—"}</span>
                        <span className="sr-only">{p.inclusions.includes(inclusion) ? "Included" : "Not included"}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <aside data-reveal className="mt-10 rounded-2xl bg-blush p-6 sm:p-8" aria-labelledby="booking-notes">
          <h2 id="booking-notes" className="font-serif text-2xl">Before you book</h2>
          <p className="mt-3 leading-relaxed">A {rupees(splashSecurityDeposit)} refundable security deposit applies to every package, in addition to the package charge.{sharedGuestLimit ? ` All packages are limited to ${sharedGuestLimit} guests.` : ""}</p>
          <p className="mt-3 leading-relaxed text-muted">{text.bookingText}</p>
          <p className="mt-3 leading-relaxed text-muted">Proper swimwear is required. Diving is prohibited. Children under 2 are not permitted in the pool area; guests must supervise themselves and their children.</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
            <Link href="/rules-regulations" className="underline underline-offset-4">House rules</Link>
            <Link href="/cancellation-refund-policy" className="underline underline-offset-4">Cancellation policy</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
