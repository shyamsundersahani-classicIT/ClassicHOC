// Small line icons for the review categories, drawn in the current text colour.
// Chosen by the category name (as typed in the admin); unknown names get a star.
const icons: Record<string, React.ReactNode> = {
  // broom
  cleanliness: <path d="M14 3l-4.5 9M6 12h8l2 9H4l2-9zM8 16v5M12 16v5" />,
  // compass
  accuracy: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
  // key
  "check-in": (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M17 6l3 3M14.5 8.5l2 2" />
    </>
  ),
  // stacked coins
  value: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 10v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4M5 14v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" />
    </>
  ),
  // speech bubble
  communication: <path d="M4 5h16v11H9l-5 4V5zM8 9h8M8 12h5" />,
  // map pin
  location: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  // star (fallback)
  default: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />,
};

export default function RatingIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {icons[name.trim().toLowerCase()] ?? icons.default}
    </svg>
  );
}
