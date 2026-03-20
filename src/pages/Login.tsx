import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import loginIcon from "@/assets/login-icon.jpg";

const ADMIN_EMAIL = "admin@dashboard.local";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username !== "admin") {
      toast.error("Credenziali non valide");
      return;
    }
    setLoading(true);
    if (!rememberMe) {
      await supabase.auth.setSession({ access_token: '', refresh_token: '' }).catch(() => {});
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
    setLoading(false);
    if (error) {
      toast.error("Credenziali non valide");
    } else {
      if (!rememberMe) {
        sessionStorage.setItem("temp_session", "true");
      } else {
        sessionStorage.removeItem("temp_session");
      }
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="liquid-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-4 overflow-hidden shadow-[0_4px_16px_rgba(0,122,255,0.12)]">
              <img src={loginIcon} alt="Logo" className="w-9 h-9 object-contain" />
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Dashboard Strategie</h1>
            <p className="text-sm text-muted-foreground mt-1">Accedi per continuare</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-medium text-muted-foreground">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="h-11 rounded-xl bg-muted/30 border-border/60 focus:bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-11 rounded-xl bg-muted/30 border-border/60 focus:bg-card"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="rounded-md"
              />
              <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer text-muted-foreground">
                Ricordami
              </Label>
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl font-medium shadow-[0_2px_12px_rgba(0,122,255,0.25)] liquid-press" disabled={loading}>
              {loading ? "Accesso..." : "Accedi"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
