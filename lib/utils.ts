import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
}

// Format time
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
}

// Format date and time
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy h:mm a');
}

// Calculate duration between two dates in minutes
export function calculateDuration(startDate: Date, endDate: Date): number {
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
}

// Format duration in minutes to hours and minutes
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${mins} min`;
  }
}

// Get color for transaction type
export function getTransactionTypeColor(type: string): string {
  switch (type) {
    case 'table_session':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'food':
    case 'beverage':
    case 'merchandise':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'expense':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
}

// Get color for table status
export function getTableStatusColor(status: string): string {
  switch (status) {
    case 'available':
      return 'bg-green-500';
    case 'occupied':
      return 'bg-red-500';
    case 'maintenance':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

// Format table size
export function formatTableSize(size: string): string {
  switch (size) {
    case '7ft':
      return 'Standard (7ft)';
    case '8ft':
      return 'Tournament (8ft)';
    case '9ft':
      return 'Professional (9ft)';
    default:
      return size;
  }
}
