import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveals from "@/components/ScrollReveals";
import PreviewControls from "@/components/PreviewControls";
import EffectsLayer from "@/components/EffectsLayer";
import { site } from "@/lib/site";
import { photo } from "@/lib/photos";

// LodgingBusiness structured data helps Google show the address, phone and reviews.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}${photo(site.heroImage)}`,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", ...site.geo },
  checkinTime: site.checkIn,
  checkoutTime: site.checkOut,
  sameAs: Object.values(site.social).filter(Boolean),
};

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <ScrollReveals />
      <Footer />
      <EffectsLayer />
      <PreviewControls />
    </>
  );
}
