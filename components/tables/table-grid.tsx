"use client";

import { useAppState } from "@/providers/state-provider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PoolTable, TableSession } from "@/lib/types";
import { formatCurrency, formatTime, getTableStatusColor, formatDuration, calculateDuration, formatTableSize } from "@/lib/utils";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialog } from "@/components/ui/alert-dialog";
import { Play, Timer, AlertCircle, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export function TableGrid() {
  const { tables, activeSessions, startTableSession, endTableSession, createTableSessionTransaction } = useAppState();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Group tables into rows
  const tableRows: PoolTable[][] = [];
  const rowSize = 3; // 3 tables per row
  
  for (let i = 0; i < tables.length; i += rowSize) {
    tableRows.push(tables.slice(i, i + rowSize));
  }
  
  // Map of table ID to active session
  const tableSessionMap = new Map<string, TableSession>();
  activeSessions.forEach((session) => {
    tableSessionMap.set(session.tableId, session);
  });
  
  const handleStartSession = (tableId: string) => {
    startTableSession(tableId);
    toast({
      title: "Session started",
      description: "Table session has been started successfully",
    });
  };
  
  const handleEndSession = (sessionId: string) => {
    endTableSession(sessionId);
    // Let's automatically create the transaction for the table session
    createTableSessionTransaction(sessionId);
    toast({
      title: "Session ended",
      description: "Table session has been ended and payment recorded",
    });
  };
  
  return (
    <div className="space-y-6">
      {tableRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {row.map((table) => {
            const session = tableSessionMap.get(table.id);
            
            let sessionInfo = null;
            let currentCost = 0;
            
            if (session) {
              const startTime = new Date(session.startTime);
              const elapsedMinutes = calculateDuration(startTime, currentTime);
              const elapsedHours = elapsedMinutes / 60;
              const roundedHours = Math.ceil(elapsedHours * 2) / 2; // Round up to nearest half hour
              currentCost = roundedHours * table.hourlyRate;
              
              sessionInfo = (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Start time:</span>
                    <span className="font-medium">{formatTime(startTime)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="font-medium">{formatDuration(elapsedMinutes)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Current cost:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(currentCost)}
                    </span>
                  </div>
                </div>
              );
            }
            
            return (
              <Card key={table.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className={`h-2 ${getTableStatusColor(table.status)}`} />
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">{table.name}</h3>
                    <div 
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        table.status === 'available' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : table.status === 'occupied' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                      }`}
                    >
                      {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Table size:</span>
                      <span>{formatTableSize(table.size)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Hourly rate:</span>
                      <span>{formatCurrency(table.hourlyRate)}</span>
                    </div>
                    
                    {sessionInfo}
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/50 px-4 py-3">
                  {table.status === 'available' ? (
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartSession(table.id)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Session
                    </Button>
                  ) : table.status === 'occupied' && session ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          variant="destructive"
                        >
                          <Timer className="mr-2 h-4 w-4" />
                          End Session
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>End Table Session</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will end the current session and charge {formatCurrency(currentCost)} for {table.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleEndSession(session.id)}>
                            End Session
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      disabled
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Under Maintenance
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ))}
    </div>
  );
}