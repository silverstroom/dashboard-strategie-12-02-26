import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatCards from "@/components/StatCards";
import StatusFilter from "@/components/StatusFilter";
import StrategyTable from "@/components/StrategyTable";
import { strategies, StrategyStatus } from "@/data/strategies";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<StrategyStatus | "Tutte">("Tutte");

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <StatCards />
        <StatusFilter active={activeFilter} onChange={setActiveFilter} />
        <StrategyTable strategies={strategies} activeFilter={activeFilter} />
      </main>
    </div>
  );
};

export default Index;
