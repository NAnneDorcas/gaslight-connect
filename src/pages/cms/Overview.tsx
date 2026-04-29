import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import {
  LayoutGrid,
  Menu,
  FormInput,
  Search,
  Languages,
  Inbox,
} from "lucide-react";

const tiles = [
  { table: "blocks", label: "Content blocks", icon: LayoutGrid },
  { table: "menu_items", label: "Menu items", icon: Menu },
  { table: "form_fields", label: "Form fields", icon: FormInput },
  { table: "pages", label: "SEO entries", icon: Search },
  { table: "site_config", label: "Language settings", icon: Languages },
  { table: "inquiries", label: "Contact inquiries", icon: Inbox },
] as const;

const Overview = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all(
      tiles.map(async (tile) => {
        const { count } = await supabase
          .from(tile.table)
          .select("*", { count: "exact", head: true });

        return [tile.table, count ?? 0] as const;
      })
    ).then((pairs) => setCounts(Object.fromEntries(pairs)));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome to ClearContent CMS — manage your site content, menu, forms,
          SEO, languages, users, and contact inquiries.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Card key={tile.table} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  {tile.label}
                </div>

                <div className="mt-2 text-3xl font-semibold">
                  {counts[tile.table] ?? "—"}
                </div>
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                <tile.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Overview;