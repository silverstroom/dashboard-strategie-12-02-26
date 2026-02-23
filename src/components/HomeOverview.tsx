import { Strategy, StrategyStatus } from "@/data/strategies";
import { CheckCircle2, Clock, Wrench, Presentation, TrendingUp, Plus, AlertCircle, AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface HomeOverviewProps {
  strategies: Strategy[];
  onNewStrategy: () => void;
  onTabChange?: (tab: string) => void;
}

const formatImporto = (n: number) =>
  n >= 1000 ? `€${(n / 1000).toFixed(1).replace(".0", "")}k` : `€${n}`;
const formatImportoFull = (n: number) => `€${n.toLocaleString("it-IT")}`;

const HomeOverview = ({ strategies, onNewStrategy, onTabChange }: HomeOverviewProps) => {
  const stats = useMemo(() => {
    const confermata = strategies.filter((s) => s.stato_strategia === "Va bene !");
    const daFare = strategies.filter((s) =>
      ["Da realizzare", "In attesa/corretta"].includes(s.stato_strategia)
    );
    const readyTo = strategies.filter((s) => s.stato_strategia === "Pronta per la presentazione");
    const inApprovazione = strategies.filter((s) => s.stato_strategia === "Presentata");
    const inPausa = strategies.filter((s) => s.stato_strategia === "In pausa");

    const fatturatoConfermato = confermata.reduce((sum, s) => sum + s.importo_strategia, 0);
    const fatturatoPotenziale = strategies
      .filter((s) => s.stato_strategia !== "Va bene !" && s.stato_strategia !== "In pausa")
      .reduce((sum, s) => sum + s.importo_strategia, 0);

    const socialCount = strategies.filter((s) => s.tipo_strategia === "Social").length;
    const sitoCount = strategies.filter((s) => s.tipo_strategia === "Sito").length;
    const customCount = strategies.filter((s) => s.tipo_strategia === "Custom").length;

    // Agenti: raggruppa per agente con fatturato confermato e numero strategie
    const agentiMap: Record<string, { confermato: number; totale: number; count: number }> = {};
    strategies.forEach((s) => {
      const key = s.agente || "N/A";
      if (!agentiMap[key]) agentiMap[key] = { confermato: 0, totale: 0, count: 0 };
      agentiMap[key].count += 1;
      agentiMap[key].totale += s.importo_strategia;
      if (s.stato_strategia === "Va bene !") agentiMap[key].confermato += s.importo_strategia;
    });
    const agentiData = Object.entries(agentiMap)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.confermato - a.confermato);

    return {
      fatturatoConfermato,
      fatturatoPotenziale,
      daFare,
      readyTo,
      inApprovazione,
      confermata,
      inPausa,
      socialCount,
      sitoCount,
      customCount,
      agentiData,
    };
  }, [strategies]);

  // Colori agenti (cycling)
  const AGENT_COLORS = [
    "hsl(161, 93%, 30%)",
    "hsl(199, 89%, 48%)",
    "hsl(330, 81%, 50%)",
    "hsl(280, 68%, 50%)",
    "hsl(38, 92%, 50%)",
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top bar */}
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

      {/* ── DA FARE: card priorità alta ── */}
      <button
        onClick={() => onTabChange?.("da-realizzare")}
        className="w-full text-left rounded-xl border-2 border-status-da-realizzare bg-status-da-realizzare-bg p-4 shadow-sm active:scale-[0.98] transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-status-da-realizzare/10 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-status-da-realizzare" />
            </div>
            <div>
              <p className="text-xs font-bold text-status-da-realizzare uppercase tracking-wider">
                ⚡ Da Fare · Priorità Alta
              </p>
              <p className="text-[11px] text-status-da-realizzare/70">Strategie da erogare</p>
            </div>
          </div>
          <span className="text-4xl font-black font-mono text-status-da-realizzare">
            {stats.daFare.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-status-da-realizzare/80 flex-wrap">
          <span className="font-semibold">
            {stats.daFare.filter((s) => s.stato_strategia === "Da realizzare").length} da iniziare
          </span>
          <span className="opacity-40">·</span>
          <span className="inline-flex items-center gap-1 font-bold text-urgent-foreground">
            <AlertTriangle className="w-3 h-3" />
            {stats.daFare.filter((s) => s.stato_strategia === "In attesa/corretta").length} correzione urgente
          </span>
          <span className="opacity-40">·</span>
          <span className="font-semibold">
            {formatImportoFull(stats.daFare.reduce((s, v) => s + v.importo_strategia, 0))}
          </span>
        </div>
      </button>

      {/* ── Fatturato confermato ── */}
      <div className="rounded-xl border bg-card shadow-sm p-4">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Fatturato Confermato
        </p>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-3xl font-black font-mono text-foreground">
            {formatImportoFull(stats.fatturatoConfermato)}
          </span>
          <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +{formatImportoFull(stats.fatturatoPotenziale)} potenziale
          </span>
        </div>
        {/* Mini stat row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              label: "Ready to",
              count: stats.readyTo.length,
              tab: "ready-to",
              color: "text-status-pronta",
              icon: Presentation,
            },
            {
              label: "In approv.",
              count: stats.inApprovazione.length,
              tab: "in-approvazione",
              color: "text-status-presentata",
              icon: Clock,
            },
            {
              label: "Confermata",
              count: stats.confermata.length,
              tab: "confermata",
              color: "text-status-ok",
              icon: CheckCircle2,
            },
            {
              label: "In pausa",
              count: stats.inPausa.length,
              tab: "da-realizzare",
              color: "text-status-pausa",
              icon: AlertCircle,
            },
          ].map(({ label, count, tab, color, icon: Icon }) => (
            <button
              key={label}
              onClick={() => tab && onTabChange?.(tab)}
              className={`flex flex-col items-center rounded-lg bg-muted/30 py-2.5 px-1 border border-transparent transition-all ${tab ? "hover:border-border active:scale-95" : "cursor-default"}`}
            >
              <Icon className={`w-4 h-4 ${color} mb-1`} />
              <span className="text-lg font-black font-mono text-foreground">{count}</span>
              <span className="text-[9px] text-muted-foreground text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grafico agenti (istogramma) ── */}
      {stats.agentiData.length > 0 && (
        <div className="rounded-xl border bg-card shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Rendimento Agenti
            </p>
            <span className="text-[10px] text-muted-foreground">fatturato confermato</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={stats.agentiData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  `€${value.toLocaleString("it-IT")}`,
                  name === "confermato" ? "Confermato" : "Potenziale",
                ]}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              />
              <Bar dataKey="confermato" radius={[4, 4, 0, 0]} name="confermato">
                {stats.agentiData.map((_, i) => (
                  <Cell key={i} fill={AGENT_COLORS[i % AGENT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legenda agenti */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {stats.agentiData.map((a, i) => (
              <div key={a.name} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: AGENT_COLORS[i % AGENT_COLORS.length] }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {a.name} · {a.count} str.
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Distribuzione Social vs Sito (compatta) ── */}
      <div className="rounded-xl border bg-card shadow-sm p-4">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Tipologia Strategie
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/20 px-3 py-2.5">
            <div className="w-3 h-3 rounded-full bg-social shrink-0" />
            <div>
              <p className="text-lg font-black font-mono text-foreground">{stats.socialCount}</p>
              <p className="text-[10px] text-muted-foreground">Social</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/20 px-3 py-2.5">
            <div className="w-3 h-3 rounded-full bg-sito shrink-0" />
            <div>
              <p className="text-lg font-black font-mono text-foreground">{stats.sitoCount}</p>
              <p className="text-[10px] text-muted-foreground">Sito</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-custom-bg border border-custom-border px-3 py-2.5">
            <div className="w-3 h-3 rounded-full bg-custom shrink-0" />
            <div>
              <p className="text-lg font-black font-mono text-foreground">{stats.customCount}</p>
              <p className="text-[10px] text-custom-foreground">Custom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeOverview;
