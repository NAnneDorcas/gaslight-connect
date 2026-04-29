import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Snowflake } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/cms", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/cms` },
        });
        if (error) throw error;
        toast.success("Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/cms");
      }
    } catch (e: any) {
      toast.error(e.message ?? "Auth error");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-hero-gradient text-primary-foreground"><Snowflake className="h-4 w-4" /></span>
          <div>
            <h1 className="font-semibold">ClearContent CMS</h1>
            <p className="text-xs text-muted-foreground">{mode === "signup" ? "Create an account" : "Sign in to manage content"}</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "…" : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>
        <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground">
          {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
        <Link to="/" className="mt-2 block text-center text-xs text-muted-foreground hover:underline">← Back to site</Link>
      </Card>
    </div>
  );
};

export default Auth;
