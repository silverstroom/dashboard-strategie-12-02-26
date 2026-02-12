import { Strategy, StrategyStatus } from "@/data/strategies";
import { Plus } from "lucide-react";

interface StrategyTableProps {
  strategies: Strategy[];
  activeFilter: StrategyStatus | "Tutte";
}

const statusColorMap: Record<StrategyStatus, string> = {
  "Da realizzare": "text-status-todo",
  "Va bene !": "text-status-ok",
  "In attesa/corretta": "text-status-waiting",
  "Pronta per la presentazione": "text-status-ready",
  "Presentata": "text-status-presented",
  "In pausa": "text-status-paused",
};

const badgeClass: Record<string, string> = {
  Social: "bg-badge-social/15 text-badge-social",
  Sito: "bg-badge-sito/15 text-badge-sito",
};

const StrategyTable = ({ strategies, activeFilter }: StrategyTableProps) => {
  const filtered =
    activeFilter === "Tutte"
      ? strategies
      : strategies.filter((s) => s.stato === activeFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Strategie ({filtered.length})</h2>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Nuova Strategia
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Codice
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nome Cliente
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Stato Strategia
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Importo
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Aggiunta il
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((strategy) => (
              <tr
                key={strategy.id}
                className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3.5 text-sm font-mono text-muted-foreground">
                  {strategy.codice}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{strategy.nomeCliente}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass[strategy.tipo]}`}>
                      {strategy.tipo}
                    </span>
                  </div>
                </td>
                <td className={`px-4 py-3.5 text-sm font-medium ${statusColorMap[strategy.stato]}`}>
                  {strategy.stato}
                </td>
                <td className="px-4 py-3.5 text-sm font-semibold text-right">
                  €{strategy.importo}
                </td>
                <td className="px-4 py-3.5 text-sm text-muted-foreground text-right">
                  {strategy.aggiuntaIl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((strategy) => (
          <div
            key={strategy.id}
            className="bg-card rounded-lg border border-border p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{strategy.nomeCliente}</p>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{strategy.codice}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass[strategy.tipo]}`}>
                {strategy.tipo}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className={`text-sm font-medium ${statusColorMap[strategy.stato]}`}>
                  {strategy.stato}
                </span>
                <span className="text-xs text-muted-foreground ml-2">{strategy.aggiuntaIl}</span>
              </div>
              <span className="text-lg font-bold">€{strategy.importo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyTable;
