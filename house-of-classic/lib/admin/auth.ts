import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

// One shared admin password, set as the ADMIN_PASSWORD environment variable
// (in .env.local for local work, in Vercel > Settings > Environment Variables
// for the live site). Changing the password signs everyone out.
const COOKIE = "hoc_admin";
const SESSION_DAYS = 7;

// The live site refuses short passwords, so guessing is never practical.
const MIN_LIVE_PASSWORD = 16;
const configuredPassword = () => process.env.ADMIN_PASSWORD ?? "";
export const passwordTooWeak = () =>
  process.env.NODE_ENV === "production" && configuredPassword() !== "" && configuredPassword().length < MIN_LIVE_PASSWORD;
export const adminPassword = () => (passwordTooWeak() ? "" : configuredPassword());

// Failed sign-ins are limited per visitor (IP address) and across the whole
// site, which stops password guessing. The counts live in server memory, so a
// restart clears them; on Vercel each server instance keeps its own count.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_IP = 5;
const MAX_FAILS_TOTAL = 100;
const fails = new Map<string, { count: number; since: number }>();
let total = { count: 0, since: 0 };

const fresh = (entry: { count: number; since: number } | undefined, now: number) =>
  entry && now - entry.since < WINDOW_MS ? entry : { count: 0, since: now };

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

export function loginBlocked(ip: string) {
  const now = Date.now();
  return fresh(fails.get(ip), now).count >= MAX_FAILS_PER_IP || fresh(total, now).count >= MAX_FAILS_TOTAL;
}

export function recordFailedLogin(ip: string) {
  const now = Date.now();
  if (fails.size > 10_000) fails.clear(); // never let the list grow without limit
  const entry = fresh(fails.get(ip), now);
  fails.set(ip, { count: entry.count + 1, since: entry.since });
  total = fresh(total, now);
  total.count++;
}

export const clearFailedLogins = (ip: string) => fails.delete(ip);

const sign = (value: string) => createHmac("sha256", `hoc-admin:${adminPassword()}`).update(value).digest("hex");

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const checkPassword = (attempt: string) => adminPassword() !== "" && safeEqual(sign(attempt), sign(adminPassword()));

export async function startSession() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  (await cookies()).set(COOKIE, `${expires}.${sign(String(expires))}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminPassword()) return false;
  const [expires, signature] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  return Boolean(expires && signature) && Number(expires) > Date.now() && safeEqual(signature, sign(expires));
}

// Every server action must call this: actions can be called directly, not only from the admin page.
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Your session has expired. Please sign in again.");
}
