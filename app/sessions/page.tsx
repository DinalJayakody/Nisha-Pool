import { Header } from "@/components/layout/header";
import { SessionsTable } from "@/components/sessions/sessions-table";
import { Toaster } from "@/components/ui/toaster";

export default function SessionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="font-bold text-3xl">Table Sessions</h1>
        </div>
        
        <div>
          <SessionsTable />
        </div>
      </main>
      <Toaster />
    </div>
  );
}