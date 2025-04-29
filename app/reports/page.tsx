import { Header } from "@/components/layout/header";
import { RevenueChart } from "@/components/reports/revenue-chart";
import { TransactionSummary } from "@/components/reports/transaction-summary";
import { DateRangePicker } from "@/components/reports/date-range-picker";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="font-bold text-3xl">Reports</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <DateRangePicker />
            <Button size="icon" variant="outline">
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="sm:ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevenueChart />
          <TransactionSummary />
        </div>
      </main>
      <Toaster />
    </div>
  );
}