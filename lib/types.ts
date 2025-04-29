// Type definitions for the pool parlour management system

export type TransactionType =
  | 'table_session'
  | 'food'
  | 'beverage'
  | 'merchandise'
  | 'other'
  | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  tableId?: string; // Optional reference to a table if transaction is related to table
  createdAt: Date;
  createdBy: string;
}

export type TableStatus = 'available' | 'occupied' | 'maintenance';

export interface PoolTable {
  id: string;
  name: string;
  status: TableStatus;
  hourlyRate: number;
  size: string; // Common pool table sizes
}

export interface TableSession {
  id: string;
  tableId: string;
  startTime: Date;
  endTime?: Date; // Optional as session might be ongoing
  duration?: number; // in minutes, calculated when session ends
  amount?: number; // calculated when session ends
  paymentStatus: 'pending' | 'paid';
  transactionId?: string; // Reference to transaction when paid
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'staff';
}

export interface CashRegister {
  currentBalance: number;
  dailyTransactions: Transaction[];
  openingBalance: number;
  lastUpdated: Date;
}

export interface DailyReport {
  date: string;
  openingBalance: number;
  closingBalance: number;
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  tableSessionsCount: number;
  tableSessionsRevenue: number;
}
