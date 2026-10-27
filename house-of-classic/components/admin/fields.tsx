"use client";

import { useId, useState } from "react";

// Small form building blocks for the admin editor.

const inputClass = "mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm focus:border-teal focus:outline-none";

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-serif text-2xl">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function Text({ label, value, onChange, hint, multiline, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; multiline?: boolean; rows?: number;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold">{label}</label>
      {multiline ? (
        <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} leading-relaxed`} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

// Keeps the typed text locally so the box can be emptied while typing.
export function Num({ label, value, onChange, hint, step = 1 }: {
  label: string; value: number; onChange: (v: number) => void; hint?: string; step?: number;
}) {
  const id = useId();
  const [text, setText] = useState(String(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    // The value changed from outside (for example the list was reordered).
    setLastValue(value);
    if (Number(text) !== value) setText(String(value));
  }
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold">{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        step={step}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const n = Number(e.target.value);
          if (e.target.value !== "" && Number.isFinite(n)) onChange(n);
        }}
        onBlur={() => setText(String(value))}
        className={inputClass}
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-teal" />
      {label}
    </label>
  );
}

export function Select({ label, value, options, onChange }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

const move = <T,>(list: T[], from: number, to: number) => {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

// A list of items with add, remove and reorder buttons. renderItem draws one item's fields.
export function List<T>({ items, onChange, renderItem, makeNew, addLabel, itemLabel }: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (item: T) => void, index: number) => React.ReactNode;
  makeNew: () => T;
  addLabel: string;
  itemLabel: (item: T, index: number) => string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-ink/10 bg-cream/60 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold">{itemLabel(item, i)}</p>
            <div className="flex gap-1 text-xs">
              <SmallButton disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))} label="Move up">↑</SmallButton>
              <SmallButton disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))} label="Move down">↓</SmallButton>
              <SmallButton onClick={() => confirm(`Remove "${itemLabel(item, i)}"?`) && onChange(items.filter((_, j) => j !== i))} label="Remove" danger>
                Remove
              </SmallButton>
            </div>
          </div>
          <div className="space-y-3">{renderItem(item, (next) => onChange(items.map((old, j) => (j === i ? next : old))), i)}</div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, makeNew()])} className="rounded-full border-2 border-dashed border-teal px-4 py-2 text-sm font-bold text-teal hover:bg-teal hover:text-cream">
        + {addLabel}
      </button>
    </div>
  );
}

// A simple list of single-line texts.
export function StringList({ label, items, onChange, addLabel = "Add", multiline }: {
  label: string; items: string[]; onChange: (items: string[]) => void; addLabel?: string; multiline?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold">{label}</p>
      <List
        items={items}
        onChange={onChange}
        makeNew={() => ""}
        addLabel={addLabel}
        itemLabel={(item, i) => `${i + 1}. ${item.slice(0, 40) || "(empty)"}${item.length > 40 ? "…" : ""}`}
        renderItem={(item, update) => <Text label="Text" value={item} onChange={update} multiline={multiline} />}
      />
    </div>
  );
}

export function SmallButton({ children, onClick, disabled, label, danger }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string; danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md border px-2 py-1 font-bold disabled:opacity-30 ${danger ? "border-rose/40 text-rose hover:bg-rose hover:text-cream" : "border-ink/20 hover:bg-ink hover:text-cream"}`}
    >
      {children}
    </button>
  );
}

// Thumbnail from public/images. On the live site a just-uploaded photo only
// appears once the site has rebuilt, so a missing file shows a placeholder.
export function Thumb({ name, className = "h-16 w-24" }: { name: string; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (!name) return <div className={`${className} flex items-center justify-center rounded-lg bg-ink/10 text-xs text-muted`}>No photo</div>;
  if (broken) return <div className={`${className} flex items-center justify-center rounded-lg bg-gold/20 p-1 text-center text-[10px] leading-tight text-muted`}>Shows after rebuild</div>;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- plain img so new uploads that aren't built yet can fail gracefully
    <img src={`/images/${name}`} alt="" loading="lazy" onError={() => setBroken(true)} className={`${className} rounded-lg object-cover`} />
  );
}

export function ImagePick({ label, value, images, onChange, allowEmpty }: {
  label: string; value: string; images: string[]; onChange: (v: string) => void; allowEmpty?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const shown = images.filter((n) => n.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <p className="text-sm font-bold">{label}</p>
      <div className="mt-1 flex items-center gap-3">
        <Thumb name={value} />
        <div className="min-w-0">
          <p className="truncate text-xs text-muted">{value || "None"}</p>
          <div className="mt-1 flex gap-2">
            <button type="button" onClick={() => setOpen(true)} className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream hover:bg-wine">Change photo</button>
            {allowEmpty && value && <button type="button" onClick={() => onChange("")} className="text-xs font-bold text-rose underline">Remove</button>}
          </div>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`Choose ${label}`} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4" onClick={() => setOpen(false)}>
          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-xl">Choose a photo</h3>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-ink/20 px-3 py-1 text-sm font-bold">Close</button>
            </div>
            <input autoFocus placeholder="Search by file name" value={filter} onChange={(e) => setFilter(e.target.value)} className={inputClass} />
            <p className="mt-2 text-xs text-muted">To add new photos, use the &ldquo;Photo library&rdquo; section on the Photos tab.</p>
            <div className="mt-3 grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
              {shown.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); }}
                  className={`rounded-xl border-2 p-1 text-left ${name === value ? "border-teal" : "border-transparent hover:border-gold"}`}
                >
                  <Thumb name={name} className="h-24 w-full" />
                  <span className="mt-1 block truncate text-[11px] text-muted">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
