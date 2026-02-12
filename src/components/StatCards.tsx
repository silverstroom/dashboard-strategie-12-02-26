import { CheckCircle2, Clock, Info, ChevronDown } from "lucide-react";
import DonutChart from "./DonutChart";
import { useMemo, useState } from "react";
import { Strategy } from "@/data/strategies";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatCardsProps {
  strategies: Strategy[];
}

const formatImporto = (n: number) => `€${n.toLocaleString("it-IT")}`;

const StatCards = ({ strategies }: StatCardsProps) => {
  const [showFatturate, setShowFatturate] = useState(false);
  const [showInLavorazione, setShowInLavorazione] = useState(false);
  const [showDettaglioTipo, setShowDettaglioTipo] = useState(false);

  const stats = useMemo(() => {
    const fatturate = strategies.filter((s) => s.stato_strategia === "Va bene !");
    const inLavorazione = strategies.filter(
      (s) => s.stato_strategia !== "Va bene !" && s.stato_strategia !== "In pausa"
    );
    const fatturatoConfermato = fatturate.reduce((sum, s) => sum + s.importo_strategia, 0);
    const fatturatoPotenziale = inLavorazione.reduce((sum, s) => sum + s.importo_strategia, 0);
    const totale = fatturatoConfermato + fatturatoPotenziale;
    const socialCount = strategies.filter((s) => s.tipo_strategia === "Social").length;
    const sitoCount = strategies.filter((s) => s.tipo_strategia === "Sito").length;

    // Count per stato for "in lavorazione"
    const statoCounts: Record<string, number> = {};
    inLavorazione.forEach((s) => {
      statoCounts[s.stato_strategia] = (statoCounts[s.stato_strategia] || 0) + 1;
    });

    return {
      fatturate,
      inLavorazione,
      fatturatoConfermato,
      fatturatoPotenziale,
      totale,
      socialCount,
      sitoCount,
      statoCounts,
      percentuale: totale > 0 ? Math.round((fatturatoConfermato / totale) * 100) : 0,
    };
  }, [strategies]);

  const confChartData = [
    { name: "Guadagnato", value: stats.fatturatoConfermato, color: "hsl(161, 93%, 30%)" },
    { name: "Potenziale", value: stats.fatturatoPotenziale, color: "hsl(0, 0%, 63%)" },
  ];

  const socialSitoData = [
    { name: "Social", value: stats.socialCount, color: "hsl(161, 70%, 38%)" },
    { name: "Sito", value: stats.sitoCount, color: "hsl(199, 70%, 48%)" },
  ];

  const fatturateSocial = stats.fatturate.filter((s) => s.tipo_strategia === "Social");
  const fatturateSito = stats.fatturate.filter((s) => s.tipo_strategia === "Sito");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Fatturato Confermato */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
        <div className="flex flex-col space-y-1.5 p-6 pb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Fatturato Confermato
          </h3>
        </div>
        <div className="p-6 pt-0 space-y-3">
          <div>
            <span className="block text-2xl sm:text-3xl font-bold font-mono text-foreground">
              {formatImporto(stats.fatturatoConfermato)}
            </span>
            <span className="text-xs text-muted-foreground">
              su {formatImporto(stats.totale)} totali
            </span>
          </div>
          <DonutChart data={confChartData} label={`Guadagnato ${stats.percentuale}%`} innerRadius={35} outerRadius={55} height={140} />
          <div>
            <button
              onClick={() => setShowFatturate(!showFatturate)}
              className="flex items-center justify-between w-full border-t border-border pt-2 group cursor-pointer"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Dettaglio Fatturate ({stats.fatturate.length})
              </p>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showFatturate ? "rotate-180" : ""}`} />
            </button>
            {showFatturate && (
              <div className="mt-2 space-y-2">
                {fatturateSocial.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-social uppercase mb-1">Social</p>
                    {fatturateSocial.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm py-1 border-t border-border">
                        <span className="text-muted-foreground">{s.nome_cliente}</span>
                        <span className="font-medium font-mono">{formatImporto(s.importo_strategia)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {fatturateSito.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-sito uppercase mb-1">Sito</p>
                    {fatturateSito.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm py-1 border-t border-border">
                        <span className="text-muted-foreground">{s.nome_cliente}</span>
                        <span className="font-medium font-mono">{formatImporto(s.importo_strategia)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fatturato Potenziale */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col space-y-1.5 p-6 pb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-accent-foreground" />
            Fatturato Potenziale
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Revenue futura stimata (escluse strategie in pausa).</p>
              </TooltipContent>
            </Tooltip>
          </h3>
        </div>
        <div className="p-6 pt-0 space-y-3">
          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
              {formatImporto(stats.fatturatoPotenziale)}
            </span>
          </div>
          <div>
            <button
              onClick={() => setShowInLavorazione(!showInLavorazione)}
              className="flex items-center justify-between w-full bg-muted/50 rounded-lg p-3 group cursor-pointer"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                {stats.inLavorazione.length} strategie in lavorazione
              </p>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showInLavorazione ? "rotate-180" : ""}`} />
            </button>
            {showInLavorazione && (
              <div className="mt-2 space-y-1">
                {Object.entries(stats.statoCounts).map(([stato, count]) => (
                  <div key={stato} className="flex justify-between text-sm py-1 border-t border-border">
                    <span className="text-muted-foreground">{stato}</span>
                    <span className="font-medium font-mono">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => setShowDettaglioTipo(!showDettaglioTipo)}
              className="flex items-center justify-between w-full border-t border-border pt-2 group cursor-pointer"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Dettaglio per Tipo
              </p>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showDettaglioTipo ? "rotate-180" : ""}`} />
            </button>
            {showDettaglioTipo && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm py-1 border-t border-border">
                  <span className="text-muted-foreground">Social</span>
                  <span className="font-medium font-mono">
                    {formatImporto(stats.inLavorazione.filter(s => s.tipo_strategia === "Social").reduce((sum, s) => sum + s.importo_strategia, 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1 border-t border-border">
                  <span className="text-muted-foreground">Sito</span>
                  <span className="font-medium font-mono">
                    {formatImporto(stats.inLavorazione.filter(s => s.tipo_strategia === "Sito").reduce((sum, s) => sum + s.importo_strategia, 0))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social vs Sito */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex flex-col space-y-1.5 p-6 pb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Social vs Sito
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-social" />
              <span className="text-sm font-medium">{stats.socialCount} Social</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-sito" />
              <span className="text-sm font-medium">{stats.sitoCount} Sito</span>
            </div>
          </div>
          <DonutChart
            data={socialSitoData}
            label={`Social ${Math.round((stats.socialCount / strategies.length) * 100)}%`}
            innerRadius={40}
            outerRadius={65}
            height={160}
          />
        </div>
      </div>
    </div>
  );
};

export default StatCards;
