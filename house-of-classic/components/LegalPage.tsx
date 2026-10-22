export default function LegalPage({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl">{title}</h1>
      <div className="mt-8 space-y-4 leading-relaxed text-muted">
        {lines.map((line, i) => (
          <p key={i} className={line.endsWith(":") || line.length < 40 ? "font-bold text-ink" : ""}>
            {line.replace("[email protected]", "houseofclassic9@gmail.com")}
          </p>
        ))}
      </div>
    </section>
  );
}
