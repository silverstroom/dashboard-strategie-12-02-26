import { Strategy, StrategyStatus } from "@/data/strategies";
import { Plus, Copy, AlertTriangle, PauseCircle, Star, Archive, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StrategyTableProps {
  strategies: Strategy[];
  activeFilter: StrategyStatus | "Tutte";
  onEdit: (strategy: Strategy) => void;
  onCreate: () => void;
  onCopy: (strategy: Strategy) => void;
  onQuickAction?: (strategy: Strategy, newStatus: StrategyStatus) => void;
  hideHeader?: boolean;
}

const statusBadgeMap: Record<StrategyStatus, { text: string; bg: string }> = {
  "Da realizzare": { text: "text-status-da-realizzare", bg: "bg-status-da-realizzare-bg" },
  "Va bene !": { text: "text-status-ok", bg: "bg-status-ok-bg" },
  "In attesa/corretta": { text: "text-urgent-foreground", bg: "bg-urgent-bg" },
  "Pronta per la presentazione": { text: "text-status-pronta", bg: "bg-status-pronta-bg" },
  "Presentata": { text: "text-status-presentata", bg: "bg-status-presentata-bg" },
  "In pausa": { text: "text-status-pausa", bg: "bg-status-pausa-bg" },
  "Archiviata": { text: "text-muted-foreground", bg: "bg-muted/50" },
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatImporto = (n: number) => `€${n.toLocaleString("it-IT")}`;

const groupByAgente = (strategies: Strategy[]) => {
  const groups: Record<string, Strategy[]> = {};
  strategies.forEach((s) => {
    const key = s.agente || "Senza agente";
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });
  const keys = Object.keys(groups).sort((a, b) => {
    if (a === "Senza agente") return 1;
    if (b === "Senza agente") return -1;
    return a.localeCompare(b);
  });
  return keys.map((key) => ({ agente: key, items: groups[key] }));
};

const isCustom = (s: Strategy) => s.tipo_strategia === "Custom";

const StrategyTable = ({ strategies, activeFilter, onEdit, onCreate, onCopy, onQuickAction, hideHeader }: StrategyTableProps) => {
  const filtered =
    activeFilter === "Tutte"
      ? strategies
      : strategies.filter((s) => s.stato_strategia === activeFilter);

  const sortOrder = (stato: StrategyStatus) => {
    if (stato === "In attesa/corretta") return 0;
    if (stato === "In pausa") return 2;
    return 1;
  };
  const sorted = [...filtered].sort((a, b) => sortOrder(a.stato_strategia) - sortOrder(b.stato_strategia));

  const groups = groupByAgente(sorted);

  const getTypeBadge = (s: Strategy) => {
    if (s.tipo_strategia === "Custom") return "bg-custom-bg text-custom-foreground border border-custom-border";
    if (s.tipo_strategia === "Social") return "bg-social-light text-social";
    return "bg-sito-light text-sito";
  };

  const getStripColor = (s: Strategy) => {
    if (s.stato_strategia === "In attesa/corretta") return "bg-urgent";
    if (s.stato_strategia === "In pausa") return "bg-muted-foreground/40";
    if (s.tipo_strategia === "Custom") return "bg-custom";
    return s.tipo_strategia === "Social" ? "bg-social" : "bg-sito";
  };

  const ImportoDisplay = ({ strategy }: { strategy: Strategy }) => {
    if (isCustom(strategy)) {
      return (
        <span className="inline-flex items-center gap-1 text-custom-foreground font-mono text-xs font-semibold">
          <Star className="w-3 h-3 text-custom" />
          {strategy.nota_custom || "3%"}
        </span>
      );
    }
    return <span>{formatImporto(strategy.importo_strategia)}</span>;
  };

  // Determine which quick actions to show for a strategy
  const canConfirm = (s: Strategy) => s.stato_strategia !== "Va bene !" && s.stato_strategia !== "Archiviata";
  const canArchive = (s: Strategy) => s.stato_strategia === "Va bene !";

  const QuickActions = ({ strategy }: { strategy: Strategy }) => {
    if (!onQuickAction) return null;
    return (
      <div className="flex items-center gap-1">
        {canConfirm(strategy) && (
          <button
            className="p-1.5 rounded-lg hover:bg-status-ok-bg text-muted-foreground hover:text-status-ok transition-colors"
            title="Conferma (Va bene !)"
            onClick={(e) => { e.stopPropagation(); onQuickAction(strategy, "Va bene !"); }}
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        {canArchive(strategy) && (
          <button
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Archivia"
            onClick={(e) => { e.stopPropagation(); onQuickAction(strategy, "Archiviata"); }}
          >
            <Archive className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Strategie ({filtered.length})</h2>
          <Button size="sm" className="gap-1.5" onClick={onCreate}>
            <Plus className="w-4 h-4" />
            Nuova Strategia
          </Button>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block space-y-6 mt-4">
        {groups.map((group) => (
          <div key={group.agente}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              {group.agente} ({group.items.length})
            </h3>
            <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle text-muted-foreground w-[120px] font-semibold">Codice</th>
                      <th className="h-12 px-4 text-left align-middle text-muted-foreground font-semibold">Nome Cliente</th>
                      <th className="h-12 px-4 text-left align-middle text-muted-foreground font-semibold">Stato</th>
                      <th className="h-12 px-4 text-right align-middle text-muted-foreground font-semibold">Importo</th>
                      <th className="h-12 px-4 text-right align-middle text-muted-foreground font-semibold">Aggiunta il</th>
                      {onQuickAction && <th className="h-12 px-2 align-middle text-muted-foreground font-semibold w-[80px]"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((strategy, index) => {
                      const badge = statusBadgeMap[strategy.stato_strategia];
                      const isUrgent = strategy.stato_strategia === "In attesa/corretta";
                      const isPaused = strategy.stato_strategia === "In pausa";
                      const custom = isCustom(strategy);

                      return (
                        <tr
                          key={strategy.id}
                          className={`border-b cursor-pointer hover:bg-muted/30 transition-colors group ${
                            isUrgent ? "bg-urgent-bg" : isPaused ? "bg-muted/40" : custom ? "bg-custom-bg" : index % 2 === 1 ? "bg-muted/20" : ""
                          }`}
                          onClick={() => onEdit(strategy)}
                        >
                          <td className="p-4 align-middle relative font-mono text-sm">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStripColor(strategy)}`} />
                            <div className="flex items-center gap-1.5 pl-1">
                              <span className={isPaused ? "text-muted-foreground" : ""}>{strategy.codice_cliente}</span>
                              <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                                title="Copia cliente"
                                onClick={(e) => { e.stopPropagation(); onCopy(strategy); }}
                              >
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2 flex-wrap">
                              {custom && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-custom-bg border border-custom-border text-custom-foreground text-[10px] font-bold uppercase tracking-wide">
                                  <Star className="w-3 h-3" />
                                  Custom
                                </span>
                              )}
                              {isUrgent && !custom && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-urgent-bg border border-urgent-border text-urgent-foreground text-[10px] font-bold uppercase tracking-wide">
                                  <AlertTriangle className="w-3 h-3" />
                                  Correzione urgente
                                </span>
                              )}
                              {isPaused && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground text-[10px] font-bold uppercase tracking-wide">
                                  <PauseCircle className="w-3 h-3" />
                                  In pausa
                                </span>
                              )}
                              <span className={`font-medium break-words ${isPaused ? "text-muted-foreground" : ""}`}>{strategy.nome_cliente}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getTypeBadge(strategy)} ${isPaused ? "opacity-50" : ""}`}>
                                {strategy.tipo_strategia === "Custom" ? "⭐ Custom" : strategy.tipo_strategia}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                              {strategy.stato_strategia}
                            </span>
                          </td>
                          <td className="p-4 align-middle text-right font-mono font-semibold">
                            <ImportoDisplay strategy={strategy} />
                          </td>
                          <td className="p-4 align-middle text-right text-muted-foreground text-sm">
                            {formatDate(strategy.aggiunta_il)}
                          </td>
                          {onQuickAction && (
                            <td className="p-2 align-middle">
                              <QuickActions strategy={strategy} />
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-6 mt-4">
        {groups.map((group) => (
          <div key={group.agente}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              {group.agente} ({group.items.length})
            </h3>
            <div className="flex flex-col gap-3">
              {group.items.map((strategy, index) => {
                const badge = statusBadgeMap[strategy.stato_strategia];
                const isUrgent = strategy.stato_strategia === "In attesa/corretta";
                const isPaused = strategy.stato_strategia === "In pausa";
                const custom = isCustom(strategy);

                return (
                  <div
                    key={strategy.id}
                    className={`rounded-xl shadow-sm border cursor-pointer active:scale-[0.98] transition-all animate-fade-in overflow-hidden ${
                      isUrgent ? "bg-urgent-bg border-urgent-border" : isPaused ? "bg-muted/50 border-border opacity-75" : custom ? "bg-custom-bg border-custom-border" : "bg-card"
                    }`}
                    style={{ animationDelay: `${index * 0.04}s` }}
                    onClick={() => onEdit(strategy)}
                  >
                    <div className={`h-1 ${getStripColor(strategy)}`} />
                    <div className="p-4">
                      {custom && (
                        <div className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg bg-custom-bg border border-custom-border w-fit">
                          <Star className="w-3.5 h-3.5 text-custom" />
                          <span className="text-[11px] font-bold text-custom-foreground uppercase tracking-wide">
                            Custom — {strategy.nota_custom || "3% della commissione"}
                          </span>
                        </div>
                      )}
                      {isUrgent && !custom && (
                        <div className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg bg-urgent-bg border border-urgent-border w-fit">
                          <AlertTriangle className="w-3.5 h-3.5 text-urgent-foreground" />
                          <span className="text-[11px] font-bold text-urgent-foreground uppercase tracking-wide">
                            Correzione urgente
                          </span>
                        </div>
                      )}
                      {isPaused && (
                        <div className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg bg-muted border border-border w-fit">
                          <PauseCircle className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                            In pausa — momentaneamente ferma
                          </span>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-1.5">
                          <div>
                            <p className={`font-bold break-words ${isPaused ? "text-muted-foreground" : "text-foreground"}`}>{strategy.nome_cliente}</p>
                            <p className="text-xs text-muted-foreground font-mono">{strategy.codice_cliente}</p>
                          </div>
                          <button
                            className="p-1 rounded hover:bg-muted shrink-0 mt-0.5"
                            title="Copia cliente"
                            onClick={(e) => { e.stopPropagation(); onCopy(strategy); }}
                          >
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getTypeBadge(strategy)} ${isPaused ? "opacity-50" : ""}`}>
                            {strategy.tipo_strategia === "Custom" ? "⭐ Custom" : strategy.tipo_strategia}
                          </span>
                          {onQuickAction && <QuickActions strategy={strategy} />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                            {strategy.stato_strategia}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatDate(strategy.aggiunta_il)}</span>
                        </div>
                        <span className={`font-bold font-mono ${isPaused ? "text-muted-foreground" : "text-foreground"} ${custom ? "text-sm" : "text-lg"}`}>
                          {custom ? (
                            <span className="inline-flex items-center gap-1 text-custom-foreground">
                              <Star className="w-3 h-3 text-custom" />
                              {strategy.nota_custom || "3%"}
                            </span>
                          ) : formatImporto(strategy.importo_strategia)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyTable;
