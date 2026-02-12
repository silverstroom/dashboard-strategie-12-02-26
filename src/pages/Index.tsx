import { useState, useCallback } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatCards from "@/components/StatCards";
import StatusFilter from "@/components/StatusFilter";
import StrategyTable from "@/components/StrategyTable";
import StrategyModal from "@/components/StrategyModal";
import { initialStrategies, Strategy, StrategyStatus, getImporto } from "@/data/strategies";
import { toast } from "sonner";

const Index = () => {
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies);
  const [activeFilter, setActiveFilter] = useState<StrategyStatus | "Tutte">("Tutte");
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setEditingStrategy(null);
    setIsModalOpen(true);
  };

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setIsModalOpen(true);
  };

  const handleSave = useCallback((strategy: Strategy) => {
    setStrategies((prev) => {
      const idx = prev.findIndex((s) => s.id === strategy.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = strategy;
        return updated;
      }
      return [...prev, strategy];
    });
    setIsModalOpen(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setStrategies((prev) => prev.filter((s) => s.id !== id));
    setIsModalOpen(false);
  }, []);

  const handleCopy = (strategy: Strategy) => {
    navigator.clipboard.writeText(`Cliente: ${strategy.codice_cliente} - ${strategy.nome_cliente}`);
    toast("Copiato negli appunti");
  };

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
