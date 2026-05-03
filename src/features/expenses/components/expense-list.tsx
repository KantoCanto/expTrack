import { Image, Pressable, Text, View } from 'react-native';

import { currencyFormatter } from '../expense-data';
import { styles } from '../expense-styles';
import type { Expense } from '../types';

type ExpenseListProps = {
  expenses: Expense[];
  onRemoveExpense: (id: string) => void;
};

export function ExpenseList({ expenses, onRemoveExpense }: ExpenseListProps) {
  return (
    <View style={styles.expenseList}>
      {expenses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No expenses here yet</Text>
          <Text style={styles.emptyMeta}>Add one or switch to another category.</Text>
        </View>
      ) : (
        expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseRow}>
            <View style={styles.expenseIconFrame}>
              <Image source={expense.icon} style={styles.expenseIcon} />
            </View>
            <View style={styles.expenseCopy}>
              <Text style={styles.expenseTitle}>{expense.title}</Text>
              <Text style={styles.expenseCategory}>{expense.category ?? 'No category'}</Text>
            </View>
            <Text style={styles.expenseAmount}>{currencyFormatter.format(expense.amount)}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${expense.title}`}
              onPress={() => onRemoveExpense(expense.id)}
              style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}>
              <Text style={styles.removeButtonText}>x</Text>
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}
