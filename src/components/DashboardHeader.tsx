import { Activity, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="glass-strong sticky top-0 z-40 px-4 py-3 md:px-6">
      <div className="container mx-auto flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-primary/10">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-semibold tracking-tight leading-tight text-foreground">
              Dashboard Strategie
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">Salvo Bilotti</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/60 h-9 px-3 rounded-xl liquid-press"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline ml-1.5 text-sm">Esci</span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
