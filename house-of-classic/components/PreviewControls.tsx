"use client";

import { useEffect, useState } from "react";
import { defaultThemeId, themes } from "@/lib/themes";
import { defaultEffectId, effects } from "@/lib/effects";
import { setEffect, getStoredEffect } from "@/components/EffectsLayer";

const THEME_KEY = "hoc-theme";

// Floating, testing-only widget: lets you flip the whole site's colour theme
// and motion effect live, on every page, without touching any code. Pick
// your favourites, then tell Claude which ids to keep — it will hardcode
// them and remove this panel (and EffectsLayer, if "None" is kept).
export default function PreviewControls() {
  const [openPanel, setOpenPanel] = useState<"theme" | "effects" | null>(null);
  const [activeTheme, setActiveTheme] = useState(defaultThemeId);
  const [activeEffect, setActiveEffect] = useState(defaultEffectId);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) setActiveTheme(saved);
    } catch {
      // default theme stays active
    }
    setActiveEffect(getStoredEffect());
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

  const applyEffect = (id: string) => {
    setActiveEffect(id);
    setEffect(id);
  };

  const theme = themes.find((t) => t.id === activeTheme) ?? themes[0];
  const effect = effects.find((e) => e.id === activeEffect) ?? effects[0];

  return (
    <div data-preview-controls className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 print:hidden">
      {openPanel === "theme" && (
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

      {openPanel === "effects" && (
        <div className="max-h-[calc(100dvh-7rem)] w-80 max-w-[calc(100vw-2.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-gold/30 bg-cream p-4 text-ink shadow-2xl animate-[slideInLeft_0.25s_ease-out_forwards]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose">Set the atmosphere</p>
          <p className="mt-1 text-sm text-muted">
            A little movement, a different mood. Choose an atmosphere for your visit.
          </p>
          <div className="mt-4 space-y-2">
            {effects.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => applyEffect(e.id)}
                aria-pressed={e.id === activeEffect}
                className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                  e.id === activeEffect ? "border-gold bg-gold/10" : "border-ink/10 hover:border-gold/50"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wine/10 text-lg">{e.icon}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{e.name}</span>
                  <span className="block text-xs leading-relaxed text-muted">{e.blurb}</span>
                </span>
                {e.id === activeEffect && <span className="ml-auto text-gold">✓</span>}
              </button>
            ))}
          </div>
          {(activeEffect === "ripple" || activeEffect === "confetti") && (
            <button type="button" onClick={() => window.dispatchEvent(new Event("hoc-effect-preview"))}
              className="mt-3 w-full rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-bold text-ink hover:bg-gold/20">
              Replay effect ↗
            </button>
          )}
          <p className="mt-3 text-xs text-muted">
            Your choice is remembered on this browser. Motion follows your device’s accessibility settings.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpenPanel(openPanel === "theme" ? null : "theme")}
          aria-expanded={openPanel === "theme"}
          className="gold-shine flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-ink shadow-xl"
        >
          <span aria-hidden>🎨</span>
          {openPanel === "theme" ? "Close" : theme.name}
        </button>
        <button
          type="button"
          onClick={() => setOpenPanel(openPanel === "effects" ? null : "effects")}
          aria-expanded={openPanel === "effects"}
          className="wine-gradient flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-cream shadow-xl"
        >
          <span aria-hidden>{effect.icon}</span>
          {openPanel === "effects" ? "Close" : effect.name}
        </button>
      </div>
    </div>
  );
}
