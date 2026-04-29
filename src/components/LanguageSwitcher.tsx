import { Globe } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 backdrop-blur px-1 py-1">
      <Globe className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
      {(["en", "et"] as const).map((l) => (
        <Button
          key={l}
          size="sm"
          variant={lang === l ? "default" : "ghost"}
          className="h-7 rounded-full px-3 text-xs font-medium uppercase"
          onClick={() => setLang(l)}
        >
          {l}
        </Button>
      ))}
    </div>
  );
};
