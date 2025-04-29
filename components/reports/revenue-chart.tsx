"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/providers/state-provider";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo } from "react";

export function RevenueChart() {
  const { transactions, dateFilter } = useAppState();
  
  // Process the transaction data for the chart
  const chartData = useMemo(() => {
    // Filter transactions by date range
    const filteredTransactions = transactions.filter((t) => {
      const date = new Date(t.createdAt);
      return date >= dateFilter.startDate && date <= dateFilter.endDate;
    });
    
    // Group transactions by date
    const dataByDate = new Map();
    
    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toISOString().split('T')[0];
      
      if (!dataByDate.has(date)) {
        dataByDate.set(date, {
          date,
          income: 0,
          expense: 0,
          tableRevenue: 0,
          foodRevenue: 0,
          otherRevenue: 0,
        });
      }
      
      const entry = dataByDate.get(date);
      
      if (transaction.amount > 0) {
        entry.income += transaction.amount;
        
        // Categorize income
        if (transaction.type === 'table_session') {
          entry.tableRevenue += transaction.amount;
        } else if (transaction.type === 'food' || transaction.type === 'beverage') {
          entry.foodRevenue += transaction.amount;
        } else {
          entry.otherRevenue += transaction.amount;
        }
      } else {
        entry.expense += Math.abs(transaction.amount);
      }
    });
    
    // Convert to array and sort by date
    return Array.from(dataByDate.values())
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, dateFilter]);
  
  // Calculate totals
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => {
        acc.income += item.income;
        acc.expense += item.expense;
        acc.tableRevenue += item.tableRevenue;
        acc.foodRevenue += item.foodRevenue;
        acc.otherRevenue += item.otherRevenue;
        return acc;
      },
      {
        income: 0,
        expense: 0,
        tableRevenue: 0,
        foodRevenue: 0,
        otherRevenue: 0,
      }
    );
  }, [chartData]);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-emerald-600 dark:text-emerald-400">
            Income: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-red-600 dark:text-red-400">
            Expense: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Income vs. Expenses for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Income</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totals.income)}
            </div>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Table Revenue</div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totals.tableRevenue)}
            </div>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Food & Beverage</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(totals.foodRevenue)}
            </div>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Expenses</div>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totals.expense)}
            </div>
          </div>
        </div>
        
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-xs text-muted-foreground" 
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                className="text-xs text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="expense" 
                name="Expense" 
                fill="hsl(var(--chart-3))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}