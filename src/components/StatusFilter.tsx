import { StrategyStatus } from "@/data/strategies";

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
  active: StrategyStatus | "Tutte";
  onChange: (status: StrategyStatus | "Tutte") => void;
}

const StatusFilter = ({ active, onChange }: StatusFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {allStatuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            active === status
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
