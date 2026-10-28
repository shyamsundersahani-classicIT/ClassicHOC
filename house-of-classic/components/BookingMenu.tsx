"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { bookingLinks } from "@/lib/site";

export default function BookingMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node) && ref.current) ref.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  return (
    <details ref={ref} className="group relative" onKeyDown={(event) => {
      if (event.key === "Escape" && ref.current) {
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    }}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold [&::-webkit-details-marker]:hidden">
        Book Your Stay <span aria-hidden="true" className="transition group-open:rotate-180">⌄</span>
      </summary>
      <nav aria-label="Book Your Stay" className={mobile ? "mt-3 rounded-xl bg-cream p-2 text-ink" : "absolute right-0 mt-3 w-72 rounded-xl border border-ink/10 bg-cream p-2 text-ink shadow-xl"}>
        {bookingLinks.map((item) => (
          <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className="block rounded-lg px-4 py-4 hover:bg-blush focus-visible:bg-blush aria-[current=page]:bg-blush" onClick={() => {
            if (ref.current) ref.current.open = false;
            onNavigate?.();
          }}>
            <span className="block font-bold">{item.label} <span aria-hidden="true">↗</span></span>
            <span className="mt-1 block text-xs text-muted">{item.description}</span>
          </Link>
        ))}
      </nav>
    </details>
  );
}
