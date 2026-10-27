import type { Metadata } from "next";
import { connection } from "next/server";
import AdminEditor from "@/components/admin/AdminEditor";
import LoginForm from "@/components/admin/LoginForm";
import { adminPassword, isAdmin } from "@/lib/admin/auth";
import { listFiles, readText, storageMode } from "@/lib/admin/store";
import { IMAGE_FILE } from "@/lib/image-path";
import type { Content } from "@/lib/site";
import type { Legal } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  // Render on every request: the password and login cookie are only known then.
  await connection();
  if (!adminPassword()) {
    return (
      <AdminShell>
        <h1 className="font-serif text-3xl">Admin is switched off</h1>
        <p className="mt-4 text-muted">
          Set the <code className="rounded bg-blush px-1">ADMIN_PASSWORD</code> environment variable to turn on the admin page.
          See HANDOVER.md, section &ldquo;Admin page&rdquo;.
        </p>
      </AdminShell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <AdminShell>
        <LoginForm />
      </AdminShell>
    );
  }

  // Always load the latest saved copy (from GitHub on the live site), not the
  // copy baked into this build, so a save shows up here straight away.
  const [content, legal, files] = await Promise.all([
    readText("data/content.json").then((t) => JSON.parse(t) as Content),
    readText("data/legal.json").then((t) => JSON.parse(t) as Legal),
    listFiles("public/images"),
  ]);
  const images = files.filter((f) => IMAGE_FILE.test(f)).sort((a, b) => a.localeCompare(b));

  return <AdminEditor initialContent={content} initialLegal={legal} initialImages={images} mode={storageMode()} />;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-blush px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">{children}</div>
    </main>
  );
}
