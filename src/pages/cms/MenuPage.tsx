import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LayoutGrid, Menu, FormInput, Search, Languages, Inbox } from "lucide-react";

const tiles = [
  { table: "content_blocks", label: "Content blocks", icon: LayoutGrid },
  { table: "menu_items", label: "Menu items", icon: Menu },
  { table: "form_fields", label: "Form fields", icon: FormInput },
  { table: "seo_settings", label: "SEO entries", icon: Search },
  { table: "languages", label: "Languages", icon: Languages },
  { table: "contact_submissions", label: "Contact submissions", icon: Inbox },
] as const;

const Overview = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    Promise.all(tiles.map(async (t) => {
      const { count } = await supabase.from(t.table).select("*", { count: "exact", head: true });
      return [t.table, count ?? 0] as const;
    })).then((pairs) => setCounts(Object.fromEntries(pairs)));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome to ClearContent — manage your site content, menu, forms, SEO and languages.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.table} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{t.label}</div>
                <div className="mt-2 text-3xl font-semibold">{counts[t.table] ?? "—"}</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground"><t.icon className="h-5 w-5" /></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Overview;
