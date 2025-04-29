"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/providers/state-provider";
import { formatCurrency, formatTime, getTransactionTypeColor } from "@/lib/utils";
import { CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RecentTransactionsCard() {
  const { transactions } = useAppState();
  
  // Get transactions from today and sort by most recent
  const today = new Date().toDateString();
  const todayTransactions = transactions
    .filter((t) => new Date(t.createdAt).toDateString() === today)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5); // Get only the 5 most recent
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-purple-500" />
          Recent Transactions
        </CardTitle>
        <CardDescription>
          Last {todayTransactions.length} transactions from today
        </CardDescription>
      </CardHeader>
      <CardContent>
        {todayTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions recorded today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  {transaction.amount >= 0 ? (
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(new Date(transaction.createdAt))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getTransactionTypeColor(transaction.type)}>
                    {transaction.type.replace('_', ' ')}
                  </Badge>
                  <span className={`font-medium ${transaction.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/transactions">View All Transactions</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}