import { Strategy } from "@/data/strategies";
import { useMemo } from "react";
import { Users } from "lucide-react";

interface AgentFilterProps {
  strategies: Strategy[];
  activeAgent: string;
  onChange: (agent: string) => void;
}

const AgentFilter = ({ strategies, activeAgent, onChange }: AgentFilterProps) => {
  const agents = useMemo(() => {
    const set = new Set<string>();
    strategies.forEach((s) => {
      if (s.agente) set.add(s.agente);
    });
    return Array.from(set).sort();
  }, [strategies]);

  return (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => onChange("Tutti")}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
            activeAgent === "Tutti"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card text-foreground/70 border border-border hover:bg-muted/40"
          }`}
        >
          Tutti
        </button>
        {agents.map((agent) => (
          <button
            key={agent}
            onClick={() => onChange(agent)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
              activeAgent === agent
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-foreground/70 border border-border hover:bg-muted/40"
            }`}
          >
            {agent}
          </button>
        ))}
        {strategies.some((s) => !s.agente) && (
          <button
            onClick={() => onChange("Senza agente")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
              activeAgent === "Senza agente"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-foreground/70 border border-border hover:bg-muted/40"
            }`}
          >
            Senza agente
          </button>
        )}
      </div>
    </div>
  );
};

export default AgentFilter;
