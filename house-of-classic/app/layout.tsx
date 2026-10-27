import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import { site } from "@/lib/site";
import { photo } from "@/lib/photos";
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
    images: [photo(site.heroImage)],
  },
};

// The public site's header, footer and effects are in app/(site)/layout.tsx,
// so the admin page (app/admin) gets a plain page.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
