import { Image, Pressable, Text, View } from 'react-native';

import { currencyFormatter, expenseDateFormatter } from '../expense-data';
import { styles } from '../expense-styles';
import type { Expense } from '../types';

type ExpenseListProps = {
  expenses: Expense[];
  groupByDay?: boolean;
  onOpenExpenseActions: (expense: Expense) => void;
};

export function ExpenseList({
  expenses,
  groupByDay = false,
  onOpenExpenseActions,
}: ExpenseListProps) {
  const expenseGroups = groupExpensesByDay(expenses);

  return (
    <View style={styles.expenseList}>
      {expenses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No expenses here yet</Text>
          <Text style={styles.emptyMeta}>Add one or switch to another category.</Text>
        </View>
      ) : groupByDay ? (
        expenseGroups.map((group) => (
          <View key={group.key} style={styles.expenseGroup}>
            <View style={styles.expenseGroupHeader}>
              <Text style={styles.expenseGroupTitle}>{group.label}</Text>
              <Text style={styles.expenseGroupMeta}>
                {group.expenses.length} {group.expenses.length === 1 ? 'entry' : 'entries'}
              </Text>
            </View>

            {group.expenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                onOpenExpenseActions={onOpenExpenseActions}
              />
            ))}
          </View>
        ))
      ) : (
        expenses.map((expense) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            onOpenExpenseActions={onOpenExpenseActions}
            showDate
          />
        ))
      )}
    </View>
  );
}

type ExpenseRowProps = {
  expense: Expense;
  onOpenExpenseActions: (expense: Expense) => void;
  showDate?: boolean;
};

function ExpenseRow({ expense, onOpenExpenseActions, showDate = false }: ExpenseRowProps) {
  return (
    <View style={styles.expenseRow}>
      <View style={styles.expenseIconFrame}>
        <Image source={expense.icon} style={styles.expenseIcon} />
      </View>
      <View style={styles.expenseCopy}>
        <Text style={styles.expenseTitle}>{expense.title}</Text>
        <Text style={styles.expenseCategory}>
          {expense.category ?? 'No category'}
          {showDate ? ` · ${expenseDateFormatter.format(expense.date)}` : ''}
        </Text>
      </View>
      <Text style={styles.expenseAmount}>{currencyFormatter.format(expense.amount)}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open actions for ${expense.title}`}
        onPress={() => onOpenExpenseActions(expense)}
        style={({ pressed }) => [styles.rowMenuButton, pressed && styles.pressed]}>
        <Text style={styles.rowMenuButtonText}>...</Text>
      </Pressable>
    </View>
  );
}

type ExpenseGroup = {
  key: string;
  label: string;
  expenses: Expense[];
};

function groupExpensesByDay(expenses: Expense[]) {
  return expenses.reduce<ExpenseGroup[]>((groups, expense) => {
    const key = toDayKey(expense.date);
    const existingGroup = groups.find((group) => group.key === key);

    if (existingGroup) {
      existingGroup.expenses.push(expense);
      return groups;
    }

    groups.push({
      key,
      label: expenseDateFormatter.format(expense.date),
      expenses: [expense],
    });

    return groups;
  }, []);
}

function toDayKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}
