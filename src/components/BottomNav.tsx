import { Home, Wrench, Presentation, Eye, CheckCheck } from "lucide-react";

export type AppTab = "home" | "da-realizzare" | "ready-to" | "in-approvazione" | "confermata";

interface BottomNavProps {
  active: AppTab;
  onChange: (tab: AppTab) => void;
  badge?: Partial<Record<AppTab, number>>;
}

const navItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "da-realizzare", label: "Da fare", icon: Wrench },
  { id: "ready-to", label: "Ready to", icon: Presentation },
  { id: "in-approvazione", label: "In revisione", icon: Eye },
  { id: "confermata", label: "Confermata", icon: CheckCheck },
];

const BottomNav = ({ active, onChange, badge }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-3 mb-3 glass-strong rounded-2xl">
        <div className="flex items-stretch h-16 max-w-2xl mx-auto px-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            const count = badge?.[id];
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-300 relative rounded-xl mx-0.5 liquid-press ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-1 bg-primary/8 rounded-xl transition-all duration-300" />
                )}
                <div className="relative z-10">
                  <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? "scale-110" : ""}`} />
                  {count !== undefined && count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </div>
                <span className={`relative z-10 text-[10px] font-medium tracking-wide ${isActive ? "text-primary font-semibold" : ""}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
