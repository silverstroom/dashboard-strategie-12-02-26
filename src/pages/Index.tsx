import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import StatCards from "@/components/StatCards";
import AgentFilter from "@/components/AgentFilter";
import StrategyTable from "@/components/StrategyTable";
import StrategyModal from "@/components/StrategyModal";
import BottomNav, { AppTab } from "@/components/BottomNav";
import HomeOverview from "@/components/HomeOverview";
import { Strategy, StrategyStatus, getImporto } from "@/data/strategies";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Archive, ChevronDown, ChevronUp, Pause, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const TAB_STATUSES: Record<AppTab, StrategyStatus[]> = {
  "home": [],
  "da-realizzare": ["Da realizzare", "In pausa"],
  "ready-to": ["Pronta per la presentazione"],
  "in-approvazione": ["Presentata", "In attesa/corretta"],
  "confermata": ["Va bene !", "Archiviata"],
};

const TAB_LABELS: Record<AppTab, string> = {
  "home": "Panoramica",
  "da-realizzare": "Da Realizzare",
  "ready-to": "Pronte per la Presentazione",
  "in-approvazione": "In Revisione dal Cliente",
  "confermata": "Confermata",
};

const Index = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>("da-realizzare");
  const [activeAgent, setActiveAgent] = useState<string>("Tutti");
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showArchivio, setShowArchivio] = useState(false);
  const [showInPausa, setShowInPausa] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchStrategies();
    };
    checkAuth();

    const handleBeforeUnload = () => {
      if (sessionStorage.getItem("temp_session") === "true") {
        supabase.auth.signOut();
        sessionStorage.removeItem("temp_session");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const channel = supabase
      .channel("strategies-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "strategies" }, () => {
        fetchStrategies();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchStrategies = async () => {
    const { data, error } = await supabase
      .from("strategies")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      toast.error("Errore nel caricamento dei dati");
      console.error(error);
    } else {
      setStrategies(
        (data || []).map((s) => ({
          id: s.id,
          codice_cliente: s.codice_cliente,
          nome_cliente: s.nome_cliente,
          tipo_strategia: s.tipo_strategia as Strategy["tipo_strategia"],
          stato_strategia: s.stato_strategia as Strategy["stato_strategia"],
          importo_strategia: s.importo_strategia,
          aggiunta_il: s.aggiunta_il,
          data_conferma: s.data_conferma,
          agente: (s as any).agente || "",
          nota_custom: (s as any).nota_custom || undefined,
          note: (s as any).note || undefined,
        }))
      );
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingStrategy(null);
    setIsModalOpen(true);
  };

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setIsModalOpen(true);
  };

  const handleSave = useCallback(async (strategy: Strategy) => {
    const payload: Record<string, any> = {
      codice_cliente: strategy.codice_cliente,
      nome_cliente: strategy.nome_cliente,
      tipo_strategia: strategy.tipo_strategia,
      stato_strategia: strategy.stato_strategia,
      importo_strategia: strategy.importo_strategia,
      aggiunta_il: strategy.aggiunta_il,
      data_conferma: strategy.data_conferma,
      agente: strategy.agente,
      nota_custom: strategy.nota_custom || null,
      note: strategy.note || null,
    };

    const isExisting = strategies.some((s) => s.id === strategy.id);

    if (isExisting) {
      const { error } = await supabase
        .from("strategies")
        .update(payload as any)
        .eq("id", strategy.id);
      if (error) { toast.error("Errore nel salvataggio"); console.error(error); return; }
    } else {
      const { error } = await supabase
        .from("strategies")
        .insert(payload as any);
      if (error) { toast.error("Errore nella creazione"); console.error(error); return; }
    }
    setIsModalOpen(false);
    fetchStrategies();
  }, [strategies]);

  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from("strategies").delete().eq("id", id);
    if (error) { toast.error("Errore nell'eliminazione"); console.error(error); return; }
    setIsModalOpen(false);
    fetchStrategies();
  }, []);

  const handleCopy = (strategy: Strategy) => {
    navigator.clipboard.writeText(`Cliente: ${strategy.codice_cliente} - ${strategy.nome_cliente}`);
    toast("Copiato negli appunti");
  };

  const handleQuickAction = useCallback(async (strategy: Strategy, newStatus: StrategyStatus) => {
    const payload: Record<string, any> = {
      stato_strategia: newStatus,
    };
    if (newStatus === "Va bene !") {
      payload.data_conferma = new Date().toISOString().split("T")[0];
    }
    const { error } = await supabase
      .from("strategies")
      .update(payload as any)
      .eq("id", strategy.id);
    if (error) {
      toast.error("Errore nell'aggiornamento");
      console.error(error);
      return;
    }
    toast(newStatus === "Archiviata" ? "Strategia archiviata" : "Strategia confermata ✅");
    fetchStrategies();
  }, []);

  const agentFiltered = useMemo(() => {
    if (activeAgent === "Tutti") return strategies;
    if (activeAgent === "Senza agente") return strategies.filter((s) => !s.agente);
    return strategies.filter((s) => s.agente === activeAgent);
  }, [strategies, activeAgent]);

  const tabFiltered = useMemo(() => {
    if (activeTab === "home") return agentFiltered;
    const statuses = TAB_STATUSES[activeTab];
    return agentFiltered.filter((s) => statuses.includes(s.stato_strategia));
  }, [agentFiltered, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-5 space-y-5 max-w-6xl pb-28">
        <AgentFilter strategies={strategies} activeAgent={activeAgent} onChange={setActiveAgent} />

        {activeTab === "home" ? (
          <HomeOverview
            strategies={agentFiltered}
            onNewStrategy={handleCreate}
            onTabChange={(tab) => setActiveTab(tab as AppTab)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between animate-fade-in">
              <div>
                <h2 className="text-xl font-semibold text-foreground tracking-tight">{TAB_LABELS[activeTab]}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {activeTab === "confermata"
                    ? `${tabFiltered.filter(s => s.stato_strategia === "Va bene !").length} confermate · €${tabFiltered.filter(s => s.stato_strategia === "Va bene !").reduce((sum, s) => sum + s.importo_strategia, 0).toLocaleString("it-IT")} da fatturare`
                    : activeTab === "da-realizzare"
                    ? `${tabFiltered.filter(s => s.stato_strategia !== "In pausa").length} attive · ${tabFiltered.filter(s => s.stato_strategia === "In pausa").length} in pausa · €${tabFiltered.filter(s => s.stato_strategia !== "In pausa").reduce((sum, s) => sum + s.importo_strategia, 0).toLocaleString("it-IT")} potenziale`
                    : `${tabFiltered.length} strateg${tabFiltered.length === 1 ? "ia" : "ie"} · €${tabFiltered.reduce((sum, s) => sum + s.importo_strategia, 0).toLocaleString("it-IT")} potenziale`}
                </p>
              </div>
              <Button size="sm" className="gap-1.5 rounded-xl h-9 px-4 shadow-[0_2px_12px_rgba(0,122,255,0.25)] liquid-press" onClick={handleCreate}>
                <Plus className="w-4 h-4" />
                Nuova
              </Button>
            </div>

            {activeTab === "confermata" ? (
              <>
                <StrategyTable
                  strategies={tabFiltered.filter(s => s.stato_strategia === "Va bene !")}
                  activeFilter="Tutte"
                  onEdit={handleEdit}
                  onCreate={handleCreate}
                  onCopy={handleCopy}
                  onQuickAction={handleQuickAction}
                  hideHeader
                />

                {(() => {
                  const archived = tabFiltered.filter(s => s.stato_strategia === "Archiviata");
                  return (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowArchivio(!showArchivio)}
                        className="flex items-center gap-2 w-full px-5 py-3.5 rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/60 transition-all duration-300 liquid-press"
                      >
                        <Archive className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold text-muted-foreground">
                          Archivio ({archived.length})
                        </span>
                        {showArchivio
                          ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" />
                          : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
                      </button>
                      {showArchivio && archived.length > 0 && (
                        <div className="mt-3 opacity-75 animate-fade-in">
                          <StrategyTable
                            strategies={archived}
                            activeFilter="Tutte"
                            onEdit={handleEdit}
                            onCreate={handleCreate}
                            onCopy={handleCopy}
                            hideHeader
                          />
                        </div>
                      )}
                      {showArchivio && archived.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-3 text-center py-6">
                          Nessuna strategia archiviata
                        </p>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : activeTab === "da-realizzare" ? (
              <>
                <StrategyTable
                  strategies={tabFiltered.filter(s => s.stato_strategia !== "In pausa")}
                  activeFilter="Tutte"
                  onEdit={handleEdit}
                  onCreate={handleCreate}
                  onCopy={handleCopy}
                  onQuickAction={handleQuickAction}
                  hideHeader
                />

                {(() => {
                  const paused = tabFiltered.filter(s => s.stato_strategia === "In pausa");
                  return (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowInPausa(!showInPausa)}
                        className="flex items-center gap-2 w-full px-5 py-3.5 rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/60 transition-all duration-300 liquid-press"
                      >
                        <Pause className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold text-muted-foreground">
                          In pausa ({paused.length})
                        </span>
                        {showInPausa
                          ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" />
                          : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
                      </button>
                      {showInPausa && paused.length > 0 && (
                        <div className="mt-3 opacity-75 animate-fade-in">
                          <StrategyTable
                            strategies={paused}
                            activeFilter="Tutte"
                            onEdit={handleEdit}
                            onCreate={handleCreate}
                            onCopy={handleCopy}
                            onQuickAction={handleQuickAction}
                            hideHeader
                          />
                        </div>
                      )}
                      {showInPausa && paused.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-3 text-center py-6">
                          Nessuna strategia in pausa
                        </p>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              <StrategyTable
                strategies={tabFiltered}
                activeFilter="Tutte"
                onEdit={handleEdit}
                onCreate={handleCreate}
                onCopy={handleCopy}
                onQuickAction={handleQuickAction}
                hideHeader
              />
            )}
          </>
        )}
      </main>

      <BottomNav
        active={activeTab}
        onChange={setActiveTab}
        badge={{
          "da-realizzare": agentFiltered.filter((s) =>
            ["Da realizzare", "In pausa"].includes(s.stato_strategia)
          ).length,
        }}
      />

      <StrategyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        strategy={editingStrategy}
        onSave={handleSave}
        onDelete={handleDelete}
        strategies={strategies}
      />
    </div>
  );
};

export default Index;
