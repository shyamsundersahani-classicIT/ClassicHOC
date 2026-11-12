import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";
import SlideToOpen from "@/components/SlideToOpen";
import RatingIcon from "@/components/RatingIcon";
import { amenities, eventTypes, fillPrices, pages, rupees, site, splashPackages } from "@/lib/site";
import { getPhotos, photo } from "@/lib/photos";

const mapQuery = encodeURIComponent(`${site.name}, ${site.address.street}, ${site.address.locality}`);

export default function Home() {
  const home = pages.home;
  const photos = getPhotos();
  const mosaic = home.galleryImages.flatMap((name) => photos.filter((p) => p.src === photo(name)));
  const bandItems = [...eventTypes, ...eventTypes];
  const reviews = home.reviews;

  return (
    <>
      {/* HERO: full-width photo slideshow with the banner text on top */}
      <HeroSlideshow>
        <p className="animate-rise text-xs font-bold uppercase tracking-[0.25em] text-gold">House of Classic · Jaipur</p>
        <h1 className="animate-rise display-xl mt-4 max-w-2xl font-serif" style={{ animationDelay: "0.1s" }}>
          {home.heroTitle}{" "}
          <span className="gold-text pr-[0.12em] italic">{home.heroTitleAccent}</span>
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
        <p className="mt-4 text-xs leading-relaxed text-cream/80">{home.heroNote}</p>

        {/* Photo tiles as menu buttons. On phones they scroll sideways. */}
        <nav
          aria-label="Explore House of Classic"
          className="animate-rise scrollbar-none -mx-6 mt-8 flex max-w-2xl snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0"
          style={{ animationDelay: "0.4s" }}
        >
          {home.tiles.map((t) => (
            <Link
              key={`${t.href}-${t.label}`}
              href={t.href}
              className="group relative block aspect-[4/5] w-40 shrink-0 snap-start overflow-hidden rounded-2xl bg-night ring-1 ring-cream/20 transition hover:ring-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:aspect-[4/3] sm:w-auto"
            >
              <Image src={photo(t.image)} alt="" fill sizes="(min-width:1024px) 14vw, (min-width:640px) 30vw, 160px" className="object-cover transition duration-700 group-hover:scale-110" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/5" />
              <span className="absolute inset-x-0 bottom-0 p-3">
                <span className="block font-serif text-lg leading-tight">{t.label}</span>
                <span className="mt-1 block text-xs leading-snug text-cream/80">{fillPrices(t.text)}</span>
              </span>
            </Link>
          ))}
        </nav>
      </HeroSlideshow>
      <section aria-label="Highlights" className="bg-wine text-cream">
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
          <h2 data-reveal className="display-lg mt-4 font-serif">{home.introHeading}</h2>
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
            <h2 data-reveal className="display-lg mt-3 font-serif">{home.amenitiesHeading}</h2>
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
            <h2 data-reveal className="display-lg mt-4 font-serif">{home.splashHeading}</h2>
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

      {/* ESSENTIALS: plain facts, all taken from wording already used elsewhere on the site */}
      <section aria-labelledby="essentials-heading" className="bg-blush">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_2fr] lg:items-end">
          <h2 id="essentials-heading" data-reveal className="display-lg font-serif">{home.essentials.heading}</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {home.essentials.items.map((item) => (
              <li data-reveal key={item.title} className="rounded-[28px] border border-ink/10 bg-cream p-6 shadow-sm">
                <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-bold text-ink">✓</span>
                <p className="mt-4 font-serif text-2xl leading-tight">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{fillPrices(item.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* GUEST REVIEWS: a framed card with the real Airbnb scores, slide-to-open
          links to the booking sites, and quotes added in the admin */}
      <section aria-labelledby="reviews-heading" className="bg-cream px-4 py-20 sm:px-6 sm:py-24">
        <div className="wine-gradient mx-auto max-w-6xl rounded-[2rem] border border-gold/30 p-6 text-cream shadow-2xl shadow-ink/30 sm:p-10 lg:p-12">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Guest reviews</p>
              <h2 id="reviews-heading" data-reveal className="display-lg mt-3 font-serif">{reviews.heading}</h2>

              <div data-reveal className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                <p className="gold-text font-serif text-7xl leading-none sm:text-8xl">{reviews.rating.toFixed(2)}</p>
                <div>
                  {/* Stars filled to the exact rating: 4.87 shows four full stars and most of the fifth */}
                  <div role="img" aria-label={`Rated ${reviews.rating} out of 5`} className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} aria-hidden className="relative text-3xl leading-none text-cream/25">
                        ★
                        <span className="absolute inset-0 overflow-hidden text-gold" style={{ width: `${Math.min(1, Math.max(0, reviews.rating - i)) * 100}%` }}>★</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-cream/80">from {reviews.count} reviews on {reviews.source}</p>
                </div>
              </div>

              {/* Slide (not click) to open each booking site; they alternate sides */}
              <div className="mt-10 space-y-4">
                {reviews.links.map((link, i) => (
                  <SlideToOpen key={link.url} href={link.url} label={link.site} from={i % 2 ? "right" : "left"} />
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="font-serif text-2xl">Detailed ratings</h3>
              <dl className="mt-6 space-y-5">
                {reviews.categories.map((cat) => (
                  <div data-reveal key={cat.label} className="flex items-center gap-4">
                    <RatingIcon name={cat.label} className="h-7 w-7 shrink-0 text-gold" />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <dt className="text-sm text-cream/90">{cat.label}</dt>
                        <dd className="font-serif text-lg">{cat.score.toFixed(1)}</dd>
                      </div>
                      <div aria-hidden className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream/15">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${(cat.score / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </dl>
              <p className="mt-8 text-right text-xs text-cream/60 lg:mt-auto lg:pt-8">Scores as shown on {reviews.source}, {reviews.checked}.</p>
            </div>
          </div>

          {reviews.quotes.length > 0 && (
            <ul className="mt-12 grid gap-5 border-t border-cream/15 pt-12 md:grid-cols-2 lg:grid-cols-3">
              {reviews.quotes.map((q, i) => (
                <li data-reveal key={i} className="glass flex flex-col rounded-[28px] p-6">
                  <p aria-hidden className="font-serif text-5xl leading-none text-gold">&ldquo;</p>
                  <blockquote className="mt-2 flex-1 leading-relaxed text-cream/90">{q.text}</blockquote>
                  <p className="mt-5 text-sm font-bold">
                    {q.name}
                    {q.date && <span className="font-normal text-cream/70"> · {q.date}</span>}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* MOSAIC GALLERY */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">Gallery</p>
          <h2 data-reveal className="display-lg mt-3 font-serif">{home.galleryHeading}</h2>
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
            <h2 data-reveal className="mt-4 font-serif text-4xl leading-none tracking-tight md:text-5xl">{home.ctaHeading}</h2>
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

      {/* CLOSING CALL TO ACTION */}
      <section aria-labelledby="closing-heading" className="relative isolate overflow-hidden px-6 py-28 text-center text-cream sm:py-36">
        <Image src={photo(home.closing.image)} alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/60 to-ink/85" />
        <h2 id="closing-heading" data-reveal className="display-xl mx-auto max-w-4xl font-serif">{home.closing.heading}</h2>
        <p data-reveal className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/90">{fillPrices(home.closing.text)}</p>
        <div data-reveal className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi, I'd like to check availability at House of Classic. Date: , Guests: ")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-shine rounded-full px-10 py-4 text-lg font-bold text-ink"
          >
            Check availability on WhatsApp
          </a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="rounded-full border border-cream/60 px-8 py-4 font-bold transition hover:bg-cream hover:text-ink">
            Call {site.phone}
          </a>
        </div>
      </section>
    </>
  );
}
