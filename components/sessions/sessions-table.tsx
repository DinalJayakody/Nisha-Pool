"use client";

import { useAppState } from "@/providers/state-provider";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PoolTable, TableSession } from "@/lib/types";
import { formatCurrency, formatDateTime, formatDuration } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Clock, Ban, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function SessionsTable() {
  const { tableSessions, tables, endTableSession, createTableSessionTransaction } = useAppState();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Mock table sessions data for now
  const [sessions, setSessions] = useState<TableSession[]>([
    {
      id: "1",
      tableId: "1",
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      paymentStatus: "pending",
    },
    {
      id: "2",
      tableId: "2",
      startTime: new Date(Date.now() - 7200000), // 2 hours ago
      endTime: new Date(Date.now() - 3600000), // 1 hour ago
      duration: 60,
      amount: 15,
      paymentStatus: "paid",
      transactionId: "123",
    },
  ]);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Find table by id
  const getTableById = (id: string): PoolTable | undefined => {
    return tables.find((table) => table.id === id);
  };
  
  const handleEndSession = (sessionId: string) => {
    endTableSession(sessionId);
    createTableSessionTransaction(sessionId);
  };
  
  const columns: ColumnDef<TableSession>[] = [
    {
      accessorKey: "tableId",
      header: "Table",
      cell: ({ row }) => {
        const table = getTableById(row.original.tableId);
        return table ? table.name : "Unknown Table";
      },
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
      cell: ({ row }) => formatDateTime(row.original.startTime),
    },
    {
      accessorKey: "endTime",
      header: "End Time",
      cell: ({ row }) => {
        if (row.original.endTime) {
          return formatDateTime(row.original.endTime);
        }
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <Clock className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        if (row.original.duration) {
          return formatDuration(row.original.duration);
        }
        
        // Calculate ongoing duration
        const startTime = new Date(row.original.startTime);
        const durationMinutes = Math.round((currentTime.getTime() - startTime.getTime()) / (1000 * 60));
        return formatDuration(durationMinutes);
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        if (row.original.amount) {
          return formatCurrency(row.original.amount);
        }
        
        // Calculate estimated amount
        const table = getTableById(row.original.tableId);
        if (!table) return "N/A";
        
        const startTime = new Date(row.original.startTime);
        const elapsedMinutes = Math.round((currentTime.getTime() - startTime.getTime()) / (1000 * 60));
        const elapsedHours = elapsedMinutes / 60;
        const roundedHours = Math.ceil(elapsedHours * 2) / 2; // Round up to nearest half hour
        const estimatedCost = roundedHours * table.hourlyRate;
        
        return (
          <span className="text-muted-foreground">
            Est. {formatCurrency(estimatedCost)}
          </span>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.paymentStatus;
        
        if (status === "paid") {
          return (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <CheckCircle className="mr-1 h-3 w-3" />
              Paid
            </Badge>
          );
        }
        
        if (row.original.endTime) {
          return (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
              Pending Payment
            </Badge>
          );
        }
        
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            In Progress
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const session = row.original;
        const isActive = !session.endTime;
        
        if (isActive) {
          return (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => handleEndSession(session.id)}
            >
              End Session
            </Button>
          );
        }
        
        if (session.paymentStatus === "pending") {
          return (
            <Button 
              size="sm"
              onClick={() => createTableSessionTransaction(session.id)}
            >
              Record Payment
            </Button>
          );
        }
        
        return (
          <Button size="sm" variant="outline" disabled>
            <Ban className="mr-1 h-3 w-3" />
            No Actions
          </Button>
        );
      },
    },
  ];
  
  return (
    <div className="border-y">
      <DataTable
        columns={columns}
        data={sessions}
      />
    </div>
  );
}