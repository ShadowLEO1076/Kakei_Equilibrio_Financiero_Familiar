"use client";

import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
  categoryName?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionList({ transactions, isLoading }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        No hay transacciones para mostrar
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-2 rounded-full ${transaction.type === 'income'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
                }`}
            >
              {transaction.type === 'income' ? (
                <ArrowUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDownIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-white">
                {transaction.description}
              </p>
              {transaction.categoryName && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {transaction.categoryName}
                </p>
              )}
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {new Date(transaction.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div
            className={`text-lg font-semibold ${transaction.type === 'income'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
              }`}
          >
            {transaction.type === 'income' ? '+' : '-'}$
            {transaction.amount.toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
        </div>
      ))}
    </div>
  );
}