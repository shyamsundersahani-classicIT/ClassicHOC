"use client";

import { useEffect, useState } from "react";
import { deleteImage, logout, saveContent, saveLegal, uploadImage, type Legal, type Result } from "@/app/admin/actions";
import type { Content } from "@/lib/site";
import type { StorageMode } from "@/lib/admin/store";
import { Check, ImagePick, List, Num, Section, Select, StringList, Text, Thumb } from "./fields";

type Tab = "rates" | "text" | "amenities" | "photos" | "business" | "policies";
const tabs: { id: Tab; label: string }[] = [
  { id: "rates", label: "Rates & packages" },
  { id: "text", label: "Page text" },
  { id: "amenities", label: "Amenities" },
  { id: "photos", label: "Photos" },
  { id: "business", label: "Business details" },
  { id: "policies", label: "Policies" },
];

const policyNames: { key: keyof Legal; label: string }[] = [
  { key: "rules", label: "House Rules & Regulations" },
  { key: "cancellation", label: "Cancellation & Refund Policy" },
  { key: "privacy", label: "Privacy Policy" },
];

// Policies are edited as plain text, one paragraph per line.
const legalToText = (legal: Legal) =>
  Object.fromEntries(policyNames.map(({ key }) => [key, legal[key].join("\n")])) as Record<keyof Legal, string>;
const textToLegal = (text: Record<keyof Legal, string>) =>
  Object.fromEntries(policyNames.map(({ key }) => [key, text[key].split("\n").map((l) => l.trim()).filter(Boolean)])) as Legal;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Shrinks photos to at most 1600px on the long side and converts them to WebP
// (JPEG where the browser can't make WebP), so uploads stay small and fast.
async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const encode = (type: string) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, 0.82));
  const webp = await encode("image/webp");
  return webp?.type === "image/webp" ? webp : ((await encode("image/jpeg")) ?? file);
}

