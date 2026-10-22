export type Effect = {
  id: string;
  name: string;
  blurb: string;
  icon: string;
};

// Keep existing IDs so saved browser preferences continue to work.
export const effects: Effect[] = [
  { id: "none", name: "None", blurb: "Let the architecture take centre stage.", icon: "—" },
  { id: "fireflies", name: "Champagne Glow", blurb: "Soft golden bokeh, drifting at an unhurried pace.", icon: "◌" },
  { id: "stars", name: "Starlit Evening", blurb: "Quiet twinkles and an occasional silk-fine meteor.", icon: "✧" },
  { id: "ripple", name: "Poolside Ripples", blurb: "Tap an open area to send out delicate water rings.", icon: "◎" },
  { id: "confetti", name: "Golden Celebration", blurb: "Tap an open area for a flutter of gold petals.", icon: "❋" },
  { id: "trail", name: "Silk & Light", blurb: "A soft trail of light follows your mouse.", icon: "∿" },
];

export const defaultEffectId = "fireflies";
