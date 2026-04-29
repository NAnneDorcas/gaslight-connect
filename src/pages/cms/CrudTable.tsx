import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
};

type Props = {
  table: "content_blocks" | "menu_items" | "form_fields" | "seo_settings" | "languages";
  title: string;
  description?: string;
  columns: { key: string; label: string }[];
  fields: FieldDef[];
  orderBy?: string;
};

export const CrudTable = ({ table, title, description, columns, fields, orderBy }: Props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const load = async () => {
    setLoading(true);
    const q = supabase.from(table).select("*");
    if (orderBy) q.order(orderBy as any);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [table]);

  const startNew = () => {
    setEditing(null);
    const blank: any = {};
    fields.forEach((f) => { blank[f.name] = f.type === "boolean" ? false : f.type === "number" ? 0 : ""; });
    setForm(blank);
    setOpen(true);
  };
  const startEdit = (r: any) => {
    setEditing(r);
    const v: any = {};
    fields.forEach((f) => { v[f.name] = r[f.name] ?? (f.type === "boolean" ? false : ""); });
    setForm(v);
    setOpen(true);
  };

  const save = async () => {
    const payload: any = { ...form };
    fields.forEach((f) => { if (f.type === "number") payload[f.name] = Number(payload[f.name] ?? 0); });
    let error;
    if (editing) ({ error } = await supabase.from(table).update(payload).eq("id", editing.id));
    else ({ error } = await supabase.from(table).insert(payload));
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    setOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                {columns.map((c) => <th key={c.key} className="px-4 py-3 text-left font-medium">{c.label}</th>)}
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">No items yet</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-top">
                      <div className="line-clamp-2 max-w-xs">{String(r[c.key] ?? "")}</div>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} {title.toLowerCase()}</DialogTitle></DialogHeader>
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label>{f.label}{f.required && " *"}</Label>
                {f.type === "textarea" ? (
                  <Textarea rows={4} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                ) : f.type === "boolean" ? (
                  <input type="checkbox" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} className="h-4 w-4 rounded border-border" />
                ) : f.type === "select" ? (
                  <select value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">—</option>
                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <Input type={f.type === "number" ? "number" : "text"} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
