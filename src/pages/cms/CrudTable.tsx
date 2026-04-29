import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // ✅ IMPORTANT FIX

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  table:
    | "blocks"
    | "pages"
    | "site_config"
    | "menu_items"
    | "form_fields"
    | "inquiries";

  title: string;
  description?: string;
  columns: { key: string; label: string }[];
  fields: FieldDef[];
  orderBy?: string;
};

export const CrudTable = ({
  table,
  title,
  description,
  columns,
  fields,
  orderBy,
}: Props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  // LOAD DATA
  const load = async () => {
    setLoading(true);

    let query = supabase.from(table).select("*");

    if (orderBy) {
      query = query.order(orderBy as any);
    }

    const { data, error } = await query;

    if (error) {
      toast.error(error.message);
    }

    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [table]);

  // NEW ROW
  const startNew = () => {
    setEditing(null);

    const blank: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === "boolean") {
        blank[field.name] = false;
      } else if (field.type === "number") {
        blank[field.name] = 0;
      } else {
        blank[field.name] = "";
      }
    });

    setForm(blank);
    setOpen(true);
  };

  // EDIT ROW
  const startEdit = (row: any) => {
    setEditing(row);

    const values: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === "boolean") {
        values[field.name] = row[field.name] ?? false;
      } else {
        values[field.name] = row[field.name] ?? "";
      }
    });

    setForm(values);
    setOpen(true);
  };

  // JSON PARSER
  const parseJsonIfNeeded = (value: any) => {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return value;
      }
    }

    return value;
  };

  // SAVE
  const save = async () => {
    const payload: Record<string, any> = { ...form };

    fields.forEach((field) => {
      if (field.type === "number") {
        payload[field.name] = Number(payload[field.name] ?? 0);
      }

      if (field.name === "items" || field.name === "styles") {
        payload[field.name] = parseJsonIfNeeded(payload[field.name]);
      }
    });

    let error;

    if (editing) {
      const result = await supabase
        .from(table)
        .update(payload)
        .eq("id", editing.id);

      error = result.error;
    } else {
      const result = await supabase
        .from(table)
        .insert(payload);

      error = result.error;
    }

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Saved");

    setOpen(false);
    load();
  };

  // DELETE
  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;

    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-end justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <Button onClick={startNew}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>

      </div>

      {/* TABLE */}

      <Card className="overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-muted/60 text-muted-foreground">

              <tr>

                {columns.map((column) => (

                  <th
                    key={column.key}
                    className="px-4 py-3 text-left font-medium"
                  >
                    {column.label}
                  </th>

                ))}

                <th className="w-24" />

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Loading…
                  </td>
                </tr>

              ) : rows.length === 0 ? (

                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No items yet
                  </td>
                </tr>

              ) : (

                rows.map((row) => (

                  <tr key={row.id} className="border-t border-border">

                    {columns.map((column) => (

                      <td key={column.key} className="px-4 py-3 align-top">

                        <div className="line-clamp-2 max-w-xs">
                          {String(row[column.key] ?? "")}
                        </div>

                      </td>

                    ))}

                    <td className="px-4 py-3 text-right">

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(row)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(row.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </Card>

      {/* MODAL */}

      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent className="max-w-2xl">

          <DialogHeader>

            <DialogTitle>
              {editing ? "Edit" : "Add"} {title.toLowerCase()}
            </DialogTitle>

          </DialogHeader>

          <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-2">

            {fields.map((field) => (

              <div key={field.name} className="space-y-1.5">

                <Label>
                  {field.label}
                  {field.required && " *"}
                </Label>

                {field.type === "textarea" ? (

                  <Textarea
                    rows={4}
                    value={
                      typeof form[field.name] === "object"
                        ? JSON.stringify(form[field.name], null, 2)
                        : form[field.name] ?? ""
                    }
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [field.name]: event.target.value,
                      })
                    }
                  />

                ) : field.type === "boolean" ? (

                  <input
                    type="checkbox"
                    checked={!!form[field.name]}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [field.name]: event.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-border"
                  />

                ) : field.type === "select" ? (

                  <select
                    value={form[field.name] ?? ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [field.name]: event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">—</option>

                    {field.options?.map((option) => (

                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>

                    ))}

                  </select>

                ) : (

                  <Input
                    type={field.type === "number" ? "number" : "text"}
                    value={form[field.name] ?? ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [field.name]: event.target.value,
                      })
                    }
                  />

                )}

              </div>

            ))}

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={save}>
              Save
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
};