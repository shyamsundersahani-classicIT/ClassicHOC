"use client";

import Link from "next/link";
import { useState } from "react";
import BookingMenu from "@/components/BookingMenu";
import { nav, site } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-wine/90 text-cream shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-xl tracking-wide text-gold">
          {site.name}
        </Link>

        <nav className="hidden gap-6 text-sm lg:flex" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition hover:text-gold hover:after:scale-x-100">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block"><BookingMenu /></div>

        <button
          type="button"
          className="min-h-11 rounded border border-cream/30 px-3 py-2 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-cream/10 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col px-4 py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-cream/20 py-3"><BookingMenu mobile onNavigate={() => setOpen(false)} /></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
