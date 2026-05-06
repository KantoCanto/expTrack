import { Text, View } from 'react-native';

import { currencyFormatter } from '../expense-data';
import { styles } from '../expense-styles';
import type { Category, Expense } from '../types';

type MonthlyExpenseGraphProps = {
  expenses: Expense[];
};

type MonthlyExpenseTotal = {
  key: string;
  label: string;
  segments: MonthlyExpenseSegment[];
  total: number;
};

type MonthlyExpenseSegment = {
  color: string;
  key: string;
  label: string;
  percentage: number;
  total: number;
};

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: '2-digit',
});

const categoryColors: Record<Category | 'Uncategorized', string> = {
  Education: '#6F4E9A',
  Food: '#C95F1E',
  Water: '#3D7C8A',
  Electricity: '#D6A11D',
  Gas: '#A8502A',
  Rent: '#7B4A2A',
  Groceries: '#5D8A3D',
  Transport: '#4F6F9A',
  Health: '#A84646',
  Insurance: '#8A6A4E',
  Subscriptions: '#9A4F73',
  Entertainment: '#B86A2A',
  Travel: '#2F7A62',
  Taxes: '#5F5A4A',
  Other: '#8F3D12',
  Uncategorized: '#DDB78B',
};

export function MonthlyExpenseGraph({ expenses }: MonthlyExpenseGraphProps) {
  const monthlyTotals = getMonthlyTotals(expenses);
  const maxTotal = Math.max(...monthlyTotals.map((month) => month.total), 0);
  const hasExpenses = monthlyTotals.some((month) => month.total > 0);

  return (
    <View style={styles.graphCard}>
      {hasExpenses ? (
        monthlyTotals.map((month) => {
          const barWidth = maxTotal > 0 ? Math.max((month.total / maxTotal) * 100, 4) : 0;

          return (
            <View key={month.key} style={styles.graphMonthGroup}>
              <View style={styles.graphRow}>
                <Text style={styles.graphMonth}>{month.label}</Text>
                <View style={styles.graphTrack}>
                  <View style={[styles.graphBar, { width: `${barWidth}%` }]}>
                    {month.segments.map((segment) => (
                      <View
                        key={segment.key}
                        style={[
                          styles.graphSegment,
                          {
                            backgroundColor: segment.color,
                            width: `${segment.percentage}%`,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.graphAmount}>{currencyFormatter.format(month.total)}</Text>
              </View>
              <View style={styles.graphBreakdown}>
                {month.segments.map((segment) => (
                  <View key={segment.key} style={styles.graphBreakdownItem}>
                    <View
                      style={[styles.graphBreakdownDot, { backgroundColor: segment.color }]}
                    />
                    <Text style={styles.graphBreakdownText}>
                      {segment.label} {Math.round(segment.percentage)}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.graphEmptyState}>
          <Text style={styles.emptyTitle}>No monthly data yet</Text>
          <Text style={styles.emptyMeta}>Add an expense to start building the graph.</Text>
        </View>
      )}
    </View>
  );
}

function getMonthlyTotals(expenses: Expense[]) {
  const totalsByMonth = new Map<string, number>();
  const categoryTotalsByMonth = new Map<string, Map<Category | 'Uncategorized', number>>();

  for (const expense of expenses) {
    if (!Number.isFinite(expense.amount) || !(expense.date instanceof Date)) {
      continue;
    }

    const time = expense.date.getTime();

    if (!Number.isFinite(time)) {
      continue;
    }

    const key = toMonthKey(expense.date);
    const category = expense.category ?? 'Uncategorized';
    const categoryTotals = categoryTotalsByMonth.get(key) ?? new Map();

    totalsByMonth.set(key, (totalsByMonth.get(key) ?? 0) + expense.amount);
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + expense.amount);
    categoryTotalsByMonth.set(key, categoryTotals);
  }

  return getMonthWindow(totalsByMonth).map<MonthlyExpenseTotal>((date) => {
    const key = toMonthKey(date);
    const total = totalsByMonth.get(key) ?? 0;
    const categoryTotals = categoryTotalsByMonth.get(key) ?? new Map();

    return {
      key,
      label: monthFormatter.format(date),
      segments: getSegments(categoryTotals, total),
      total,
    };
  });
}

function getSegments(categoryTotals: Map<Category | 'Uncategorized', number>, total: number) {
  if (total <= 0) {
    return [];
  }

  return [...categoryTotals.entries()]
    .map<MonthlyExpenseSegment>(([category, categoryTotal]) => ({
      color: categoryColors[category],
      key: category,
      label: category,
      percentage: (categoryTotal / total) * 100,
      total: categoryTotal,
    }))
    .sort((a, b) => b.total - a.total);
}

function getMonthWindow(totalsByMonth: Map<string, number>) {
  const monthKeys = [...totalsByMonth.keys()].sort();
  const endDate = monthKeys.length > 0 ? parseMonthKey(monthKeys[monthKeys.length - 1]) : new Date();
  const months: Date[] = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    months.push(new Date(endDate.getFullYear(), endDate.getMonth() - offset, 1));
  }

  return months;
}

function toMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${year}-${month}`;
}

function parseMonthKey(key: string) {
  const [year, month] = key.split('-').map(Number);

  return new Date(year, month - 1, 1);
}
