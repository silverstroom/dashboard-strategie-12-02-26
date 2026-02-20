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
    <header className="bg-primary text-primary-foreground px-4 py-3 md:px-6 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-foreground/10">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold tracking-tight leading-tight">
              Dashboard Strategie
            </h1>
            <p className="text-[10px] opacity-70 leading-tight">Salvo Bilotti</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-primary-foreground hover:bg-primary-foreground/10 h-8 px-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline ml-1.5">Esci</span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
