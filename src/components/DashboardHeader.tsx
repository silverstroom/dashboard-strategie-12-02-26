import { Activity } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="bg-header text-header-foreground px-6 py-5">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Dashboard Strategie - Salvo Bilotti
          </h1>
          <p className="text-sm text-primary opacity-80">Strategie Social e Sito</p>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
