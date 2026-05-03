import { isSupabaseConfigured, supabase } from '@/lib/supabase';

import { categoryIcons, uncategorizedIcon } from './expense-data';
import type { AddExpenseInput, Category, Expense } from './types';

type ExpenseRow = {
  id: string;
  title: string;
  amount: number | string;
  category: string | null;
  spent_on: string;
};

type ExpenseInsert = {
  title: string;
  amount: number;
  category: Category | null;
  spent_on: string;
};

export async function fetchExpenses() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('id, title, amount, category, spent_on')
    .order('spent_on', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapExpenseRow);
}

export async function insertExpense(input: AddExpenseInput) {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const payload: ExpenseInsert = {
    ...input,
    spent_on: toDateColumnValue(new Date()),
  };

  const { data, error } = await supabase
    .from('expenses')
    .insert(payload)
    .select('id, title, amount, category, spent_on')
    .single();

  if (error) {
    throw error;
  }

  return mapExpenseRow(data);
}

export async function deleteExpense(id: string) {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const { error } = await supabase.from('expenses').delete().eq('id', id);

  if (error) {
    throw error;
  }
}

export async function updateExpenseDate(id: string, date: Date) {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('expenses')
    .update({ spent_on: toDateColumnValue(date) })
    .eq('id', id)
    .select('id, title, amount, category, spent_on')
    .single();

  if (error) {
    throw error;
  }

  return mapExpenseRow(data);
}

function mapExpenseRow(row: ExpenseRow): Expense {
  const category = getKnownCategory(row.category);

  return {
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    category,
    icon: category ? categoryIcons[category] : uncategorizedIcon,
    date: parseDateColumnValue(row.spent_on),
  };
}

function getKnownCategory(category: string | null): Category | null {
  if (!category || !(category in categoryIcons)) {
    return null;
  }

  return category as Category;
}

function toDateColumnValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateColumnValue(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}
