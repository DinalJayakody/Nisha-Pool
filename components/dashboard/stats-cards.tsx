"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/providers/state-provider";
import { BarChart3, DollarSign, Timer, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function StatsCards() {
  const { transactions, activeSessions, tables } = useAppState();
  
  // Get transactions from today
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(
    (t) => new Date(t.createdAt).toDateString() === today
  );
  
  // Total revenue today
  const todayRevenue = todayTransactions
    .filter((t) => t.amount > 0)
    .reduce((total, t) => total + t.amount, 0);
  
  // Table usage percentage
  const occupiedTables = tables.filter((t) => t.status === "occupied").length;
  const availableTables = tables.filter((t) => t.status === "available").length;
  const totalUsableTables = occupiedTables + availableTables;
  const tableUsagePercent = totalUsableTables > 0 
    ? Math.round((occupiedTables / totalUsableTables) * 100) 
    : 0;
  
  // Table session count today
  const tableSessionsToday = todayTransactions.filter(
    (t) => t.type === "table_session"
  ).length;
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(todayRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            From {todayTransactions.filter(t => t.amount > 0).length} income transactions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Tables</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupiedTables} / {tables.length}</div>
          <p className="text-xs text-muted-foreground">
            {tableUsagePercent}% utilization rate
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeSessions.length}</div>
          <p className="text-xs text-muted-foreground">
            Ongoing table sessions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Table Sessions</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tableSessionsToday}</div>
          <p className="text-xs text-muted-foreground">
            Completed sessions today
          </p>
        </CardContent>
      </Card>
    </div>
  );
}