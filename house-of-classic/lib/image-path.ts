// Browser-safe image helpers (lib/photos.ts reads the disk, so it is server-only).
export const IMAGE_FILE = /\.(webp|jpe?g|png)$/i;

// Accepts "IMG_5599" (assumed .webp) or a full file name like "IMG_5599.webp".
export const photo = (name: string): string => `/images/${IMAGE_FILE.test(name) ? name : `${name}.webp`}`;
