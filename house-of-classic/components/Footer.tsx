import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  const links = [
    { href: "/rules-regulations", label: "House Rules" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/cancellation-refund-policy", label: "Cancellation & Refund Policy" },
  ];

  return (
    <footer className="wine-gradient text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl text-gold">{site.name}</p>
          <p className="mt-3 text-sm">{site.address.street}, {site.address.locality} {site.address.postalCode}</p>
        </div>
        <div className="text-sm">
          <p className="font-bold text-cream">Contact</p>
          <p className="mt-3">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-gold">{site.phone}</a>
          </p>
          <p>
            <a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a>
          </p>
        </div>
        <div className="text-sm">
          <p className="font-bold text-cream">Policies</p>
          <ul className="mt-3 space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
