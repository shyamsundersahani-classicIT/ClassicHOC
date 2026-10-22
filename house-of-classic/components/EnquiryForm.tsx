"use client";

import { useState } from "react";
import { site } from "@/lib/site";

// No backend needed: the form opens WhatsApp with the enquiry filled in.
// The same message is also available by email from the mailto link below.
export default function EnquiryForm({ defaultPackage = "" }: { defaultPackage?: string }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", guests: "", type: "", message: "" });
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const buildMessage = () =>
    [
      `Enquiry from ${form.name || "website visitor"}`,
      `Phone: ${form.phone}`,
      form.date && `Preferred date: ${form.date}`,
      form.guests && `Guests: ${form.guests}`,
      form.type && `Event / package: ${form.type}`,
      form.message && `Message: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setError("");
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  };

  const input = "w-full rounded border border-ink/20 bg-white px-3 py-2 focus:border-gold focus:outline-none";

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-1 text-sm">
        Full name *
        <input required className={input} value={form.name} onChange={set("name")} autoComplete="name" />
      </label>
      <label className="grid gap-1 text-sm">
        Phone number *
        <input required type="tel" className={input} value={form.phone} onChange={set("phone")} autoComplete="tel" />
      </label>
      <label className="grid gap-1 text-sm">
        Preferred date
        <input type="date" className={input} value={form.date} onChange={set("date")} />
      </label>
      <label className="grid gap-1 text-sm">
        Number of guests
        <input type="number" min={1} className={input} value={form.guests} onChange={set("guests")} />
      </label>
      <label className="grid gap-1 text-sm md:col-span-2">
        Event type or package
        <input
          className={input}
          placeholder="e.g. Birthday party, or Splash & Relax package"
          defaultValue={defaultPackage}
          onChange={set("type")}
        />
      </label>
      <label className="grid gap-1 text-sm md:col-span-2">
        Message
        <textarea rows={4} className={input} value={form.message} onChange={set("message")} />
      </label>

      {error && <p className="text-sm text-red-700 md:col-span-2">{error}</p>}

      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <button type="submit" className="rounded-full bg-ink px-6 py-3 font-bold text-cream hover:bg-gold">
          Send on WhatsApp
        </button>
        <a href={`mailto:${site.email}`} className="text-sm underline hover:text-gold">
          or email us
        </a>
      </div>
    </form>
  );
}
