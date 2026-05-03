import { useUser } from '@clerk/expo';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

import { isSupabaseConfigured } from '@/lib/supabase';

import { categoryIcons, initialExpenses, uncategorizedIcon } from './expense-data';
import {
  deleteExpense,
  fetchExpenses,
  insertExpense,
  updateExpenseDate as updatePersistedExpenseDate,
} from './expense-repository';
import type { AddExpenseInput, Expense } from './types';

type ExpensesContextValue = {
  addExpense: (expense: AddExpenseInput) => Promise<void>;
  error: string | null;
  expenses: Expense[];
  isLoading: boolean;
  isRemoteSyncEnabled: boolean;
  refreshExpenses: () => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  updateExpenseDate: (id: string, date: Date) => Promise<void>;
};

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: PropsWithChildren) {
  const { user } = useUser();
  const clerkUserId = user?.id ?? null;
  const [expenses, setExpenses] = useState(isSupabaseConfigured ? [] : initialExpenses);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  const refreshExpenses = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    if (!clerkUserId) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const remoteExpenses = await fetchExpenses(clerkUserId);
      setExpenses(remoteExpenses ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [clerkUserId]);

  useEffect(() => {
    void refreshExpenses();
  }, [refreshExpenses]);

  async function addExpense({ title, amount, category }: AddExpenseInput) {
    const localExpense: Expense = {
      id: `${Date.now()}`,
      title,
      amount,
      category,
      icon: category ? categoryIcons[category] : uncategorizedIcon,
      date: new Date(),
    };

    setExpenses((currentExpenses) => [
      localExpense,
      ...currentExpenses,
    ]);

    if (!isSupabaseConfigured) {
      return;
    }

    if (!clerkUserId) {
      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== localExpense.id),
      );
      setError('Sign in again before syncing expenses.');
      return;
    }

    setError(null);

    try {
      const remoteExpense = await insertExpense({ title, amount, category }, clerkUserId);

      if (remoteExpense) {
        setExpenses((currentExpenses) =>
          currentExpenses.map((expense) =>
            expense.id === localExpense.id ? remoteExpense : expense,
          ),
        );
      }
    } catch (requestError) {
      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== localExpense.id),
      );
      setError(getErrorMessage(requestError));
    }
  }

  async function removeExpense(id: string) {
    const previousExpenses = expenses;
    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id));

    if (!isSupabaseConfigured) {
      return;
    }

    if (!clerkUserId) {
      setExpenses(previousExpenses);
      setError('Sign in again before deleting expenses.');
      return;
    }

    setError(null);

    try {
      await deleteExpense(id, clerkUserId);
    } catch (requestError) {
      setExpenses(previousExpenses);
      setError(getErrorMessage(requestError));
    }
  }

  async function updateExpenseDate(id: string, date: Date) {
    const previousExpenses = expenses;
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) => (expense.id === id ? { ...expense, date } : expense)),
    );

    if (!isSupabaseConfigured) {
      return;
    }

    if (!clerkUserId) {
      setExpenses(previousExpenses);
      setError('Sign in again before updating expenses.');
      return;
    }

    setError(null);

    try {
      const remoteExpense = await updatePersistedExpenseDate(id, date, clerkUserId);

      if (remoteExpense) {
        setExpenses((currentExpenses) =>
          currentExpenses.map((expense) => (expense.id === id ? remoteExpense : expense)),
        );
      }
    } catch (requestError) {
      setExpenses(previousExpenses);
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <ExpensesContext.Provider
      value={{
        addExpense,
        error,
        expenses,
        isLoading,
        isRemoteSyncEnabled: isSupabaseConfigured,
        refreshExpenses,
        removeExpense,
        updateExpenseDate,
      }}>
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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to sync expenses.';
}
