import { CashRegisterCard } from "@/components/dashboard/cash-register-card";
import { ActiveTablesCard } from "@/components/dashboard/active-tables-card";
import { RecentTransactionsCard } from "@/components/dashboard/recent-transactions-card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <h1 className="font-bold text-3xl">Dashboard</h1>
        
        <StatsCards />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CashRegisterCard />
          <ActiveTablesCard />
          <RecentTransactionsCard />
        </div>
      </main>
      <Toaster />
    </div>
  );
}