"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/providers/state-provider";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

export function CashRegisterCard() {
  const { cashRegister, transactions } = useAppState();
  
  // Calculate today's transactions
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(
    (t) => new Date(t.createdAt).toDateString() === today
  );
  
  const todayIncome = todayTransactions
    .filter((t) => t.amount > 0)
    .reduce((total, t) => total + t.amount, 0);
    
  const todayExpenses = todayTransactions
    .filter((t) => t.amount < 0)
    .reduce((total, t) => total + Math.abs(t.amount), 0);
  
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-500" />
          Cash Register
        </CardTitle>
        <CardDescription>
          Last updated: {formatDateTime(cashRegister.lastUpdated)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Current Balance</span>
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(cashRegister.currentBalance)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Today's Income</span>
              <div className="flex items-center">
                <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(todayIncome)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Today's Expenses</span>
              <div className="flex items-center">
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(todayExpenses)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <span className="text-muted-foreground text-sm">Today's Transactions</span>
            <span className="block text-lg font-semibold">{todayTransactions.length} transactions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}