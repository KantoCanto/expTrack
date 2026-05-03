import type { ImageSourcePropType } from 'react-native';

import type { Category, Expense } from './types';

export const categories = [
  'Education',
  'Food',
  'Water',
  'Electricity',
  'Gas',
  'Rent',
  'Groceries',
  'Transport',
  'Health',
  'Insurance',
  'Subscriptions',
  'Entertainment',
  'Travel',
  'Taxes',
  'Other',
] as const;

export const categoryIcons: Record<Category, ImageSourcePropType> = {
  Education: require('@/assets/icons/notion.png'),
  Food: require('@/assets/icons/spotify.png'),
  Water: require('@/assets/icons/dropbox.png'),
  Electricity: require('@/assets/icons/openai.png'),
  Gas: require('@/assets/icons/activity.png'),
  Rent: require('@/assets/icons/home.png'),
  Groceries: require('@/assets/icons/wallet.png'),
  Transport: require('@/assets/icons/github.png'),
  Health: require('@/assets/icons/claude.png'),
  Insurance: require('@/assets/icons/adobe.png'),
  Subscriptions: require('@/assets/icons/netflix.png'),
  Entertainment: require('@/assets/icons/canva.png'),
  Travel: require('@/assets/icons/medium.png'),
  Taxes: require('@/assets/icons/figma.png'),
  Other: require('@/assets/icons/logo.png'),
};

export const uncategorizedIcon = require('@/assets/icons/wallet.png');

export const initialExpenses: Expense[] = [
  {
    id: 'seed-1',
    title: 'Netflix',
    amount: 15.49,
    category: 'Subscriptions',
    icon: require('@/assets/icons/netflix.png'),
  },
  {
    id: 'seed-2',
    title: 'Weekly groceries',
    amount: 84.2,
    category: 'Groceries',
    icon: require('@/assets/icons/wallet.png'),
  },
  {
    id: 'seed-3',
    title: 'Coffee',
    amount: 4.8,
    category: null,
    icon: uncategorizedIcon,
  },
];

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
