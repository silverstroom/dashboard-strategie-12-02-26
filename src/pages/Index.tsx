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
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Which statuses belong to each tab
const TAB_STATUSES: Record<AppTab, StrategyStatus[]> = {
  "home": [],
  "da-realizzare": ["Da realizzare", "In attesa/corretta", "In pausa"],
  "ready-to": ["Pronta per la presentazione"],
  "in-approvazione": ["Presentata"],
  "confermata": ["Va bene !"],
};

const TAB_LABELS: Record<AppTab, string> = {
  "home": "Panoramica",
  "da-realizzare": "Da Realizzare",
  "ready-to": "Ready to Present",
  "in-approvazione": "In Revisione dal Cliente",
  "confermata": "Confermata",
};

const Index = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [activeAgent, setActiveAgent] = useState<string>("Tutti");
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth and load data
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

  // Auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Realtime subscription
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
    const payload = {
      codice_cliente: strategy.codice_cliente,
      nome_cliente: strategy.nome_cliente,
      tipo_strategia: strategy.tipo_strategia,
      stato_strategia: strategy.stato_strategia,
      importo_strategia: strategy.importo_strategia,
      aggiunta_il: strategy.aggiunta_il,
      data_conferma: strategy.data_conferma,
      agente: strategy.agente,
    };

    const isExisting = strategies.some((s) => s.id === strategy.id);

    if (isExisting) {
      const { error } = await supabase
        .from("strategies")
        .update(payload)
        .eq("id", strategy.id);
      if (error) { toast.error("Errore nel salvataggio"); console.error(error); return; }
    } else {
      const { error } = await supabase
        .from("strategies")
        .insert(payload);
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

  // Filter by agent
  const agentFiltered = useMemo(() => {
    if (activeAgent === "Tutti") return strategies;
    if (activeAgent === "Senza agente") return strategies.filter((s) => !s.agente);
    return strategies.filter((s) => s.agente === activeAgent);
  }, [strategies, activeAgent]);

  // Filter by tab statuses
  const tabFiltered = useMemo(() => {
    if (activeTab === "home") return agentFiltered;
    const statuses = TAB_STATUSES[activeTab];
    return agentFiltered.filter((s) => statuses.includes(s.stato_strategia));
  }, [agentFiltered, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-5 space-y-5 max-w-6xl pb-24">
        {/* Agent filter always visible */}
        <AgentFilter strategies={strategies} activeAgent={activeAgent} onChange={setActiveAgent} />

        {activeTab === "home" ? (
          /* ---- HOME: panoramica con grafici ---- */
          <HomeOverview
            strategies={agentFiltered}
            onNewStrategy={handleCreate}
            onTabChange={(tab) => setActiveTab(tab as AppTab)}
          />
        ) : (
          /* ---- ALTRE TAB: tabella filtrata ---- */
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">{TAB_LABELS[activeTab]}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tabFiltered.length} strateg{tabFiltered.length === 1 ? "ia" : "ie"}
                </p>
              </div>
              <Button size="sm" className="gap-1.5" onClick={handleCreate}>
                <Plus className="w-4 h-4" />
                Nuova
              </Button>
            </div>
            <StrategyTable
              strategies={tabFiltered}
              activeFilter="Tutte"
              onEdit={handleEdit}
              onCreate={handleCreate}
              onCopy={handleCopy}
              hideHeader
            />
          </>
        )}
      </main>

      <BottomNav
        active={activeTab}
        onChange={setActiveTab}
        badge={{
          "da-realizzare": agentFiltered.filter((s) =>
            ["Da realizzare", "In attesa/corretta", "In pausa"].includes(s.stato_strategia)
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
