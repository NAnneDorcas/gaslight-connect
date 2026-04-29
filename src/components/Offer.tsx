import { Beaker, Leaf, Recycle } from "lucide-react";
import { useBlocks } from "@/lib/useBlocks";

const icons = [Beaker, Leaf, Recycle];

export const Offer = () => {
  const blocks = useBlocks();
  const items = ["offer_1", "offer_2", "offer_3"].map((k) => blocks[k]).filter(Boolean);

  return (
    <section id="offer" className="bg-muted/40 py-24">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[hsl(var(--accent))]">What we offer</p>
          <h2 className="text-3xl font-bold sm:text-4xl">A complete refrigerant trading partner</h2>
          <p className="mt-4 text-muted-foreground">From bulk supply to compliance and reclaim — one accountable supplier across the EU.</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((b, i) => {
            const Icon = icons[i] ?? Beaker;
            return (
              <article key={b.key} className="group rounded-2xl border border-border bg-card p-8 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm font-medium text-[hsl(var(--accent))]">{b.subtitle}</p>
                <p className="mt-4 text-sm text-muted-foreground">{b.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
