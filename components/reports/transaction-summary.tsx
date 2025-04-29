"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/providers/state-provider";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useMemo } from "react";

export function TransactionSummary() {
  const { transactions, dateFilter } = useAppState();
  
  // Process the transaction data for the chart
  const chartData = useMemo(() => {
    // Filter transactions by date range and only include income
    const filteredTransactions = transactions.filter((t) => {
      const date = new Date(t.createdAt);
      return date >= dateFilter.startDate && date <= dateFilter.endDate && t.amount > 0;
    });
    
    // Group transactions by type
    const dataByType = new Map();
    
    filteredTransactions.forEach((transaction) => {
      const type = transaction.type;
      
      if (!dataByType.has(type)) {
        dataByType.set(type, {
          name: type.replace('_', ' '),
          value: 0,
        });
      }
      
      const entry = dataByType.get(type);
      entry.value += transaction.amount;
    });
    
    // Convert to array
    return Array.from(dataByType.values());
  }, [transactions, dateFilter]);
  
  // Calculate total income
  const totalIncome = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);
  
  // Chart colors
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalIncome) * 100).toFixed(1);
      
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium capitalize">{data.name}</p>
          <p className="text-primary">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>
          Transaction categories for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No transaction data available for the selected period
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-3">
          {chartData.map((entry, index) => {
            const percentage = ((entry.value / totalIncome) * 100).toFixed(1);
            
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="capitalize">{entry.name}</span>
                </div>
                <div className="font-medium">
                  {formatCurrency(entry.value)} ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}