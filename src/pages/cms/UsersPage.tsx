import { useEffect, useState } from "react";
import { supabase, TEAM_SLUG } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Role = "superadmin" | "admin" | "editor";

type Row = {
  id: string;
  email: string;
  role: Role;
  team_slug: string;
};

const UsersPage = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ id: string; email: string | null } | null>(
    null
  );
  const [myRole, setMyRole] = useState<Role | null>(null);

  const isAdmin = myRole === "admin" || myRole === "superadmin";

  const load = async () => {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    setMe({
      id: user.id,
      email: user.email ?? null,
    });

    const { data: myProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setMyRole((myProfile?.role as Role) ?? null);

    if (myProfile?.role === "admin" || myProfile?.role === "superadmin") {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("team_slug", TEAM_SLUG);

      if (error) {
        toast.error(error.message);
      }

      setRows((profiles as Row[]) ?? []);
    } else if (myProfile) {
      setRows([myProfile as Row]);
    } else {
      setRows([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const claimAdmin = async () => {
    if (!me) return;

    const { count, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("role", ["admin", "superadmin"])
      .eq("team_slug", TEAM_SLUG);

    if (countError) {
      toast.error(countError.message);
      return;
    }

    if ((count ?? 0) > 0) {
      toast.error("An admin already exists. Ask them to grant you access.");
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: me.id,
      email: me.email ?? "",
      role: "admin",
      team_slug: TEAM_SLUG,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("You are now admin.");
    load();
  };

  const updateRole = async (userId: string, role: Role) => {
    if (!isAdmin) {
      toast.error("Only admins can manage roles.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .eq("team_slug", TEAM_SLUG);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Role updated");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage ClearContent CMS users and roles.
        </p>
      </div>

      {!isAdmin && (
        <Card className="p-6">
          <h2 className="font-medium">You do not have admin access</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            If this is the first CMS user, claim admin access.
          </p>

          <Button className="mt-4" onClick={claimAdmin}>
            Claim admin
          </Button>
        </Card>
      )}

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Team</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No users yet
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.id.slice(0, 8)}…
                    </div>
                  </td>

                  <td className="px-4 py-3">{row.team_slug}</td>

                  <td className="px-4 py-3">
                    <select
                      disabled={!isAdmin}
                      value={row.role}
                      onChange={(event) =>
                        updateRole(row.id, event.target.value as Role)
                      }
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {isAdmin && (
        <Card className="space-y-3 p-6">
          <h2 className="font-medium">Invite users</h2>
          <p className="text-sm text-muted-foreground">
            Ask new users to sign up here, then assign their role.
          </p>

          <div className="space-y-1">
            <Label>Signup link</Label>
            <Input readOnly value={`${window.location.origin}/auth`} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default UsersPage;