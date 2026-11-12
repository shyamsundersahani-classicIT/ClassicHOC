"use client";

import { useEffect, useState } from "react";
import { defaultThemeId, themes } from "@/lib/themes";

const THEME_KEY = "hoc-theme";

// Floating, testing-only widget: lets you flip the whole site's colour theme
// live, on every page, without touching any code. Pick a favourite, then tell
// Claude which id to keep — it will hardcode it and remove this panel.
// The background and click effects were removed at the owner's request.
export default function PreviewControls() {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(defaultThemeId);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) setActiveTheme(saved);
    } catch {
      // default theme stays active
    }
  }, []);

  const applyTheme = (id: string) => {
    setActiveTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    try {
      localStorage.setItem(THEME_KEY, id);
    } catch {
      // theme still applies for this page view, just won't persist
    }
  };

  const theme = themes.find((t) => t.id === activeTheme) ?? themes[0];

  return (
    <div data-preview-controls className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div className="max-h-[calc(100dvh-7rem)] w-80 max-w-[calc(100vw-2.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-gold/30 bg-cream p-4 text-ink shadow-2xl animate-[slideInLeft_0.25s_ease-out_forwards]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose">Testing mode · Colour</p>
          <p className="mt-1 text-sm text-muted">Pick a theme to preview it on every page. Nothing is saved for visitors — just for this browser.</p>
          <div className="mt-4 space-y-2">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTheme(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                  t.id === activeTheme ? "border-gold bg-gold/10" : "border-ink/10 hover:border-gold/50"
                }`}
              >
                <span className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-ink/10">
                  {t.swatch.map((c, i) => (
                    <span key={i} className="h-6 w-6" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{t.name}</span>
                  <span className="block truncate text-xs text-muted">{t.blurb}</span>
                </span>
                {t.id === activeTheme && <span className="ml-auto text-gold">✓</span>}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Your colour preference is remembered on this browser.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="gold-shine flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-ink shadow-xl"
      >
        <span aria-hidden>🎨</span>
        {open ? "Close" : theme.name}
      </button>
    </div>
  );
}
