import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";
import { amenities, eventTypes, fillPrices, pages, rupees, site, splashPackages } from "@/lib/site";
import { getPhotos, photo } from "@/lib/photos";

const mapQuery = encodeURIComponent(`${site.name}, ${site.address.street}, ${site.address.locality}`);

export default function Home() {
  const home = pages.home;
  const photos = getPhotos();
  const mosaic = home.galleryImages.flatMap((name) => photos.filter((p) => p.src === photo(name)));
  const bandItems = [...eventTypes, ...eventTypes];

  return (
    <>
      {/* HERO */}
      <section className="overflow-hidden bg-wine text-cream">
        <div className="mx-auto grid max-w-[1600px] lg:min-h-[640px] lg:grid-cols-2">
          <HeroSlideshow />
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:order-1 lg:px-12 xl:px-20">
            <p className="animate-rise text-xs font-bold uppercase tracking-[0.25em] text-gold">House of Classic · Jaipur</p>
            <h1 className="animate-rise mt-4 max-w-xl font-serif text-[2.75rem] leading-[1.1] sm:text-6xl xl:text-7xl" style={{ animationDelay: "0.1s" }}>
              {home.heroTitle}{" "}
              <span className="gold-text italic">{home.heroTitleAccent}</span>
            </h1>
            <p className="animate-rise mt-5 max-w-lg text-base leading-relaxed text-cream/85 sm:text-lg" style={{ animationDelay: "0.2s" }}>
              {home.heroText}
            </p>
            <div className="animate-rise mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: "0.3s" }}>
              <Link href="/contact" className="rounded-full bg-gold px-6 py-3.5 text-center font-bold text-ink transition hover:bg-cream">
                Check Availability
              </Link>
              <Link href="/splash-relax" className="rounded-full border border-cream/60 px-6 py-3.5 text-center font-bold transition hover:bg-cream hover:text-ink">
                Explore Day Packages
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-cream/70">{home.heroNote}</p>
          </div>
        </div>
        <div className="border-t border-cream/15 bg-ink/30">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 px-6 py-4 text-center text-sm text-cream/85 sm:justify-between">
            {home.highlights.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
        </div>
      </section>

      {/* EVENT BAND */}
      <section aria-label="Suitable for" className="overflow-hidden bg-gold py-4 text-ink">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-serif text-xl italic">
          {bandItems.map((e, i) => (
            <span key={i} className="flex items-center gap-10">
              {e}
              <span aria-hidden className="not-italic">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-blush"><div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">About the villa</p>
          <h2 data-reveal className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{home.introHeading}</h2>
          {home.introParagraphs.map((text, i) => (
            <p data-reveal key={i} className={`${i === 0 ? "mt-6" : "mt-4"} leading-relaxed text-muted`}>
              {text}
            </p>
          ))}
          <Link href="/amenities" className="mt-8 inline-flex items-center gap-2 font-bold text-teal hover:text-ink">
            Explore the amenities <span aria-hidden>→</span>
          </Link>
        </div>
        <div data-reveal className="relative h-[480px]">
          <div className="absolute left-0 top-0 h-[78%] w-[62%] overflow-hidden rounded-2xl shadow-2xl">
            <Image src={photo(home.introImages[0])} alt="Inside House of Classic" fill sizes="30vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 h-[60%] w-[55%] overflow-hidden rounded-2xl border-[10px] border-cream shadow-2xl">
            <Image src={photo(home.introImages[1])} alt="Inside House of Classic" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="absolute right-4 top-6 rounded-full bg-rose px-4 py-2 text-xs font-bold text-cream shadow-lg">
            {home.introBadge}
          </div>
        </div>
      </div></section>

      {/* STATS */}
      <section className="wine-gradient py-16 text-cream">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          {home.stats.map(({ value, label }) => (
            <div data-reveal key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="gold-text font-serif text-5xl">{value}</dd>
              <dd className="mt-2 text-sm uppercase tracking-widest text-cream/70">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* AMENITIES BENTO */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">Amenities</p>
            <h2 data-reveal className="mt-3 font-serif text-4xl md:text-5xl">{home.amenitiesHeading}</h2>
          </div>
          <Link href="/amenities" className="font-bold text-teal hover:text-ink">All amenities →</Link>
        </div>
        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
          {amenities.slice(0, 5).map((a, i) => (
            <div
              data-reveal
              key={a.title}
              className={`group relative overflow-hidden rounded-2xl bg-night text-cream ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              {a.image ? (
                <Image src={photo(a.image)} alt={a.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-110" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-gold">{a.tag}</span>
                <h3 className="mt-1 font-serif text-2xl">{a.title}</h3>
                <p className="mt-2 max-h-0 overflow-hidden text-sm text-cream/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                  {a.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPLASH & RELAX TEASER */}
      <section className="teal-gradient relative isolate overflow-hidden py-24 text-cream grain">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cream/80">Day packages</p>
            <h2 data-reveal className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{home.splashHeading}</h2>
            <p className="mt-5 text-cream/85">{fillPrices(home.splashText)}</p>
            <Link href="/splash-relax" className="mt-8 inline-block rounded-full bg-cream px-7 py-3 font-bold text-ink transition hover:bg-gold">
              See packages
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {splashPackages.map((p) => (
              <Link data-reveal href={`/splash-relax#${p.id}`} key={p.id} className={`rounded-2xl border bg-ink/20 p-4 backdrop-blur transition hover:bg-ink/40 sm:p-5 ${p.recommended ? "border-gold" : "border-cream/25"}`}>
                <p className="text-sm text-cream/80">{p.name}</p>
                <p className="mt-2 font-serif text-3xl">{rupees(p.price)}</p>
                <p className="mt-2 text-xs leading-relaxed text-cream/80">{p.timing} · {p.hours} hours</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MOSAIC GALLERY */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">Gallery</p>
          <h2 data-reveal className="mt-3 font-serif text-4xl md:text-5xl">{home.galleryHeading}</h2>
        </div>
        <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:grid-cols-4">
          {mosaic.map((p, i) => (
            <div
              data-reveal
              key={p.src}
              className={`relative overflow-hidden rounded-xl bg-night ${i === 0 ? "col-span-2 row-span-2 md:col-span-2" : ""}`}
            >
              <Image src={p.src} alt="House of Classic interior" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition duration-700 hover:scale-110" />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/gallery" className="rounded-full border-2 border-ink px-7 py-3 font-bold hover:bg-ink hover:text-cream">
            View full gallery
          </Link>
        </div>
      </section>

      {/* MAP + CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="wine-gradient grid overflow-hidden rounded-3xl text-cream md:grid-cols-2">
          <div className="flex flex-col justify-center p-10 md:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Visit us</p>
            <h2 data-reveal className="mt-4 font-serif text-4xl">{home.ctaHeading}</h2>
            <p className="mt-4 text-cream/80">
              {site.address.street}, {site.address.locality} {site.address.postalCode}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener" className="gold-shine rounded-full px-6 py-3 font-bold text-ink">
                WhatsApp us
              </a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="rounded-full border border-cream/60 px-6 py-3 font-bold hover:bg-cream hover:text-ink">
                Call {site.phone}
              </a>
            </div>
          </div>
          <iframe
            title="House of Classic on Google Maps"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-80 w-full border-0 md:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
