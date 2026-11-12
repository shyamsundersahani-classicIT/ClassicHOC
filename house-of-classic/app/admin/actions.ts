"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import template from "@/data/content.json";
import legalTemplate from "@/data/legal.json";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/admin/auth";
import { listFiles, readText, removeFile, saveFile, storageMode } from "@/lib/admin/store";
import { IMAGE_FILE } from "@/lib/image-path";
import type { Content } from "@/lib/site";

export type Legal = typeof legalTemplate;
export type Result = { ok: boolean; message: string };

const CONTENT_FILE = "data/content.json";
const LEGAL_FILE = "data/legal.json";
const IMAGE_DIR = "public/images";
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const liveNote = () =>
  storageMode() === "github" ? "The live site updates in about 1-2 minutes, once it rebuilds." : "Saved to this computer.";

// The saved data must have exactly the same keys and value types as the
// bundled file, so a bad save can never break the build.
function shapeError(value: unknown, shape: unknown, at: string): string | null {
  if (Array.isArray(shape)) {
    if (!Array.isArray(value)) return `${at} should be a list`;
    for (let i = 0; i < value.length; i++) {
      const e = shapeError(value[i], shape[0], `${at} item ${i + 1}`);
      if (e) return e;
    }
    return null;
  }
  if (shape && typeof shape === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return `${at} is missing`;
    const keys = Object.keys(shape);
    if (Object.keys(value).length !== keys.length) return `${at} has unexpected fields`;
    for (const k of keys) {
      const e = shapeError((value as Record<string, unknown>)[k], (shape as Record<string, unknown>)[k], `${at}.${k}`);
      if (e) return e;
    }
    return null;
  }
  if (typeof value !== typeof shape) return `${at} should be a ${typeof shape}`;
  if (typeof value === "number" && !Number.isFinite(value)) return `${at} is not a valid number`;
  return null;
}

// The bundled file may have no review quotes yet, so give the shape check an example of one.
const contentShape: Content = structuredClone(template);
contentShape.pages.home.reviews.quotes = [{ name: "", date: "", text: "" }];

function contentError(c: Content): string | null {
  const shape = shapeError(c, contentShape, "content");
  if (shape) return shape;
  const { packages, inclusions, securityDeposit } = c.rates;
  if (packages.length === 0) return "Keep at least one package.";
  if (securityDeposit < 0) return "The security deposit can't be negative.";
  const ids = new Set<string>();
  for (const p of packages) {
    if (!p.name.trim()) return "Every package needs a name.";
    if (!/^[a-z0-9-]+$/.test(p.id) || ids.has(p.id)) return `Package "${p.name}" has an invalid or duplicate ID.`;
    ids.add(p.id);
    if (p.price < 0 || p.hours < 0 || p.maxGuests < 0) return `Package "${p.name}" has a negative number.`;
    if (p.inclusions.some((i) => !inclusions.includes(i))) return `Package "${p.name}" includes a space that isn't in the inclusions list.`;
  }
  if (c.pages.home.slides.length === 0) return "The home slideshow needs at least one photo.";
  if (c.pages.home.introImages.length !== 2) return "The home intro needs exactly two photos.";
  if (c.pages.home.tiles.some((t) => !t.href.startsWith("/"))) return "Every banner tile must open a page on this website.";
  const reviews = c.pages.home.reviews;
  if (reviews.rating < 0 || reviews.rating > 5 || reviews.categories.some((cat) => cat.score < 0 || cat.score > 5)) return "Review scores must be between 0 and 5.";
  if (reviews.links.some((l) => !l.site.trim() || !/^https:\/\/\S+\.\S+/.test(l.url))) return "Every booking site needs a name and a link starting with https://";
  if (reviews.quotes.some((q) => !q.text.trim() || !q.name.trim())) return "Every review quote needs the guest's name and the review text.";
  return null;
}

// Every image the content points at must exist, or the build would fail.
async function missingImage(c: Content): Promise<string | null> {
  const files = new Set(await listFiles(IMAGE_DIR));
  const used = [
    c.business.heroImage,
    c.pages.amenities.heroImage,
    c.pages.splash.heroImage,
    ...c.pages.home.introImages,
    ...c.pages.home.galleryImages,
    ...c.pages.home.slides.map((s) => s.image),
    ...c.pages.home.tiles.map((t) => t.image),
    c.pages.home.closing.image,
    ...c.pages.gallery.slides.map((s) => s.image),
    ...c.amenities.map((a) => a.image).filter(Boolean),
  ];
  return used.find((name) => !files.has(name)) ?? null;
}

async function guarded(work: () => Promise<Result>): Promise<Result> {
  try {
    await requireAdmin();
    return await work();
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Something went wrong." };
  }
}

const refreshSite = () => revalidatePath("/", "layout");

export async function login(_: Result | null, form: FormData): Promise<Result> {
  if (!checkPassword(String(form.get("password") ?? ""))) {
    await new Promise((r) => setTimeout(r, 1000)); // slows down password guessing
    return { ok: false, message: "Wrong password." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}

export async function saveContent(content: Content): Promise<Result> {
  return guarded(async () => {
    const error = contentError(content);
    if (error) return { ok: false, message: error };
    const missing = await missingImage(content);
    if (missing) return { ok: false, message: `The photo "${missing}" doesn't exist. Pick another one.` };
    await saveFile(CONTENT_FILE, Buffer.from(`${JSON.stringify(content, null, 2)}\n`), "Admin: update website content");
    refreshSite();
    return { ok: true, message: `Content saved. ${liveNote()}` };
  });
}

export async function saveLegal(legal: Legal): Promise<Result> {
  return guarded(async () => {
    const error = shapeError(legal, legalTemplate, "policies");
    if (error) return { ok: false, message: error };
    await saveFile(LEGAL_FILE, Buffer.from(`${JSON.stringify(legal, null, 1)}\n`), "Admin: update policies");
    refreshSite();
    return { ok: true, message: `Policies saved. ${liveNote()}` };
  });
}

export async function uploadImage(form: FormData): Promise<Result> {
  return guarded(async () => {
    const file = form.get("file");
    if (!(file instanceof Blob)) return { ok: false, message: "No file was received." };
    const ext = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" }[file.type];
    if (!ext) return { ok: false, message: "Only WebP, JPG and PNG photos can be uploaded." };
    if (file.size > MAX_IMAGE_BYTES) return { ok: false, message: "That photo is over 4 MB." };

    const base = String(form.get("name") ?? "photo").toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "photo";
    const existing = new Set(await listFiles(IMAGE_DIR));
    let name = `${base}.${ext}`;
    for (let n = 2; existing.has(name); n++) name = `${base}-${n}.${ext}`;

    await saveFile(`${IMAGE_DIR}/${name}`, Buffer.from(await file.arrayBuffer()), `Admin: add photo ${name}`);
    refreshSite();
    return { ok: true, message: name };
  });
}

export async function deleteImage(name: string): Promise<Result> {
  return guarded(async () => {
    if (!IMAGE_FILE.test(name) || name.includes("/") || name.includes("\\")) return { ok: false, message: "Invalid file name." };
    if (/^(logo|favicon)/i.test(name)) return { ok: false, message: "The logo and site icon can't be deleted here." };
    if ((await readText(CONTENT_FILE)).includes(`"${name}"`)) {
      return { ok: false, message: `"${name}" is used on the website. Replace it everywhere first (and save), then delete it.` };
    }
    await removeFile(`${IMAGE_DIR}/${name}`, `Admin: remove photo ${name}`);
    refreshSite();
    return { ok: true, message: `Deleted ${name}. ${liveNote()}` };
  });
}
