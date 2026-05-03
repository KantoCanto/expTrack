import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/features/expenses/components/app-header';
import { ExpenseActionsModal } from '@/features/expenses/components/expense-actions-modal';
import { ExpenseList } from '@/features/expenses/components/expense-list';
import { SectionHeader } from '@/features/expenses/components/section-header';
import { styles } from '@/features/expenses/expense-styles';
import { useExpenses } from '@/features/expenses/expenses-context';
import type { Expense } from '@/features/expenses/types';

export default function ExpensesScreen() {
  const router = useRouter();
  const { error, expenses, isLoading, isRemoteSyncEnabled, removeExpense, updateExpenseDate } =
    useExpenses();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  async function handleRemoveExpense(id: string) {
    await removeExpense(id);
    setSelectedExpense(null);
  }

  async function handleUpdateExpenseDate(id: string, date: Date) {
    await updateExpenseDate(id, date);
    setSelectedExpense(null);
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled">
            <AppHeader
              leftAccessibilityLabel="Go back"
              leftIcon={require('@/assets/icons/back.png')}
              onLeftPress={() => router.back()}
              subtitle="Full history"
              title="Expenses"
            />

            <SectionHeader
              title={isRemoteSyncEnabled ? 'Supabase sync' : 'Local mode'}
              meta={error ?? (isLoading ? 'Loading' : isRemoteSyncEnabled ? 'Connected' : 'Demo data')}
            />

            <SectionHeader title="All expenses" meta={`${expenses.length} items`} />
            <ExpenseList
              expenses={expenses}
              groupByDay
              onOpenExpenseActions={setSelectedExpense}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        <ExpenseActionsModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onDeleteExpense={handleRemoveExpense}
          onUpdateDate={handleUpdateExpenseDate}
        />
      </SafeAreaView>
    </View>
  );
}
