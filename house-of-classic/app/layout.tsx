import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveals from "@/components/ScrollReveals";
import PreviewControls from "@/components/PreviewControls";
import EffectsLayer from "@/components/EffectsLayer";
import { site } from "@/lib/site";
import "./globals.css";

// Applies a saved theme choice before the page paints, so switching themes
// on one page doesn't flash the default theme on the next navigation.
// TESTING ONLY: remove this script, PreviewControls and EffectsLayer once a
// theme and effect are kept for good.
const themeBootScript = `(function(){try{var t=localStorage.getItem("hoc-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-lato" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "House of Classic | Luxury Party Villa in Jaipur",
    template: "%s | House of Classic",
  },
  description: site.description,
  icons: { icon: "/images/favicon.webp" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [`/images/${site.heroImage}.webp`],
  },
};

// LodgingBusiness structured data helps Google show the address, phone and reviews.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/images/${site.heroImage}.webp`,
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
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
      </body>
    </html>
  );
}
