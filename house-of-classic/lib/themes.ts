// Theme definitions for the live preview switcher (PreviewControls.tsx).
// Each theme only overrides CSS variables — every component already reads
// colors via Tailwind tokens (bg-wine, text-gold, ...) which resolve to
// these variables, so no component code needs to change between themes.
export type Theme = {
  id: string;
  name: string;
  blurb: string;
  // 4 dots shown on the picker card, in the order: dark, accent, gold, light
  swatch: [string, string, string, string];
};

export const themes: Theme[] = [
  {
    id: "wine",
    name: "Royal Wine",
    blurb: "The current theme: deep wine and gold.",
    swatch: ["#3d0f1f", "#1b6d75", "#d4a84f", "#f7e4da"],
  },
  {
    id: "rajwada",
    name: "Rajwada Blue",
    blurb: "Jaipur blue pottery, indigo and gold.",
    swatch: ["#16324f", "#c75b39", "#cf9a3f", "#eaf1f6"],
  },
  {
    id: "sandstone",
    name: "Desert Sandstone",
    blurb: "Amber Fort terracotta and warm sand.",
    swatch: ["#5c2a14", "#8a6b3f", "#d9a441", "#f3e3d1"],
  },
  {
    id: "emerald",
    name: "Emerald Garden",
    blurb: "Deep garden green with soft gold.",
    swatch: ["#163a28", "#2f7a5f", "#cdaa4d", "#e6efe4"],
  },
  {
    id: "midnight",
    name: "Midnight Minimal",
    blurb: "Charcoal and champagne, understated.",
    swatch: ["#1c1c1f", "#3a3a40", "#c9b37e", "#e7e5e2"],
  },
];

export const defaultThemeId = "wine";
