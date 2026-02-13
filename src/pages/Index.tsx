import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import StatCards from "@/components/StatCards";
import StatusFilter from "@/components/StatusFilter";
import StrategyTable from "@/components/StrategyTable";
import StrategyModal from "@/components/StrategyModal";
import { Strategy, StrategyStatus, getImporto } from "@/data/strategies";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [activeFilter, setActiveFilter] = useState<StrategyStatus | "Tutte">("Da realizzare");
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

    // If "Ricordami" was not checked, sign out on tab close
    const handleBeforeUnload = () => {
      if (sessionStorage.getItem("temp_session") === "true") {
        supabase.auth.signOut();
        sessionStorage.removeItem("temp_session");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);

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

    // Check if it's an existing strategy (UUID format)
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
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        <StatCards strategies={strategies} />
        <StatusFilter strategies={strategies} active={activeFilter} onChange={setActiveFilter} />
        <StrategyTable
          strategies={strategies}
          activeFilter={activeFilter}
          onEdit={handleEdit}
          onCreate={handleCreate}
          onCopy={handleCopy}
        />
      </main>
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
