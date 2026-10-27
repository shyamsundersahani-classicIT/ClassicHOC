import "server-only";
import { readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Where admin edits are saved.
//
// - "github": used when GITHUB_TOKEN is set (the live site on Vercel, whose disk
//   is read-only). Each save is a commit to the repo; Vercel then rebuilds the
//   site, so changes go live after about 1-2 minutes.
// - "local": used otherwise (npm run dev on your own computer). Files are
//   written straight to disk and the dev server shows them immediately.
//
// GitHub settings, all from environment variables:
//   GITHUB_TOKEN   fine-grained token with "Contents: read and write" on the repo
//   GITHUB_REPO    owner/name, default shyamsundersahani-classicIT/ClassicHOC
//   GITHUB_BRANCH  the branch Vercel deploys, default main
//   GITHUB_DIR     folder of this app inside the repo, default house-of-classic

export type StorageMode = "github" | "local";
export const storageMode = (): StorageMode => (process.env.GITHUB_TOKEN ? "github" : "local");

const repo = () => process.env.GITHUB_REPO || "shyamsundersahani-classicIT/ClassicHOC";
const branch = () => process.env.GITHUB_BRANCH || "main";
const repoPath = (file: string) => [process.env.GITHUB_DIR ?? "house-of-classic", file].filter(Boolean).join("/");

async function github(file: string, init: RequestInit = {}) {
  const url = `https://api.github.com/repos/${repo()}/contents/${encodeURI(repoPath(file))}`;
  const res = await fetch(init.method ? url : `${url}?ref=${encodeURIComponent(branch())}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok && res.status !== 404) throw new Error(`GitHub said ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res;
}

async function githubSha(file: string): Promise<string | undefined> {
  const res = await github(file);
  return res.status === 404 ? undefined : (await res.json()).sha;
}

const local = (file: string) => path.join(process.cwd(), file);

export async function readText(file: string): Promise<string> {
  if (storageMode() === "local") return readFile(local(file), "utf8");
  const res = await github(file);
  if (res.status === 404) throw new Error(`${file} was not found in the repository.`);
  return Buffer.from((await res.json()).content, "base64").toString("utf8");
}

export async function saveFile(file: string, data: Buffer, message: string) {
  if (storageMode() === "local") return writeFile(local(file), data);
  const res = await github(file, {
    method: "PUT",
    body: JSON.stringify({ message, branch: branch(), content: data.toString("base64"), sha: await githubSha(file) }),
  });
  if (!res.ok) throw new Error(`GitHub could not save ${file}.`);
}

export async function removeFile(file: string, message: string) {
  if (storageMode() === "local") return unlink(local(file)).catch((e) => { if (e.code !== "ENOENT") throw e; });
  const sha = await githubSha(file);
  if (!sha) return;
  await github(file, { method: "DELETE", body: JSON.stringify({ message, branch: branch(), sha }) });
}

export async function listFiles(dir: string): Promise<string[]> {
  if (storageMode() === "local") return readdir(local(dir));
  const res = await github(dir);
  if (res.status === 404) return [];
  return ((await res.json()) as { name: string; type: string }[]).filter((f) => f.type === "file").map((f) => f.name);
}
