import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";

type Field = {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  sort_order?: number;
};

export const Contact = ({
  block,
  formFields = [],
}: {
  block?: any;
  formFields?: Field[];
}) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const field of formFields) {
        const value = values[field.name] ?? "";

        if (field.required && !value.trim()) {
          toast.error(`${field.label} is required`);
          setLoading(false);
          return;
        }

        if (field.type === "email" && value && !z.string().email().safeParse(value).success) {
          toast.error(`${field.label}: invalid email`);
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/.netlify/functions/submit-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      toast.success("Thank you for your message. We will contact you shortly.");
      setValues({});
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container-tight grid gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[hsl(var(--accent))]">
            {block?.subtitle}
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            {block?.title || "Contact"}
          </h2>

          <p className="mt-6 text-muted-foreground">
            {block?.body ||
              "Contact our team to discuss your refrigerant gas requirements."}
          </p>

          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[hsl(var(--accent))]" />
              trading@nordcool.eu
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[hsl(var(--accent))]" />
              +372 600 7700
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[hsl(var(--accent))]" />
              Tallinn, Estonia · EU
            </li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-card"
        >
          {formFields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && " *"}
              </Label>

              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, [field.name]: e.target.value })
                  }
                  rows={4}
                  maxLength={2000}
                />
              ) : field.type === "checkbox" ? (
                <input
                  id={field.name}
                  name={field.name}
                  type="checkbox"
                  checked={values[field.name] === "true"}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      [field.name]: e.target.checked ? "true" : "",
                    })
                  }
                  className="h-4 w-4"
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, [field.name]: e.target.value })
                  }
                  maxLength={500}
                />
              )}
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "…" : "Send Request"}
          </Button>
        </form>
      </div>
    </section>
  );
};