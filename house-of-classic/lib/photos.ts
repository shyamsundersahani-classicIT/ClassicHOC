import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { Photo } from "@/components/Gallery";

// Every photo in public/images, except logos, menus, maps and business cards.
const EXCLUDE = /^(logo|favicon|map|index|Menu|satkar|WhatsApp)/i;

// Reads each file's real width and height so the masonry grid keeps its shape.
export function getPhotos(): Photo[] {
  const dir = path.join(process.cwd(), "public/images");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".webp") && !EXCLUDE.test(f))
    .sort()
    .map((f) => {
      const { width, height } = imageSize(readFileSync(path.join(dir, f)));
      return { src: `/images/${f}`, alt: "House of Classic party villa in Jaipur", width: width ?? 1200, height: height ?? 800 };
    });
}

export const photo = (name: string): string => `/images/${name}.webp`;
