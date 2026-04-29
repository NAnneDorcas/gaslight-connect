import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useBlocks } from "@/lib/useBlocks";
import { useLang, t } from "@/lib/i18n";
import { z } from "zod";

type Field = { id: string; name: string; label: string; type: string; required: boolean; order: number };

export const Contact = () => {
  const { lang } = useLang();
  const blocks = useBlocks();
  const b = blocks["contact"];
  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("form_fields").select("*").eq("language", lang).eq("form_key", "contact")
      .order("order").then(({ data }) => setFields((data as any) ?? []));
  }, [lang]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // basic validation
      for (const f of fields) {
        if (f.required && !values[f.name]?.trim()) {
          toast.error(`${f.label} *`);
          setLoading(false); return;
        }
        const v = values[f.name] ?? "";
        if (v.length > 2000) { toast.error(`${f.label} too long`); setLoading(false); return; }
        if (f.type === "email" && v && !z.string().email().safeParse(v).success) {
          toast.error(`${f.label}: invalid email`); setLoading(false); return;
        }
      }
      const { error } = await supabase.from("contact_submissions").insert({
        form_key: "contact", language: lang, payload: values,
      });
      if (error) throw error;
      toast.success(t(lang, "sent"));
      setValues({});
    } catch {
      toast.error(t(lang, "error"));
    } finally { setLoading(false); }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container-tight grid gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[hsl(var(--accent))]">{b?.subtitle}</p>
          <h2 className="text-3xl font-bold sm:text-4xl">{b?.title}</h2>
          <p className="mt-6 text-muted-foreground">{b?.body}</p>

          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-[hsl(var(--accent))]" /> trading@nordcool.eu</li>
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-[hsl(var(--accent))]" /> +372 600 7700</li>
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[hsl(var(--accent))]" /> Tallinn, Estonia · EU</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-card">
          {fields.map((f) => (
            <div key={f.id} className="space-y-1.5">
              <Label htmlFor={f.name}>{f.label}{f.required && " *"}</Label>
              {f.type === "textarea" ? (
                <Textarea id={f.name} value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} rows={4} maxLength={2000} />
              ) : (
                <Input id={f.name} type={f.type} value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} maxLength={500} />
              )}
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "…" : t(lang, "send")}
          </Button>
        </form>
      </div>
    </section>
  );
};
