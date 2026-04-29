import { useBlocks } from "@/lib/useBlocks";

export const About = () => {
  const blocks = useBlocks();
  const b = blocks["about"];
  const stats = [
    { v: "15+", k: "years in trade" },
    { v: "30+", k: "EU partners" },
    { v: "100%", k: "FGAS compliant" },
    { v: "24h", k: "quote response" },
  ];

  return (
    <section id="about" className="py-24">
      <div className="container-tight grid gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[hsl(var(--accent))]">
            {b?.subtitle}
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">{b?.title}</h2>
          <p className="mt-6 text-lg text-muted-foreground">{b?.body}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.k} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="text-3xl font-bold text-foreground">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
