import { Strategy, StrategyStatus } from "@/data/strategies";
import { CheckCircle2, Clock, Wrench, Presentation, TrendingUp, Plus, AlertCircle, AlertTriangle, Archive, ChevronRight } from "lucide-react";
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
    const active = strategies.filter((s) => s.stato_strategia !== "Archiviata");
    const archived = strategies.filter((s) => s.stato_strategia === "Archiviata");

    const confermata = active.filter((s) => s.stato_strategia === "Va bene !");
    const daFare = active.filter((s) =>
      ["Da realizzare", "In attesa/corretta"].includes(s.stato_strategia)
    );
    const readyTo = active.filter((s) => s.stato_strategia === "Pronta per la presentazione");
    const inApprovazione = active.filter((s) => s.stato_strategia === "Presentata");
    const inPausa = active.filter((s) => s.stato_strategia === "In pausa");

    const fatturatoConfermato = confermata.reduce((sum, s) => sum + s.importo_strategia, 0);
    const fatturatoPotenziale = active
      .filter((s) => s.stato_strategia !== "Va bene !" && s.stato_strategia !== "In pausa")
      .reduce((sum, s) => sum + s.importo_strategia, 0);

    const fatturatoArchiviato = archived.reduce((sum, s) => sum + s.importo_strategia, 0);

    const socialCount = active.filter((s) => s.tipo_strategia === "Social").length;
    const sitoCount = active.filter((s) => s.tipo_strategia === "Sito").length;
    const customCount = active.filter((s) => s.tipo_strategia === "Custom").length;

    const agentiMap: Record<string, { confermato: number; totale: number; count: number }> = {};
    active.forEach((s) => {
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
      fatturatoArchiviato,
      archived,
      daFare,
      readyTo,
      inApprovazione,
      confermata,
      inPausa,
      socialCount,
      sitoCount,
      customCount,
      agentiData,
      activeCount: active.length,
    };
  }, [strategies]);

  const AGENT_COLORS = [
    "hsl(211, 100%, 50%)",
    "hsl(152, 69%, 40%)",
    "hsl(340, 75%, 55%)",
    "hsl(262, 52%, 56%)",
    "hsl(38, 92%, 50%)",
  ];

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Panoramica</h2>
          <p className="text-sm text-muted-foreground">{stats.activeCount} strategie attive</p>
        </div>
        <Button size="sm" className="gap-1.5 rounded-xl h-9 px-4 shadow-[0_2px_12px_rgba(0,122,255,0.25)] liquid-press" onClick={onNewStrategy}>
          <Plus className="w-4 h-4" />
          Nuova
        </Button>
      </div>

      {/* ── DA FARE: card priorità alta ── */}
      <button
        onClick={() => onTabChange?.("da-realizzare")}
        className="w-full text-left liquid-card p-5 liquid-press animate-fade-in"
        style={{ animationDelay: "0.05s", background: "hsl(var(--status-da-realizzare-bg))", borderColor: "hsl(var(--status-da-realizzare) / 0.25)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-status-da-realizzare/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-status-da-realizzare" />
            </div>
            <div>
              <p className="text-xs font-semibold text-status-da-realizzare uppercase tracking-wider">
                Da Fare · Priorità Alta
              </p>
              <p className="text-[11px] text-status-da-realizzare/60 mt-0.5">Strategie da erogare</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold font-mono text-status-da-realizzare">
              {stats.daFare.length}
            </span>
            <ChevronRight className="w-4 h-4 text-status-da-realizzare/40" />
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-status-da-realizzare/70 flex-wrap">
          <span className="font-medium">
            {stats.daFare.filter((s) => s.stato_strategia === "Da realizzare").length} da iniziare · {formatImportoFull(stats.daFare.reduce((s, v) => s + v.importo_strategia, 0))} potenziale
          </span>
          <span className="opacity-30">·</span>
          <span className="inline-flex items-center gap-1 font-semibold text-urgent-foreground">
            <AlertTriangle className="w-3 h-3" />
            {stats.daFare.filter((s) => s.stato_strategia === "In attesa/corretta").length} correzione urgente
          </span>
        </div>
      </button>

      {/* ── Fatturato confermato ── */}
      <div className="liquid-card p-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Fatturato Confermato
        </p>
        <div className="flex items-end gap-3 mb-4">
          <span className="text-3xl font-bold font-mono text-foreground tracking-tight">
            {formatImportoFull(stats.fatturatoConfermato)}
          </span>
          <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-status-ok" />
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
              bgColor: "bg-status-pronta-bg",
              icon: Presentation,
            },
            {
              label: "In approv.",
              count: stats.inApprovazione.length,
              tab: "in-approvazione",
              color: "text-status-presentata",
              bgColor: "bg-status-presentata-bg",
              icon: Clock,
            },
            {
              label: "Confermata",
              count: stats.confermata.length,
              tab: "confermata",
              color: "text-status-ok",
              bgColor: "bg-status-ok-bg",
              icon: CheckCircle2,
            },
            {
              label: "In pausa",
              count: stats.inPausa.length,
              tab: "da-realizzare",
              color: "text-status-pausa",
              bgColor: "bg-status-pausa-bg",
              icon: AlertCircle,
            },
          ].map(({ label, count, tab, color, bgColor, icon: Icon }) => (
            <button
              key={label}
              onClick={() => tab && onTabChange?.(tab)}
              className={`flex flex-col items-center rounded-2xl ${bgColor} py-3 px-1 transition-all duration-300 ${tab ? "hover:shadow-md active:scale-95" : "cursor-default"}`}
            >
              <Icon className={`w-4 h-4 ${color} mb-1.5`} />
              <span className="text-lg font-bold font-mono text-foreground">{count}</span>
              <span className="text-[9px] text-muted-foreground text-center leading-tight font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grafico agenti ── */}
      {stats.agentiData.length > 0 && (
        <div className="liquid-card p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Rendimento Agenti
            </p>
            <span className="text-[10px] text-muted-foreground font-medium">fatturato confermato</span>
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
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "var(--glass-shadow)",
                }}
                formatter={(value: number, name: string) => [
                  `€${value.toLocaleString("it-IT")}`,
                  name === "confermato" ? "Confermato" : "Potenziale",
                ]}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              />
              <Bar dataKey="confermato" radius={[8, 8, 0, 0]} name="confermato">
                {stats.agentiData.map((_, i) => (
                  <Cell key={i} fill={AGENT_COLORS[i % AGENT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
            {stats.agentiData.map((a, i) => (
              <div key={a.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: AGENT_COLORS[i % AGENT_COLORS.length] }}
                />
                <span className="text-[10px] text-muted-foreground font-medium">
                  {a.name} · {a.count} str.
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Distribuzione Tipologia ── */}
      <div className="liquid-card p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Tipologia Strategie
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-3 rounded-2xl bg-social-light px-3 py-3">
            <div className="w-3 h-3 rounded-full bg-social shrink-0" />
            <div>
              <p className="text-lg font-bold font-mono text-foreground">{stats.socialCount}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Social</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-sito-light px-3 py-3">
            <div className="w-3 h-3 rounded-full bg-sito shrink-0" />
            <div>
              <p className="text-lg font-bold font-mono text-foreground">{stats.sitoCount}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Sito</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-custom-bg border border-custom-border px-3 py-3">
            <div className="w-3 h-3 rounded-full bg-custom shrink-0" />
            <div>
              <p className="text-lg font-bold font-mono text-foreground">{stats.customCount}</p>
              <p className="text-[10px] text-custom-foreground font-medium">Custom</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Archivio stats ── */}
      {stats.archived.length > 0 && (
        <div className="liquid-card p-5 animate-fade-in border-dashed" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Archive className="w-4 h-4 text-muted-foreground" />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Archivio · Fatturate e Concluse
            </p>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <span className="text-2xl font-bold font-mono text-muted-foreground">
                {formatImportoFull(stats.fatturatoArchiviato)}
              </span>
              <p className="text-[10px] text-muted-foreground">fatturato totale archiviato</p>
            </div>
            <span className="text-sm font-mono text-muted-foreground mb-0.5">
              {stats.archived.length} strategi{stats.archived.length === 1 ? "a" : "e"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeOverview;
