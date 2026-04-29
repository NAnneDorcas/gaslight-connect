import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Snowflake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLang, t } from "@/lib/i18n";

type Item = { id: string; label: string; url: string; order: number };

export const SiteHeader = () => {
  const { lang } = useLang();
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.from("menu_items").select("*").eq("language", lang).eq("enabled", true)
      .order("order").then(({ data }) => setItems((data as any) ?? []));
  }, [lang]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-tight flex h-16 items-center justify-between">
        <a href="#hero" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-hero-gradient text-primary-foreground">
            <Snowflake className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">NordCool</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((i) => (
            <a key={i.id} href={i.url} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {i.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button asChild size="sm" variant="outline">
            <Link to="/cms">{t(lang, "cms")}</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-tight flex flex-col gap-4 py-4">
            {items.map((i) => (
              <a key={i.id} href={i.url} onClick={() => setOpen(false)} className="text-sm font-medium">{i.label}</a>
            ))}
            <div className="flex items-center justify-between pt-2">
              <LanguageSwitcher />
              <Button asChild size="sm" variant="outline"><Link to="/cms">{t(lang, "cms")}</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
