import { Snowflake } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border bg-primary py-10 text-primary-foreground">
    <div className="container-tight flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-[hsl(var(--accent))]"><Snowflake className="h-3.5 w-3.5" /></span>
        <span className="text-sm font-medium">NordCool OÜ</span>
      </div>
      <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} NordCool. EU F-gas registered trader.</p>
    </div>
  </footer>
);
