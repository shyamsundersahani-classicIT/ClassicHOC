"use client";

import { useRef, useState } from "react";

const DONE_AT = 0.85; // share of the track the handle must travel to open the link
const HANDLE = 80; // handle width in px
const GAP = 4; // space around the handle inside the track, in px

// "Slide to open" link: drag the gold handle along the track to open the page
// in a new tab. A tap or click alone does nothing, as the owner asked.
// `from` sets where the handle starts: "left" slides right, "right" slides left.
// Keyboard users (who can't drag) use it as a slider: arrow keys move it,
// End or Enter opens the page.
export default function SlideToOpen({ href, label, from = "left" }: { href: string; label: string; from?: "left" | "right" }) {
  const track = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; fraction: number } | null>(null);
  const [fraction, setFractionState] = useState(0); // 0 = start, 1 = end of the track
  const [dragging, setDragging] = useState(false);
  // Latest position, readable in event handlers before React has re-rendered
  // (a quick drag-and-release can arrive before the last move is drawn).
  const latest = useRef(0);
  const setFraction = (value: number) => {
    latest.current = value;
    setFractionState(value);
  };
  const towardsEnd = from === "left" ? 1 : -1; // which way the pointer moves to open

  // Distance in px the handle can travel; only read inside event handlers.
  const travel = () => (track.current ? track.current.clientWidth - HANDLE - GAP * 2 : 1);

  const open = () => {
    setFraction(1);
    window.open(href, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setFraction(0), 700); // slide back, ready for another go
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, fraction: latest.current };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const moved = ((e.clientX - start.current.x) * towardsEnd) / travel();
    setFraction(Math.min(1, Math.max(0, start.current.fraction + moved)));
  };
  const onPointerUp = () => {
    if (!start.current) return;
    start.current = null;
    setDragging(false);
    if (latest.current >= DONE_AT) open();
    else setFraction(0);
  };

  const forwardKey = from === "left" ? "ArrowRight" : "ArrowLeft";
  const backKey = from === "left" ? "ArrowLeft" : "ArrowRight";
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === forwardKey || e.key === "ArrowUp") {
      const next = Math.min(1, latest.current + 0.25);
      if (next >= 1) open();
      else setFraction(next);
    } else if (e.key === backKey || e.key === "ArrowDown" || e.key === "Home") setFraction(0);
    else if (e.key === "End" || e.key === "Enter" || e.key === " ") open();
    else return;
    e.preventDefault();
  };

  // The handle and the gold fill are measured from the side the handle starts on.
  const position = `calc(${GAP}px + (100% - ${HANDLE + GAP * 2}px) * ${fraction})`;
  const ease = dragging ? "none" : "300ms ease";
  const percent = Math.round(fraction * 100);

  return (
    <div
      ref={track}
      className="relative h-14 w-full max-w-md select-none overflow-hidden rounded-full border border-cream/60 bg-cream/90 text-ink shadow-[inset_0_2px_6px_rgba(0,0,0,0.18)]"
    >
      {/* Gold fill that grows behind the handle */}
      <div
        aria-hidden
        className="absolute inset-y-0 rounded-full bg-gold/30"
        style={{ [from]: 0, width: `calc(${position} + ${HANDLE}px)`, transition: dragging ? "none" : `width ${ease}` }}
      />
      <p
        aria-hidden
        className={`pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold ${from === "left" ? "pl-20" : "pr-20"}`}
        style={{ opacity: 1 - Math.min(1, fraction * 1.6) }}
      >
        Slide to open {label} <span className="ml-1.5 text-gold-dark">{from === "left" ? "»" : "«"}</span>
      </p>
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Slide to open ${label} in a new tab`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}%. Press Enter to open ${label}.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="absolute top-1 flex h-12 cursor-grab touch-pan-y items-center justify-center rounded-full bg-gradient-to-r from-gold via-gold-dark to-gold text-xl font-bold text-ink shadow-md ring-1 ring-ink/10 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        style={{ width: HANDLE, [from]: position, transition: dragging ? "none" : `${from} ${ease}` }}
      >
        {from === "left" ? "»" : "«"}
      </div>
    </div>
  );
}
