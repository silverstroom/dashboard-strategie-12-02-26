import { Home, Wrench, Presentation, CheckCheck } from "lucide-react";

export type AppTab = "home" | "da-realizzare" | "ready-to" | "presentata";

interface BottomNavProps {
  active: AppTab;
  onChange: (tab: AppTab) => void;
}

const navItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "da-realizzare", label: "Da fare", icon: Wrench },
  { id: "ready-to", label: "Ready to", icon: Presentation },
  { id: "presentata", label: "Presentata", icon: CheckCheck },
];

const BottomNav = ({ active, onChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-stretch h-16 max-w-2xl mx-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 relative ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? "text-primary" : ""}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
