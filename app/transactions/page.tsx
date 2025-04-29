import { Header } from "@/components/layout/header";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Toaster } from "@/components/ui/toaster";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="font-bold text-3xl">Transactions</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionsTable />
          </div>
          <div>
            <TransactionForm />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}