export default function AdminEditor({ initialContent, initialLegal, initialImages, mode }: {
  initialContent: Content; initialLegal: Legal; initialImages: string[]; mode: StorageMode;
}) {
  const [tab, setTab] = useState<Tab>("rates");
  const [content, setContent] = useState(initialContent);
  const [legalText, setLegalText] = useState(() => legalToText(initialLegal));
  const [images, setImages] = useState(initialImages);
  const [saved, setSaved] = useState(() => ({ content: JSON.stringify(initialContent), legal: JSON.stringify(legalToText(initialLegal)) }));
  const [status, setStatus] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  const contentDirty = JSON.stringify(content) !== saved.content;
  const legalDirty = JSON.stringify(legalText) !== saved.legal;
  const dirty = contentDirty || legalDirty;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Applies a change to a copy of the content.
  const edit = (change: (draft: Content) => void) =>
    setContent((current) => {
      const draft = structuredClone(current);
      change(draft);
      return draft;
    });

  const save = async () => {
    setBusy(true);
    setStatus(null);
    const results: Result[] = [];
    if (contentDirty) {
      const r = await saveContent(content);
      results.push(r);
      if (r.ok) setSaved((s) => ({ ...s, content: JSON.stringify(content) }));
    }
    if (legalDirty) {
      const r = await saveLegal(textToLegal(legalText));
      results.push(r);
      if (r.ok) setSaved((s) => ({ ...s, legal: JSON.stringify(legalText) }));
    }
    const failed = results.find((r) => !r.ok);
    setStatus(failed ?? results[results.length - 1] ?? null);
    setBusy(false);
  };

  const rates = content.rates;
  const home = content.pages.home;

  return (
    <div className="min-h-screen bg-blush/50">
      <header className="sticky top-0 z-40 bg-wine text-cream shadow-lg">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-serif text-xl text-gold">House of Classic admin</p>
            <p className="text-xs text-cream/70">
              {mode === "github" ? "Saving to the live website (changes appear after a 1-2 minute rebuild)" : "Local mode: saving to the files on this computer"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/" target="_blank" className="rounded-full border border-cream/40 px-4 py-2 text-sm font-bold hover:bg-cream hover:text-ink">View site</a>
            <form action={logout}>
              <button type="submit" className="rounded-full border border-cream/40 px-4 py-2 text-sm font-bold hover:bg-cream hover:text-ink">Sign out</button>
            </form>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || busy}
              className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-ink hover:bg-cream disabled:opacity-50"
            >
              {busy ? "Saving…" : dirty ? "Save changes" : "All saved"}
            </button>
          </div>
        </div>
        {status && (
          <p role="status" className={`px-4 py-2 text-center text-sm font-bold ${status.ok ? "bg-teal text-cream" : "bg-rose text-cream"}`}>
            {status.message}
          </p>
        )}
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4" aria-label="Admin sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={`whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-bold ${tab === t.id ? "bg-blush text-ink" : "text-cream/80 hover:text-gold"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {tab === "rates" && (
          <>
            <Section title="Security deposit">
              <Num label="Refundable security deposit (₹)" value={rates.securityDeposit} onChange={(v) => edit((d) => { d.rates.securityDeposit = v; })} hint="Shown on every package." />
            </Section>

            <Section title="Packages" hint="Splash & Relax packages, shown on the home page and the Splash & Relax page in this order.">
              <List
                items={rates.packages}
                onChange={(packages) => edit((d) => { d.rates.packages = packages; })}
                addLabel="Add package"
                itemLabel={(p) => `${p.name || "New package"} · ${p.timing} · ₹${p.price.toLocaleString("en-IN")}`}
                makeNew={() => ({ id: `package-${Date.now().toString(36)}`, name: "New package", price: 0, timing: "", hours: 0, maxGuests: 10, recommended: false, inclusions: [] })}
                renderItem={(p, update) => (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Text label="Package name" value={p.name} onChange={(name) => update({ ...p, name })} />
                      <Num label="Price (₹)" value={p.price} onChange={(price) => update({ ...p, price })} />
                      <Text label="Timing" value={p.timing} onChange={(timing) => update({ ...p, timing })} hint="For example: 4 PM – 8 PM" />
                      <Num label="Hours" value={p.hours} onChange={(hours) => update({ ...p, hours })} step={0.5} />
                      <Num label="Maximum guests" value={p.maxGuests} onChange={(maxGuests) => update({ ...p, maxGuests })} />
                      <div className="flex items-end pb-2">
                        <Check label="Highlight as recommended" checked={p.recommended} onChange={(recommended) => update({ ...p, recommended })} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Included spaces</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {rates.inclusions.map((inc) => (
                          <Check
                            key={inc}
                            label={inc}
                            checked={p.inclusions.includes(inc)}
                            onChange={(on) => update({ ...p, inclusions: rates.inclusions.filter((i) => (i === inc ? on : p.inclusions.includes(i))) })}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted">Link to this package: /splash-relax#{p.id}</p>
                  </>
                )}
              />
            </Section>

            <Section title="Spaces that can be included" hint="The rows of the comparison table. Renaming a space here renames it in every package.">
              <List
                items={rates.inclusions}
                addLabel="Add space"
                itemLabel={(inc, i) => `${i + 1}. ${inc || "(empty)"}`}
                makeNew={() => `New space ${rates.inclusions.length + 1}`}
                onChange={(next) =>
                  edit((d) => {
                    const old = d.rates.inclusions;
                    // A rename keeps the list the same length but changes one name: match by position.
                    const isRename = next.length === old.length && next.some((n) => !old.includes(n));
                    d.rates.packages.forEach((p) => {
                      p.inclusions = next.filter((n, i) => p.inclusions.includes(isRename ? old[i] : n));
                    });
                    d.rates.inclusions = next;
                  })
                }
                renderItem={(inc, update) => <Text label="Space name" value={inc} onChange={update} />}
              />
            </Section>
          </>
        )}

        {tab === "text" && (
          <>
            <Section title="Home page: top banner">
              <div className="grid gap-3 sm:grid-cols-2">
                <Text label="Heading" value={home.heroTitle} onChange={(v) => edit((d) => { d.pages.home.heroTitle = v; })} />
                <Text label="Heading, gold part" value={home.heroTitleAccent} onChange={(v) => edit((d) => { d.pages.home.heroTitleAccent = v; })} />
              </div>
              <Text label="Paragraph" multiline value={home.heroText} onChange={(v) => edit((d) => { d.pages.home.heroText = v; })} />
              <Text label="Small note under the buttons" value={home.heroNote} onChange={(v) => edit((d) => { d.pages.home.heroNote = v; })} />
              <StringList label="Highlights strip" items={home.highlights} onChange={(v) => edit((d) => { d.pages.home.highlights = v; })} addLabel="Add highlight" />
            </Section>

            <Section title="Home page: scrolling event band">
              <StringList label="Event types" items={content.eventTypes} onChange={(v) => edit((d) => { d.eventTypes = v; })} addLabel="Add event type" />
            </Section>

            <Section title="Home page: about the villa">
              <Text label="Heading" value={home.introHeading} onChange={(v) => edit((d) => { d.pages.home.introHeading = v; })} />
              <StringList label="Paragraphs" multiline items={home.introParagraphs} onChange={(v) => edit((d) => { d.pages.home.introParagraphs = v; })} addLabel="Add paragraph" />
              <Text label="Badge on the photos" value={home.introBadge} onChange={(v) => edit((d) => { d.pages.home.introBadge = v; })} />
            </Section>

            <Section title="Home page: numbers strip">
              <List
                items={home.stats}
                onChange={(v) => edit((d) => { d.pages.home.stats = v; })}
                addLabel="Add number"
                itemLabel={(s) => `${s.value} ${s.label}`}
                makeNew={() => ({ value: "0", label: "New" })}
                renderItem={(s, update) => (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Text label="Number" value={s.value} onChange={(value) => update({ ...s, value })} />
                    <Text label="Label" value={s.label} onChange={(label) => update({ ...s, label })} />
                  </div>
                )}
              />
            </Section>

            <Section title="Home page: other sections">
              <Text label="Amenities heading" value={home.amenitiesHeading} onChange={(v) => edit((d) => { d.pages.home.amenitiesHeading = v; })} />
              <Text label="Packages heading" value={home.splashHeading} onChange={(v) => edit((d) => { d.pages.home.splashHeading = v; })} />
              <Text
                label="Packages paragraph"
                multiline
                value={home.splashText}
                onChange={(v) => edit((d) => { d.pages.home.splashText = v; })}
                hint="Write {fromPrice} where the lowest package price should appear; it updates by itself when rates change."
              />
              <Text label="Gallery heading" value={home.galleryHeading} onChange={(v) => edit((d) => { d.pages.home.galleryHeading = v; })} />
              <Text label="Map section heading" value={home.ctaHeading} onChange={(v) => edit((d) => { d.pages.home.ctaHeading = v; })} />
            </Section>

            <Section title="Amenities page">
              <Text label="Banner text" multiline value={content.pages.amenities.heroText} onChange={(v) => edit((d) => { d.pages.amenities.heroText = v; })} />
              <Text label="“Also included” paragraph" multiline value={content.pages.amenities.alsoIncluded} onChange={(v) => edit((d) => { d.pages.amenities.alsoIncluded = v; })} />
            </Section>

            <Section title="Splash & Relax page">
              <Text label="Banner text" multiline value={content.pages.splash.heroText} onChange={(v) => edit((d) => { d.pages.splash.heroText = v; })} />
              <Text label="Packages heading" value={content.pages.splash.packagesHeading} onChange={(v) => edit((d) => { d.pages.splash.packagesHeading = v; })} />
              <Text label="Packages paragraph" multiline value={content.pages.splash.packagesText} onChange={(v) => edit((d) => { d.pages.splash.packagesText = v; })} />
              <Text
                label="“Before you book” paragraph"
                multiline
                value={content.pages.splash.bookingText}
                onChange={(v) => edit((d) => { d.pages.splash.bookingText = v; })}
                hint="The security deposit sentence above it is written automatically from the rates."
              />
            </Section>

            <Section title="Gallery and contact pages">
              <Text label="Gallery heading" value={content.pages.gallery.heading} onChange={(v) => edit((d) => { d.pages.gallery.heading = v; })} />
              <Text label="Contact page note" value={content.pages.contact.replyNote} onChange={(v) => edit((d) => { d.pages.contact.replyNote = v; })} />
            </Section>
          </>
        )}

        {tab === "amenities" && (
          <Section title="Amenities" hint="Shown on the Amenities page in this order. The first five also appear on the home page.">
            <List
              items={content.amenities}
              onChange={(v) => edit((d) => { d.amenities = v; })}
              addLabel="Add amenity"
              itemLabel={(a, i) => `${i + 1}. ${a.title || "New amenity"}`}
              makeNew={() => ({ title: "New amenity", tag: "", image: "", text: "" })}
              renderItem={(a, update) => (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Text label="Title" value={a.title} onChange={(title) => update({ ...a, title })} />
                    <Text label="Small label" value={a.tag} onChange={(tag) => update({ ...a, tag })} hint="For example: Pool, Music" />
                  </div>
                  <Text label="Description" multiline value={a.text} onChange={(text) => update({ ...a, text })} />
                  <ImagePick label="Photo" value={a.image} images={images} allowEmpty onChange={(image) => update({ ...a, image })} />
                </>
              )}
            />
          </Section>
        )}

        {tab === "photos" && (
          <>
            <PhotoLibrary images={images} setImages={setImages} setStatus={setStatus} />

            <Section title="Home page slideshow">
              <List
                items={home.slides}
                onChange={(v) => edit((d) => { d.pages.home.slides = v; })}
                addLabel="Add slide"
                itemLabel={(s, i) => `${i + 1}. ${s.caption || s.image}`}
                makeNew={() => ({ image: images[0] ?? "", caption: "", focus: "center" })}
                renderItem={(s, update) => (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ImagePick label="Photo" value={s.image} images={images} onChange={(image) => update({ ...s, image })} />
                    <div className="space-y-3">
                      <Text label="Caption" value={s.caption} onChange={(caption) => update({ ...s, caption })} />
                      <Select
                        label="Keep visible when cropped"
                        value={s.focus}
                        onChange={(focus) => update({ ...s, focus })}
                        options={[
                          { value: "center", label: "Middle" },
                          { value: "top", label: "Top" },
                          { value: "lower", label: "Lower middle" },
                          { value: "bottom", label: "Bottom" },
                        ]}
                      />
                    </div>
                  </div>
                )}
              />
            </Section>

            <Section title="Home page photos">
              <div className="grid gap-4 sm:grid-cols-2">
                {home.introImages.map((img, i) => (
                  <ImagePick key={i} label={`About section photo ${i + 1}`} value={img} images={images} onChange={(v) => edit((d) => { d.pages.home.introImages[i] = v; })} />
                ))}
              </div>
              <div>
                <p className="mb-2 text-sm font-bold">Gallery strip (the first photo is shown large; 5 photos fill the grid)</p>
                <List
                  items={home.galleryImages}
                  onChange={(v) => edit((d) => { d.pages.home.galleryImages = v; })}
                  addLabel="Add photo"
                  itemLabel={(img, i) => `${i + 1}. ${img}`}
                  makeNew={() => images[0] ?? ""}
                  renderItem={(img, update) => <ImagePick label="Photo" value={img} images={images} onChange={update} />}
                />
              </div>
            </Section>

            <Section title="Gallery page slideshow">
              <List
                items={content.pages.gallery.slides}
                onChange={(v) => edit((d) => { d.pages.gallery.slides = v; })}
                addLabel="Add slide"
                itemLabel={(s, i) => `${i + 1}. ${s.title || s.image}`}
                makeNew={() => ({ image: images[0] ?? "", title: "", note: "" })}
                renderItem={(s, update) => (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ImagePick label="Photo" value={s.image} images={images} onChange={(image) => update({ ...s, image })} />
                    <div className="space-y-3">
                      <Text label="Title" value={s.title} onChange={(title) => update({ ...s, title })} />
                      <Text label="Note" value={s.note} onChange={(note) => update({ ...s, note })} />
                    </div>
                  </div>
                )}
              />
            </Section>

            <Section title="Page banners">
              <div className="grid gap-4 sm:grid-cols-3">
                <ImagePick label="Amenities page" value={content.pages.amenities.heroImage} images={images} onChange={(v) => edit((d) => { d.pages.amenities.heroImage = v; })} />
                <ImagePick label="Splash & Relax page" value={content.pages.splash.heroImage} images={images} onChange={(v) => edit((d) => { d.pages.splash.heroImage = v; })} />
                <ImagePick label="Link preview (WhatsApp, Facebook)" value={content.business.heroImage} images={images} onChange={(v) => edit((d) => { d.business.heroImage = v; })} />
              </div>
            </Section>
          </>
        )}

        {tab === "business" && (
          <>
            <Section title="Contact details" hint="Shown in the footer, on the contact page and used by the WhatsApp buttons.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Text label="Phone" value={content.business.phone} onChange={(v) => edit((d) => { d.business.phone = v; })} hint="For example: +91 9829132322" />
                <Text label="WhatsApp number" value={content.business.whatsapp} onChange={(v) => edit((d) => { d.business.whatsapp = v.replace(/\D/g, ""); })} hint="Digits only, with country code: 919829132322" />
                <Text label="Email" value={content.business.email} onChange={(v) => edit((d) => { d.business.email = v; })} />
                <div className="grid grid-cols-2 gap-3">
                  <Text label="Check-in" value={content.business.checkIn} onChange={(v) => edit((d) => { d.business.checkIn = v; })} />
                  <Text label="Check-out" value={content.business.checkOut} onChange={(v) => edit((d) => { d.business.checkOut = v; })} />
                </div>
              </div>
            </Section>

            <Section title="Address">
              <Text label="Street" value={content.business.address.street} onChange={(v) => edit((d) => { d.business.address.street = v; })} />
              <div className="grid gap-3 sm:grid-cols-3">
                <Text label="City" value={content.business.address.locality} onChange={(v) => edit((d) => { d.business.address.locality = v; })} />
                <Text label="State" value={content.business.address.region} onChange={(v) => edit((d) => { d.business.address.region = v; })} />
                <Text label="PIN code" value={content.business.address.postalCode} onChange={(v) => edit((d) => { d.business.address.postalCode = v; })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Num label="Latitude" step={0.0001} value={content.business.geo.latitude} onChange={(v) => edit((d) => { d.business.geo.latitude = v; })} hint="From Google Maps: right-click the villa and copy the numbers." />
                <Num label="Longitude" step={0.0001} value={content.business.geo.longitude} onChange={(v) => edit((d) => { d.business.geo.longitude = v; })} />
              </div>
            </Section>

            <Section title="Social media" hint="Paste the full link. Leave empty if you don't have one.">
              <Text label="Facebook" value={content.business.social.facebook} onChange={(v) => edit((d) => { d.business.social.facebook = v; })} />
              <Text label="Instagram" value={content.business.social.instagram} onChange={(v) => edit((d) => { d.business.social.instagram = v; })} />
              <Text label="YouTube" value={content.business.social.youtube} onChange={(v) => edit((d) => { d.business.social.youtube = v; })} />
            </Section>

            <Section title="Search engines" hint="The description Google shows under the site name.">
              <Text label="Website description" multiline value={content.business.description} onChange={(v) => edit((d) => { d.business.description = v; })} />
            </Section>
          </>
        )}

        {tab === "policies" && policyNames.map(({ key, label }) => (
          <Section key={key} title={label} hint="One paragraph per line. Short lines (under 40 characters) and lines ending with “:” show as bold headings.">
            <Text label="Text" multiline rows={16} value={legalText[key]} onChange={(v) => setLegalText((t) => ({ ...t, [key]: v }))} />
          </Section>
        ))}

        <p className="pb-10 text-center text-xs text-muted">
          Nothing changes on the website until you press <strong>Save changes</strong>. Photo uploads and deletes happen straight away.
        </p>
      </main>
    </div>
  );
}

function PhotoLibrary({ images, setImages, setStatus }: {
  images: string[]; setImages: (fn: (images: string[]) => string[]) => void; setStatus: (r: Result | null) => void;
}) {
  const [uploading, setUploading] = useState("");

  const upload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      setUploading(file.name);
      try {
        const blob = await prepareImage(file);
        const form = new FormData();
        form.append("file", blob, file.name);
        form.append("name", slug(file.name.replace(/\.[^.]+$/, "")));
        const r = await uploadImage(form);
        if (!r.ok) {
          setStatus(r);
          break;
        }
        setImages((list) => [...list, r.message].sort((a, b) => a.localeCompare(b)));
        setStatus({ ok: true, message: `Uploaded ${r.message}. New photos appear in the website gallery automatically.` });
      } catch {
        setStatus({ ok: false, message: `${file.name} couldn't be read. Try a JPG or PNG photo.` });
        break;
      }
    }
    setUploading("");
  };

  const remove = async (name: string) => {
    if (!confirm(`Delete ${name} from the website? This can't be undone here.`)) return;
    const r = await deleteImage(name);
    setStatus(r);
    if (r.ok) setImages((list) => list.filter((n) => n !== name));
  };

  return (
    <Section title="Photo library" hint="Every photo here (except logos and menus) also appears on the Gallery page. Photos are resized to 1600px before uploading.">
      <label className="inline-block cursor-pointer rounded-full bg-teal px-5 py-2 text-sm font-bold text-cream hover:bg-ink">
        {uploading ? `Uploading ${uploading}…` : "Upload photos"}
        <input type="file" accept="image/*" multiple disabled={Boolean(uploading)} className="sr-only" onChange={(e) => { if (e.target.files?.length) upload(e.target.files); e.target.value = ""; }} />
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {images.map((name) => (
          <div key={name} className="rounded-xl border border-ink/10 p-1">
            <Thumb name={name} className="h-20 w-full" />
            <p className="mt-1 truncate text-[11px] text-muted" title={name}>{name}</p>
            <button type="button" onClick={() => remove(name)} className="text-[11px] font-bold text-rose underline">Delete</button>
          </div>
        ))}
      </div>
    </Section>
  );
}
