"use client";

import { useAppState } from "@/providers/state-provider";
import { DataTable } from "@/components/ui/data-table";
import { Transaction } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime, getTransactionTypeColor } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function TransactionsTable() {
  const { transactions } = useAppState();

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "createdAt",
      header: "Date & Time",
      cell: ({ row }) => formatDateTime(row.original.createdAt),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.description}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className={getTransactionTypeColor(row.original.type)}>
          {row.original.type.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.original.amount;
        const isPositive = amount >= 0;
        
        return (
          <div className="flex items-center">
            {isPositive ? (
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className={isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
              {formatCurrency(amount)}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="border-y">
      <DataTable
        columns={columns}
        data={sortedTransactions}
        searchKey="description"
        searchPlaceholder="Search transactions..."
      />
    </div>
  );
}