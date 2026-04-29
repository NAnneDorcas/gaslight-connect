import { ArrowRight, ShieldCheck, Truck, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlocks } from "@/lib/useBlocks";
import heroImg from "@/assets/hero-cylinders.jpg";

export const Hero = ({ block }: { block?: any }) => {
  const blocks = useBlocks();
  const b = blocks["hero"];

  return (
    <section id="hero" className="relative overflow-hidden bg-hero-gradient pt-24 text-primary-foreground">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(hsl(var(--accent))_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="container-tight relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-32">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground/80 bg-[hsl(var(--accent))]" />
            EU certified F-gas trader
          </span>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            {b?.title ?? "Reliable Refrigerant Gas Trading for Industry"}
          </h1>
          <p className="max-w-xl text-lg text-primary-foreground/75">{b?.body}</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild className="bg-[hsl(var(--accent))] text-accent-foreground hover:bg-[hsl(var(--accent))]/90">
              <a href="#contact">Request a quote <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <a href="#offer">Our products</a>
            </Button>
          </div>

          <dl className="grid grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-8 text-sm">
            {[
              { icon: ShieldCheck, k: "FGAS", v: "Compliant" },
              { icon: Truck, k: "EU-wide", v: "Logistics" },
              { icon: Leaf, k: "Low GWP", v: "Portfolio" },
            ].map(({ icon: I, k, v }) => (
              <div key={k} className="space-y-1">
                <I className="h-4 w-4 text-[hsl(var(--accent))]" />
                <dt className="text-primary-foreground/60">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-[hsl(var(--accent))]/20 blur-2xl" />
          <img
            src={heroImg}
            alt="Industrial refrigerant gas cylinders in a clean warehouse"
            width={1280}
            height={1280}
            className="relative aspect-square w-full rounded-2xl object-cover shadow-elegant ring-1 ring-primary-foreground/10"
          />
        </div>
      </div>
    </section>
  );
};
