"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/providers/state-provider";
import { WalletCards as BilliardBall, Clock } from "lucide-react";
import { PoolTable, TableSession } from "@/lib/types";
import { formatTime, calculateDuration, getTableStatusColor } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ActiveTablesCard() {
  const { tables, activeSessions } = useAppState();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const getTableById = (id: string): PoolTable | undefined => {
    return tables.find((table) => table.id === id);
  };
  
  // Get tables that are occupied
  const occupiedTables = tables.filter((table) => table.status === "occupied");
  
  // Get sessions for occupied tables
  const tableSessionMap = new Map<string, TableSession>();
  activeSessions.forEach((session) => {
    tableSessionMap.set(session.tableId, session);
  });
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BilliardBall className="h-5 w-5 text-blue-500" />
          Active Tables
        </CardTitle>
        <CardDescription>
          {occupiedTables.length} tables in use out of {tables.length} total
        </CardDescription>
      </CardHeader>
      <CardContent>
        {occupiedTables.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tables are currently in use</p>
          </div>
        ) : (
          <div className="space-y-4">
            {occupiedTables.map((table) => {
              const session = tableSessionMap.get(table.id);
              if (!session) return null;
              
              const startTime = new Date(session.startTime);
              const elapsedMinutes = calculateDuration(startTime, currentTime);
              const hours = Math.floor(elapsedMinutes / 60);
              const minutes = elapsedMinutes % 60;
              
              // Calculate the current cost
              const elapsedHours = elapsedMinutes / 60;
              const roundedHours = Math.ceil(elapsedHours * 2) / 2; // Round up to nearest half hour
              const currentCost = roundedHours * table.hourlyRate;
              
              return (
                <div
                  key={table.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${getTableStatusColor(table.status)}`} />
                    <div>
                      <h4 className="font-semibold">{table.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        Started at {formatTime(startTime)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {hours > 0 ? `${hours}h ` : ""}{minutes}m
                    </div>
                    <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      LKR {currentCost.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}