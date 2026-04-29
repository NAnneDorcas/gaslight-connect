import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Menu as MenuIcon,
  FormInput,
  Search,
  Languages,
  Users,
  Snowflake,
  LogOut,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

const nav = [
  { to: "/cms", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/cms/blocks", label: "Blocks", icon: LayoutGrid },
  { to: "/cms/menu", label: "Menu", icon: MenuIcon },
  { to: "/cms/forms", label: "Form fields", icon: FormInput },
  { to: "/cms/seo", label: "SEO", icon: Search },
  { to: "/cms/languages", label: "Languages", icon: Languages },
  { to: "/cms/users", label: "Users", icon: Users },
  { to: "/", label: "Preview site", icon: Eye },
];

const CmsLayout = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/auth", { replace: true });
        } else {
          setEmail(session.user.email ?? null);
          setReady(true);
        }
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/auth", { replace: true });
      } else {
        setEmail(data.session.user.email ?? null);
        setReady(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/auth");
  };

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Loading ClearContent CMS…
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="relative border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[hsl(var(--accent))]">
            <Snowflake className="h-4 w-4 text-accent-foreground" />
          </span>

          <div>
            <div className="font-semibold leading-tight">
              ClearContent CMS
            </div>
            <div className="text-xs text-sidebar-foreground/60">
              AI Web Session 2026
            </div>
          </div>
        </div>

        <nav className="space-y-0.5 p-3">
          {nav.map((item) => (
            <NavLink
              key={item.to + item.label}
              to={item.to}
              end={item.end as any}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 hidden w-[260px] border-t border-sidebar-border p-3 text-xs md:block">
          <div className="truncate px-2 py-2 text-sidebar-foreground/60">
            {email}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to public site
          </Button>

          <div className="text-sm font-medium text-muted-foreground">
            ClearContent CMS
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="md:hidden"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <main className="flex-1 bg-muted/30 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CmsLayout;