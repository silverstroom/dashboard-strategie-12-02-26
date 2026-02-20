import { Strategy, StrategyStatus } from "@/data/strategies";
import { CheckCircle2, Clock, Wrench, Presentation, TrendingUp, Plus } from "lucide-react";
import DonutChart from "./DonutChart";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

interface HomeOverviewProps {
  strategies: Strategy[];
  onNewStrategy: () => void;
}

const formatImporto = (n: number) => `€${n.toLocaleString("it-IT")}`;

const SECTION_CONFIG: {
  key: string;
  label: string;
  statuses: StrategyStatus[];
  icon: React.FC<{ className?: string }>;
  colorClass: string;
  bgClass: string;
}[] = [
  {
    key: "da-realizzare",
    label: "Da Realizzare",
    statuses: ["Da realizzare", "In attesa/corretta"],
    icon: Wrench,
    colorClass: "text-status-da-realizzare",
    bgClass: "bg-status-da-realizzare-bg",
  },
  {
    key: "ready-to",
    label: "Ready to Present",
    statuses: ["Pronta per la presentazione"],
    icon: Presentation,
    colorClass: "text-status-pronta",
    bgClass: "bg-status-pronta-bg",
  },
  {
    key: "presentata",
    label: "Presentata",
    statuses: ["Presentata"],
    icon: TrendingUp,
    colorClass: "text-status-presentata",
    bgClass: "bg-status-presentata-bg",
  },
  {
    key: "confermata",
    label: "Confermata",
    statuses: ["Va bene !"],
    icon: CheckCircle2,
    colorClass: "text-status-ok",
    bgClass: "bg-status-ok-bg",
  },
];

const HomeOverview = ({ strategies, onNewStrategy }: HomeOverviewProps) => {
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
    const percentuale = totale > 0 ? Math.round((fatturatoConfermato / totale) * 100) : 0;

    return { fatturatoConfermato, fatturatoPotenziale, totale, socialCount, sitoCount, percentuale, inLavorazione };
  }, [strategies]);

  const confChartData = [
    { name: "Confermato", value: stats.fatturatoConfermato, color: "hsl(161, 93%, 30%)" },
    { name: "Potenziale", value: stats.fatturatoPotenziale, color: "hsl(0, 0%, 63%)" },
  ];

  const socialSitoData = [
    { name: "Social", value: stats.socialCount, color: "hsl(161, 70%, 38%)" },
    { name: "Sito", value: stats.sitoCount, color: "hsl(199, 70%, 48%)" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Panoramica</h2>
          <p className="text-sm text-muted-foreground">{strategies.length} strategie totali</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={onNewStrategy}>
          <Plus className="w-4 h-4" />
          Nuova
        </Button>
      </div>

      {/* Fatturato hero card */}
      <div className="rounded-xl border bg-card shadow-sm p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Fatturato Totale</p>
        <div className="flex items-end gap-3 mb-4">
          <span className="text-4xl font-bold font-mono text-foreground">{formatImporto(stats.totale)}</span>
          <span className="text-sm text-muted-foreground mb-1">{stats.percentuale}% confermato</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-status-ok-bg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-status-ok" />
              <p className="text-[10px] font-semibold text-status-ok uppercase tracking-wide">Confermato</p>
            </div>
            <p className="text-xl font-bold font-mono text-foreground">{formatImporto(stats.fatturatoConfermato)}</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Potenziale</p>
            </div>
            <p className="text-xl font-bold font-mono text-foreground">{formatImporto(stats.fatturatoPotenziale)}</p>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Donut fatturato */}
        <div className="rounded-xl border bg-card shadow-sm p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Avanzamento</p>
          <DonutChart data={confChartData} innerRadius={38} outerRadius={58} height={130} />
          <div className="flex flex-col gap-1 mt-2">
            {confChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut social vs sito */}
        <div className="rounded-xl border bg-card shadow-sm p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tipologia</p>
          <DonutChart data={socialSitoData} innerRadius={38} outerRadius={58} height={130} />
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-social shrink-0" />
              <span className="text-xs text-muted-foreground">{stats.socialCount} Social</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sito shrink-0" />
              <span className="text-xs text-muted-foreground">{stats.sitoCount} Sito</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline per sezione */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pipeline per Stato</p>
        <div className="grid grid-cols-2 gap-3">
          {SECTION_CONFIG.map(({ key, label, statuses, icon: Icon, colorClass, bgClass }) => {
            const count = strategies.filter((s) => statuses.includes(s.stato_strategia)).length;
            const importo = strategies
              .filter((s) => statuses.includes(s.stato_strategia))
              .reduce((sum, s) => sum + s.importo_strategia, 0);
            return (
              <div key={key} className={`rounded-xl border bg-card shadow-sm p-4`}>
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${bgClass} mb-3`}>
                  <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${colorClass}`}>{label}</span>
                </div>
                <p className="text-2xl font-bold font-mono text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatImporto(importo)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeOverview;
