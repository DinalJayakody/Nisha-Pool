import { Header } from "@/components/layout/header";
import { TableGrid } from "@/components/tables/table-grid";
import { Toaster } from "@/components/ui/toaster";

export default function TablesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="font-bold text-3xl">Pool Tables</h1>
        </div>
        
        <div>
          <TableGrid />
        </div>
      </main>
      <Toaster />
    </div>
  );
}