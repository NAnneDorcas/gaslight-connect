import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";

type MenuItem = {
  id: string;
  label: string;
  url?: string;
};

export const SiteHeader = ({
  menuItems = [],
  enabledLanguages = ["en"],
  language = "en",
  setLanguage,
}: {
  menuItems?: MenuItem[];
  enabledLanguages?: string[];
  language?: string;
  setLanguage?: (lang: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const getMenuHref = (label: string) => {
    const lower = label.toLowerCase();

    if (lower.includes("home") || lower.includes("avaleht")) return "#hero";
    if (lower.includes("about") || lower.includes("meist")) return "#about";
    if (lower.includes("offer") || lower.includes("pakume")) return "#offer";
    if (lower.includes("contact") || lower.includes("kontakt")) return "#contact";

    return "#hero";
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-tight flex h-16 items-center justify-between">
        <a href="#hero" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-hero-gradient text-primary-foreground">
            <Snowflake className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            NordCool
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.url || getMenuHref(item.label)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-1">
            {enabledLanguages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage?.(lang)}
                className={`rounded-md px-2 py-1 text-sm ${
                  language === lang
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <Button asChild size="sm" variant="outline">
            <Link to="/cms">CMS</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-tight flex flex-col gap-4 py-4">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.url || getMenuHref(item.label)}
                onClick={() => setOpen(false)}
                className="text-sm font-medium"
              >
                {item.label}
              </a>
            ))}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1">
                {enabledLanguages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguage?.(lang);
                      setOpen(false);
                    }}
                    className={`rounded-md px-2 py-1 text-sm ${
                      language === lang
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <Button asChild size="sm" variant="outline">
                <Link to="/cms">CMS</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};