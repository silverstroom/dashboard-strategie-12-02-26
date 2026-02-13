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
    <header className="bg-primary text-primary-foreground px-4 py-4 md:px-6 md:py-5 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/10 backdrop-blur">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Dashboard Strategie - Salvo Bilotti
            </h1>
            <p className="text-xs md:text-sm opacity-75">Strategie Social e Sito</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <LogOut className="w-4 h-4 mr-1.5" />
          Esci
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
