// Mock database functionality
// In a real application, this would connect to a proper database

import {
  CashRegister,
  PoolTable,
  TableSession,
  Transaction,
  User,
} from './types';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage
let transactions: Transaction[] = [];
let poolTables: PoolTable[] = [];
let tableSessions: TableSession[] = [];
let users: User[] = [];
let cashRegister: CashRegister = {
  currentBalance: 0, // Starting with $1000
  dailyTransactions: [],
  openingBalance: 0,
  lastUpdated: new Date(),
};

// Initialize with some data
export const initializeDb = () => {
  // Create some tables
  poolTables = [
    {
      id: uuidv4(),
      name: 'Table 1',
      status: 'available',
      hourlyRate: 500,
      size: 'Pool',
    },
    {
      id: uuidv4(),
      name: 'Table 2',
      status: 'available',
      hourlyRate: 500,
      size: 'Pool',
    },
    {
      id: uuidv4(),
      name: 'Table 3',
      status: 'available',
      hourlyRate: 500,
      size: 'Pool',
    },
    {
      id: uuidv4(),
      name: 'Table 4',
      status: 'available',
      hourlyRate: 500,
      size: 'Pool',
    },
    {
      id: uuidv4(),
      name: 'Table 5',
      status: 'available',
      hourlyRate: 600,
      size: 'Snooker',
    },
  ];

  // Create a sample user
  users = [
    { id: uuidv4(), name: 'Admin User', role: 'admin' },
    { id: uuidv4(), name: 'Staff User', role: 'staff' },
  ];

  // Create some sample transactions
  // const today = new Date();
  // const yesterday = new Date(today);
  // yesterday.setDate(yesterday.getDate() - 1);

  // transactions = [
  //   {
  //     id: uuidv4(),
  //     amount: 30,
  //     type: 'table_session',
  //     description: 'Table 1 - 2 hours',
  //     tableId: poolTables[0].id,
  //     createdAt: yesterday,
  //     createdBy: users[0].id,
  //   },
  //   {
  //     id: uuidv4(),
  //     amount: 15,
  //     type: 'food',
  //     description: 'Pizza order',
  //     createdAt: yesterday,
  //     createdBy: users[0].id,
  //   },
  //   {
  //     id: uuidv4(),
  //     amount: -50,
  //     type: 'expense',
  //     description: 'Cleaning supplies',
  //     createdAt: today,
  //     createdBy: users[0].id,
  //   },
  // ];

  // Update cash register
  cashRegister.dailyTransactions = transactions.filter(
    (t) => t.createdAt.toDateString() === today.toDateString()
  );

  cashRegister.currentBalance = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    cashRegister.openingBalance
  );

  cashRegister.lastUpdated = new Date();
};

// Tables API
export const getTables = () => poolTables;
export const getTableById = (id: string) =>
  poolTables.find((table) => table.id === id);
export const updateTableStatus = (
  id: string,
  status: 'available' | 'occupied' | 'maintenance'
) => {
  const tableIndex = poolTables.findIndex((table) => table.id === id);
  if (tableIndex >= 0) {
    poolTables[tableIndex] = { ...poolTables[tableIndex], status };
    return poolTables[tableIndex];
  }
  return null;
};

// Sessions API
export const getActiveSessions = () =>
  tableSessions.filter((session) => !session.endTime);

export const getSessionById = (id: string) =>
  tableSessions.find((session) => session.id === id);

export const startTableSession = (tableId: string, userId: string) => {
  const table = getTableById(tableId);
  if (!table || table.status !== 'available') {
    return null;
  }

  // Update table status
  updateTableStatus(tableId, 'occupied');

  // Create new session
  const newSession: TableSession = {
    id: uuidv4(),
    tableId,
    startTime: new Date(),
    paymentStatus: 'pending',
  };

  tableSessions.push(newSession);
  return newSession;
};

export const endTableSession = (sessionId: string, userId: string) => {
  const sessionIndex = tableSessions.findIndex(
    (session) => session.id === sessionId
  );
  if (sessionIndex < 0) {
    return null;
  }

  const session = tableSessions[sessionIndex];
  const table = getTableById(session.tableId);

  if (!table) {
    return null;
  }

  const endTime = new Date();
  const durationMs = endTime.getTime() - session.startTime.getTime();
  const durationMinutes = Math.ceil(durationMs / (1000 * 60));
  const hours = durationMinutes / 60;
  const roundedHours = Math.ceil(hours * 2) / 2; // Round up to nearest half hour
  const amount = roundedHours * table.hourlyRate;

  const updatedSession = {
    ...session,
    endTime,
    duration: durationMinutes,
    amount,
  };

  tableSessions[sessionIndex] = updatedSession;

  // Update table status
  updateTableStatus(session.tableId, 'available');

  return updatedSession;
};

// Transactions API
export const getTransactions = () => transactions;

export const getTransactionsByDateRange = (startDate: Date, endDate: Date) => {
  return transactions.filter(
    (t) => t.createdAt >= startDate && t.createdAt <= endDate
  );
};

export const addTransaction = (
  transaction: Omit<Transaction, 'id' | 'createdAt'>
) => {
  const newTransaction: Transaction = {
    ...transaction,
    id: uuidv4(),
    createdAt: new Date(),
  };

  transactions.push(newTransaction);

  // Update cash register
  cashRegister.currentBalance += newTransaction.amount;
  if (newTransaction.createdAt.toDateString() === new Date().toDateString()) {
    cashRegister.dailyTransactions.push(newTransaction);
  }
  cashRegister.lastUpdated = new Date();

  return newTransaction;
};

export const createTableSessionTransaction = (
  sessionId: string,
  userId: string
) => {
  const session = getSessionById(sessionId);
  if (!session || !session.endTime || !session.amount) {
    return null;
  }

  const table = getTableById(session.tableId);
  if (!table) {
    return null;
  }

  // Create transaction
  const transaction = addTransaction({
    amount: session.amount,
    type: 'table_session',
    description: `${table.name} session - ${session.duration} minutes`,
    tableId: session.tableId,
    createdBy: userId,
  });

  // Update session with transaction
  const sessionIndex = tableSessions.findIndex((s) => s.id === sessionId);
  if (sessionIndex >= 0) {
    tableSessions[sessionIndex] = {
      ...tableSessions[sessionIndex],
      paymentStatus: 'paid',
      transactionId: transaction.id,
    };
  }

  return transaction;
};

// Cash Register API
export const getCashRegister = () => cashRegister;

export const generateDailyReport = (date: Date) => {
  const dayTransactions = transactions.filter(
    (t) => t.createdAt.toDateString() === date.toDateString()
  );

  const income = dayTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = dayTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const tableSessionsTransactions = dayTransactions.filter(
    (t) => t.type === 'table_session'
  );

  return {
    date: date.toISOString().split('T')[0],
    openingBalance: cashRegister.openingBalance,
    closingBalance: cashRegister.currentBalance,
    totalTransactions: dayTransactions.length,
    totalIncome: income,
    totalExpense: expense,
    tableSessionsCount: tableSessionsTransactions.length,
    tableSessionsRevenue: tableSessionsTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    ),
  };
};

// Initialize the database
initializeDb();
