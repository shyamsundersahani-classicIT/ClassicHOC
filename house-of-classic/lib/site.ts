// Business details, rates and page text live in data/content.json, which the
// admin page (/admin) edits. This file re-exports them under stable names so
// pages don't need to know where the content is stored.
import rawContent from "@/data/content.json";

// A guest review quote. The list can be empty in content.json, so its item type is spelled out here.
export type Quote = { name: string; date: string; text: string };

type Raw = typeof rawContent;
type Reviews = Omit<Raw["pages"]["home"]["reviews"], "quotes"> & { quotes: Quote[] };
type Home = Omit<Raw["pages"]["home"], "reviews"> & { reviews: Reviews };
export type Content = Omit<Raw, "pages"> & { pages: Omit<Raw["pages"], "home"> & { home: Home } };

const content: Content = rawContent;

export const site = {
  ...content.business,
  url: "https://houseofclassic.in",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/amenities", label: "Amenities" },
  { href: "/contact", label: "Contact" },
];

export const amenities = content.amenities;
export const eventTypes = content.eventTypes;
export const pages = content.pages;

export const splashInclusions = content.rates.inclusions;
export const splashSecurityDeposit = content.rates.securityDeposit;
export const splashPackages = content.rates.packages;

export const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

// Lowest package price, for "from ₹..." text that must follow the rate list.
export const fromPrice = rupees(Math.min(...splashPackages.map((p) => p.price)));

// Admin-written text can contain {fromPrice} and {deposit}; they are replaced
// with the live lowest package price and the security deposit.
export const fillPrices = (text: string) =>
  text.replaceAll("{fromPrice}", fromPrice).replaceAll("{deposit}", rupees(splashSecurityDeposit));

// Set only when every package has the same guest limit, so pages can say "all packages".
const guestLimits = new Set(splashPackages.map((p) => p.maxGuests));
export const sharedGuestLimit = guestLimits.size === 1 ? splashPackages[0].maxGuests : null;

export const bookingLinks = [
  { href: "/splash-relax", label: "Aqua Party", description: `Poolside packages · from ${fromPrice}` },
  { href: "/product/hoc-booking", label: "Reserve the Villa", description: "Private stays & lawn celebrations" },
];
