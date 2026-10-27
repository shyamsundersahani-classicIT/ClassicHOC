import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// One shared admin password, set as the ADMIN_PASSWORD environment variable
// (in .env.local for local work, in Vercel > Settings > Environment Variables
// for the live site). Changing the password signs everyone out.
const COOKIE = "hoc_admin";
const SESSION_DAYS = 7;

export const adminPassword = () => process.env.ADMIN_PASSWORD ?? "";

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
