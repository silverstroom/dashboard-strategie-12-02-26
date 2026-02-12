import { Strategy, StrategyStatus } from "@/data/strategies";
import { Plus, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface StrategyTableProps {
  strategies: Strategy[];
  activeFilter: StrategyStatus | "Tutte";
}

const statusBadgeMap: Record<StrategyStatus, { text: string; bg: string }> = {
  "Da realizzare": { text: "text-status-da-realizzare", bg: "bg-status-da-realizzare-bg" },
  "Va bene !": { text: "text-status-ok", bg: "bg-status-ok-bg" },
  "In attesa/corretta": { text: "text-status-attesa", bg: "bg-status-attesa-bg" },
  "Pronta per la presentazione": { text: "text-status-pronta", bg: "bg-status-pronta-bg" },
  "Presentata": { text: "text-status-presentata", bg: "bg-status-presentata-bg" },
  "In pausa": { text: "text-status-pausa", bg: "bg-status-pausa-bg" },
};

const StrategyTable = ({ strategies, activeFilter }: StrategyTableProps) => {
  const filtered =
    activeFilter === "Tutte"
      ? strategies
      : strategies.filter((s) => s.stato === activeFilter);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Strategie ({filtered.length})</h2>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          Nuova Strategia
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border bg-card overflow-hidden shadow-sm mt-4">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle text-muted-foreground w-[120px] font-semibold">Codice</th>
                <th className="h-12 px-4 text-left align-middle text-muted-foreground font-semibold">Nome Cliente</th>
                <th className="h-12 px-4 text-left align-middle text-muted-foreground font-semibold">Stato Strategia</th>
                <th className="h-12 px-4 text-right align-middle text-muted-foreground font-semibold">Importo</th>
                <th className="h-12 px-4 text-right align-middle text-muted-foreground font-semibold">Aggiunta il</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((strategy, index) => {
                const badge = statusBadgeMap[strategy.stato];
                const stripColor = strategy.tipo === "Social" ? "bg-social" : "bg-sito";
                const typeBadge = strategy.tipo === "Social"
                  ? "bg-social-light text-social"
                  : "bg-sito-light text-sito";

                return (
                  <tr
                    key={strategy.id}
                    className={`border-b cursor-pointer hover:bg-muted/30 transition-colors group ${
                      index % 2 === 1 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="p-4 align-middle relative font-mono text-sm">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${stripColor}`} />
                      <div className="flex items-center gap-1.5">
                        <span>{strategy.codice}</span>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                          title="Copia cliente"
                          onClick={() => copyToClipboard(strategy.nomeCliente)}
                        >
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium break-words">{strategy.nomeCliente}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeBadge}`}>
                          {strategy.tipo}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                        {strategy.stato}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right font-mono font-semibold">
                      €{strategy.importo}
                    </td>
                    <td className="p-4 align-middle text-right text-muted-foreground text-sm">
                      {strategy.aggiuntaIl}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3 mt-4">
        {filtered.map((strategy, index) => {
          const badge = statusBadgeMap[strategy.stato];
          const stripColor = strategy.tipo === "Social" ? "bg-social" : "bg-sito";
          const typeBadge = strategy.tipo === "Social"
            ? "bg-social-light text-social"
            : "bg-sito-light text-sito";

          return (
            <div
              key={strategy.id}
              className="bg-card rounded-xl shadow-sm border cursor-pointer active:scale-[0.98] transition-all animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className={`h-1 ${stripColor}`} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-1.5">
                    <div>
                      <p className="font-bold text-foreground break-words">{strategy.nomeCliente}</p>
                      <p className="text-xs text-muted-foreground font-mono">{strategy.codice}</p>
                    </div>
                    <button
                      className="p-1 rounded hover:bg-muted shrink-0 mt-0.5"
                      title="Copia cliente"
                      onClick={() => copyToClipboard(strategy.nomeCliente)}
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeBadge}`}>
                    {strategy.tipo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                      {strategy.stato}
                    </span>
                    <span className="text-xs text-muted-foreground">{strategy.aggiuntaIl}</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-foreground">€{strategy.importo}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StrategyTable;
