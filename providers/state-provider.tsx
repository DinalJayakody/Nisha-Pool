"use client";

import { CashRegister, PoolTable, TableSession, Transaction, User } from "@/lib/types";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as db from "@/lib/db";

interface StateContextType {
  // Data
  cashRegister: CashRegister;
  tables: PoolTable[];
  activeSessions: TableSession[];
  transactions: Transaction[];
  
  // User 
  currentUser: User;
  
  // Table Actions
  startTableSession: (tableId: string) => void;
  endTableSession: (sessionId: string) => void;
  
  // Transaction Actions
  addTransaction: (type: string, amount: number, description: string, tableId?: string) => void;
  createTableSessionTransaction: (sessionId: string) => void;
  
  // Filters
  dateFilter: { startDate: Date; endDate: Date };
  setDateFilter: (filter: { startDate: Date; endDate: Date }) => void;
  
  // Refresh data
  refreshData: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateProvider({ children }: { children: ReactNode }) {
  const [cashRegister, setCashRegister] = useState<CashRegister>(db.getCashRegister());
  const [tables, setTables] = useState<PoolTable[]>(db.getTables());
  const [activeSessions, setActiveSessions] = useState<TableSession[]>(db.getActiveSessions());
  const [transactions, setTransactions] = useState<Transaction[]>(db.getTransactions());
  const [currentUser, setCurrentUser] = useState<User>({ id: "1", name: "Admin User", role: "admin" });
  
  const [dateFilter, setDateFilter] = useState<{ startDate: Date; endDate: Date }>(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7);
    return { startDate, endDate: today };
  });
  
  const refreshData = () => {
    setCashRegister(db.getCashRegister());
    setTables(db.getTables());
    setActiveSessions(db.getActiveSessions());
    setTransactions(db.getTransactions());
  };
  
  const startTableSession = (tableId: string) => {
    db.startTableSession(tableId, currentUser.id);
    refreshData();
  };
  
  const endTableSession = (sessionId: string) => {
    db.endTableSession(sessionId, currentUser.id);
    refreshData();
  };
  
  const addTransaction = (
    type: string, 
    amount: number, 
    description: string, 
    tableId?: string
  ) => {
    db.addTransaction({
      amount,
      type: type as any,
      description,
      tableId,
      createdBy: currentUser.id,
    });
    refreshData();
  };
  
  const createTableSessionTransaction = (sessionId: string) => {
    db.createTableSessionTransaction(sessionId, currentUser.id);
    refreshData();
  };
  
  return (
    <StateContext.Provider
      value={{
        cashRegister,
        tables,
        activeSessions,
        transactions,
        currentUser,
        startTableSession,
        endTableSession,
        addTransaction,
        createTableSessionTransaction,
        dateFilter,
        setDateFilter,
        refreshData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
};