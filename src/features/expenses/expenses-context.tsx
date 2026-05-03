import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { categoryIcons, initialExpenses, uncategorizedIcon } from './expense-data';
import type { Category, Expense } from './types';

type AddExpenseInput = {
  amount: number;
  category: Category | null;
  title: string;
};

type ExpensesContextValue = {
  addExpense: (expense: AddExpenseInput) => void;
  expenses: Expense[];
  removeExpense: (id: string) => void;
  updateExpenseDate: (id: string, date: Date) => void;
};

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: PropsWithChildren) {
  const [expenses, setExpenses] = useState(initialExpenses);

  function addExpense({ title, amount, category }: AddExpenseInput) {
    setExpenses((currentExpenses) => [
      {
        id: `${Date.now()}`,
        title,
        amount,
        category,
        icon: category ? categoryIcons[category] : uncategorizedIcon,
        date: new Date(),
      },
      ...currentExpenses,
    ]);
  }

  function removeExpense(id: string) {
    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id));
  }

  function updateExpenseDate(id: string, date: Date) {
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) => (expense.id === id ? { ...expense, date } : expense)),
    );
  }

  return (
    <ExpensesContext.Provider value={{ addExpense, expenses, removeExpense, updateExpenseDate }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);

  if (!context) {
    throw new Error('useExpenses must be used within ExpensesProvider');
  }

  return context;
}
