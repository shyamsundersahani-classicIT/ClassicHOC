"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action}>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">House of Classic</p>
      <h1 className="mt-2 font-serif text-3xl">Website admin</h1>
      <label htmlFor="password" className="mt-8 block text-sm font-bold">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        className="mt-2 w-full rounded-lg border border-ink/20 px-3 py-2.5 focus:border-teal focus:outline-none"
      />
      {state && !state.ok && <p role="alert" className="mt-3 text-sm font-bold text-rose">{state.message}</p>}
      <button type="submit" disabled={pending} className="mt-6 w-full rounded-full bg-wine py-3 font-bold text-cream hover:bg-ink disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
