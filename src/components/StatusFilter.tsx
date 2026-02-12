import { Strategy, StrategyStatus } from "@/data/strategies";

const allStatuses: (StrategyStatus | "Tutte")[] = [
  "Tutte",
  "In pausa",
  "Da realizzare",
  "In attesa/corretta",
  "Pronta per la presentazione",
  "Presentata",
  "Va bene !",
];

interface StatusFilterProps {
  strategies: Strategy[];
  active: StrategyStatus | "Tutte";
  onChange: (status: StrategyStatus | "Tutte") => void;
}

const StatusFilter = ({ strategies, active, onChange }: StatusFilterProps) => {
  const getCount = (status: StrategyStatus | "Tutte") => {
    if (status === "Tutte") return strategies.length;
    return strategies.filter((s) => s.stato_strategia === status).length;
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allStatuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
            active === status
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card text-foreground/70 border border-border hover:bg-muted/40"
          }`}
        >
          {status}
          <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
            active === status
              ? "bg-primary-foreground/20"
              : "bg-muted/30"
          }`}>
            {getCount(status)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
