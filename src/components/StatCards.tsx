import { CheckCircle2, Clock, ChevronDown } from "lucide-react";
import { strategies } from "@/data/strategies";
import DonutChart from "./DonutChart";
import { useMemo, useState } from "react";

const StatCards = () => {
  const [showFatturate, setShowFatturate] = useState(false);
  const [showDettaglioTipo, setShowDettaglioTipo] = useState(false);

  const stats = useMemo(() => {
    const fatturate = strategies.filter(
      (s) => s.stato === "Presentata" || s.stato === "Va bene !"
    );
    const inLavorazione = strategies.filter(
      (s) => s.stato !== "Presentata" && s.stato !== "Va bene !" && s.stato !== "In pausa"
    );
    const fatturatoConfermato = fatturate.reduce((sum, s) => sum + s.importo, 0);
    const fatturatoPotenziale = inLavorazione.reduce((sum, s) => sum + s.importo, 0);
    const totale = strategies.reduce((sum, s) => sum + s.importo, 0);
    const socialCount = strategies.filter((s) => s.tipo === "Social").length;
    const sitoCount = strategies.filter((s) => s.tipo === "Sito").length;

    return {
      fatturate,
      inLavorazione,
      fatturatoConfermato,
      fatturatoPotenziale,
      totale,
      socialCount,
      sitoCount,
      percentuale: totale > 0 ? Math.round((fatturatoConfermato / totale) * 100) : 0,
    };
  }, []);

  const confChartData = [
    { name: "Confermato", value: stats.fatturatoConfermato, color: "hsl(160, 60%, 40%)" },
    { name: "Restante", value: stats.totale - stats.fatturatoConfermato, color: "hsl(210, 15%, 90%)" },
  ];

  const socialSitoData = [
    { name: "Social", value: stats.socialCount, color: "hsl(160, 60%, 40%)" },
    { name: "Sito", value: stats.sitoCount, color: "hsl(190, 70%, 50%)" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Fatturato Confermato */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fatturato Confermato
          </span>
        </div>
        <p className="text-3xl font-bold font-display tracking-tight">
          €{stats.fatturatoConfermato.toLocaleString("it-IT")}
        </p>
        <p className="text-sm text-muted-foreground">
          su €{stats.totale.toLocaleString("it-IT")} totali
        </p>
        <DonutChart data={confChartData} />
        <p className="text-center text-sm font-medium text-primary">
          Guadagnato {stats.percentuale}%
        </p>
        <button
          onClick={() => setShowFatturate(!showFatturate)}
          className="mt-3 w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Dettaglio Fatturate ({stats.fatturate.length})</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFatturate ? "rotate-180" : ""}`} />
        </button>
        {showFatturate && (
          <div className="mt-2 space-y-1">
            {stats.fatturate.map((s) => (
              <div key={s.id} className="flex justify-between text-sm py-1 border-t border-border">
                <span className="text-muted-foreground">{s.nomeCliente}</span>
                <span className="font-medium">€{s.importo}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fatturato Potenziale */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fatturato Potenziale
          </span>
        </div>
        <p className="text-3xl font-bold font-display tracking-tight text-center mt-4">
          €{stats.fatturatoPotenziale.toLocaleString("it-IT")}
        </p>
        <div className="mt-6 bg-muted rounded-md p-3">
          <p className="text-sm font-semibold uppercase tracking-wide">
            {stats.inLavorazione.length} strategie in lavorazione
          </p>
        </div>
        <button
          onClick={() => setShowDettaglioTipo(!showDettaglioTipo)}
          className="mt-4 w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Dettaglio per Tipo</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showDettaglioTipo ? "rotate-180" : ""}`} />
        </button>
        {showDettaglioTipo && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm py-1 border-t border-border">
              <span className="text-muted-foreground">Social</span>
              <span className="font-medium">
                €{stats.inLavorazione.filter(s => s.tipo === "Social").reduce((sum, s) => sum + s.importo, 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm py-1 border-t border-border">
              <span className="text-muted-foreground">Sito</span>
              <span className="font-medium">
                €{stats.inLavorazione.filter(s => s.tipo === "Sito").reduce((sum, s) => sum + s.importo, 0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Social vs Sito */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Social vs Sito
        </span>
        <div className="flex items-center gap-4 mt-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-sm font-medium">{stats.socialCount} Social</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-sm font-medium">{stats.sitoCount} Sito</span>
          </div>
        </div>
        <DonutChart data={socialSitoData} />
        <p className="text-center text-sm font-medium text-muted-foreground">
          Social {Math.round((stats.socialCount / strategies.length) * 100)}%
        </p>
      </div>
    </div>
  );
};

export default StatCards;
