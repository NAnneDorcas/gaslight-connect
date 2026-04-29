import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Row = { id: string; display_name: string | null; roles: string[] };

const UsersPage = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ id: string; email: string | null } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [grantEmail, setGrantEmail] = useState("");

  const load = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const u = session.session?.user;
    setMe(u ? { id: u.id, email: u.email ?? null } : null);

    // current user role
    const { data: myRoles } = await supabase.from("user_roles").select("role").eq("user_id", u?.id ?? "");
    const admin = (myRoles ?? []).some((r: any) => r.role === "admin");
    setIsAdmin(admin);

    if (admin) {
      const { data: profiles } = await supabase.from("profiles").select("*");
      const { data: roles } = await supabase.from("user_roles").select("*");
      const merged: Row[] = (profiles ?? []).map((p: any) => ({
        id: p.id, display_name: p.display_name,
        roles: (roles ?? []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role),
      }));
      setRows(merged);
    } else {
      // self-view only
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", u?.id ?? "").maybeSingle();
      setRows(profile ? [{ id: profile.id, display_name: profile.display_name, roles: (myRoles ?? []).map((r: any) => r.role) }] : []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const promoteSelfIfFirst = async () => {
    if (!me) return;
    const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) === 0) {
      const { error } = await supabase.from("user_roles").insert({ user_id: me.id, role: "admin" });
      if (error) toast.error(error.message);
      else { toast.success("You are now admin."); load(); }
    } else {
      toast.error("An admin already exists. Ask them to grant you access.");
    }
  };

  const setRole = async (userId: string, role: "admin" | "editor", on: boolean) => {
    if (on) {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) toast.error(error.message);
    }
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage who can sign into ClearContent CMS and what they can edit.</p>
      </div>

      {!isAdmin && (
        <Card className="p-6">
          <h2 className="font-medium">You don't have admin access</h2>
          <p className="mt-1 text-sm text-muted-foreground">If this is a fresh install with no admins yet, you can claim admin access.</p>
          <Button className="mt-4" onClick={promoteSelfIfFirst}>Claim admin (if first user)</Button>
        </Card>
      )}

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">User</th>
              <th className="px-4 py-3 text-left font-medium">Admin</th>
              <th className="px-4 py-3 text-left font-medium">Editor</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.display_name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{r.id.slice(0, 8)}…</div>
                </td>
                {(["admin", "editor"] as const).map((role) => (
                  <td key={role} className="px-4 py-3">
                    <input type="checkbox" disabled={!isAdmin} checked={r.roles.includes(role)}
                      onChange={(e) => setRole(r.id, role, e.target.checked)}
                      className="h-4 w-4 rounded border-border" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isAdmin && (
        <Card className="p-6 space-y-3">
          <h2 className="font-medium">Invite</h2>
          <p className="text-sm text-muted-foreground">Have new teammates sign up at <code>/auth</code>, then assign them roles above.</p>
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label>Signup link</Label>
              <Input readOnly value={`${window.location.origin}/auth`} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UsersPage;
