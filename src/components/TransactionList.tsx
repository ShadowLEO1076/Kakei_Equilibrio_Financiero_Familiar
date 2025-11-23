// src/components/TransactionList.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// Datos de ejemplo (luego vendrán de la API)
const transactions = [
  {
    id: 1,
    title: "Salario Enero",
    category: "Salario",
    amount: 1200.00,
    type: "income",
  },
  {
    id: 2,
    title: "Supermercado Mi Comisariato",
    category: "Alimentación",
    amount: -85.50,
    type: "expense",
  },
  {
    id: 3,
    title: "Gasolina",
    category: "Transporte",
    amount: -45.00,
    type: "expense",
  },
];

export default function TransactionList() {
  return (
    // La misma tarjeta base "Apple-like" que ya conoces
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Transacciones Recientes
      </h3>

      <div className="mt-4 flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-slate-800">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-2 ${
                    tx.type === "income" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-rose-100 dark:bg-rose-900"
                  }`}>
                  {tx.type === "income" ? (
                    <ArrowUpRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{tx.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{tx.category}</p>
                </div>
              </div>
              <span className={`font-medium ${
                  tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                }`}>
                {tx.type === "income" ? "+" : ""}${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}