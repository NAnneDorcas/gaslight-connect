import { Beaker, Leaf, Recycle } from "lucide-react";

const icons = [Beaker, Leaf, Recycle];

export const Offer = ({ block }: { block?: any }) => {
  const items: string[] = block?.items || [];

  return (
    <section id="offer" className="bg-muted/40 py-24">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[hsl(var(--accent))]">
            What we offer
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            {block?.title || "What We Offer"}
          </h2>

          <p className="mt-4 text-muted-foreground">
            A complete refrigerant trading partner for supply, logistics, and compliance.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index] ?? Beaker;

            return (
              <article
                key={index}
                className="group rounded-2xl border border-border bg-card p-8 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-xl font-semibold">
                  {item}
                </h3>

                <p className="mt-4 text-sm text-muted-foreground">
                  Reliable refrigerant gas solutions for professional B2B partners.
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};