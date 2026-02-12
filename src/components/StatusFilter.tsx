import { Strategy, StrategyStatus } from "@/data/strategies";

const allStatuses: (StrategyStatus | "Tutte")[] = [
  "Tutte",
  "Va bene !",
  "Da realizzare",
  "In attesa/corretta",
  "Pronta per la presentazione",
  "Presentata",
  "In pausa",
];

interface StatusFilterProps {
  strategies: Strategy[];
  active: StrategyStatus | "Tutte";
  onChange: (status: StrategyStatus | "Tutte") => void;
}

const StatusFilter = ({ strategies, active, onChange }: StatusFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allStatuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
            active === status
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card text-foreground/70 border border-border hover:bg-muted/40"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
