import type { ImageSourcePropType } from 'react-native';

import { categories } from './expense-data';

export type Category = (typeof categories)[number];

export type ExpenseFilter = Category | 'All' | 'Uncategorized';

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category | null;
  icon: ImageSourcePropType;
  date: Date;
};

export type AddExpenseInput = {
  amount: number;
  category: Category | null;
  title: string;
};
