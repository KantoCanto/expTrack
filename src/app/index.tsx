import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/features/expenses/components/app-header';
import { CategoryPickerModal } from '@/features/expenses/components/category-picker-modal';
import { ExpenseForm } from '@/features/expenses/components/expense-form';
import { ExpenseList } from '@/features/expenses/components/expense-list';
import { FilterChips } from '@/features/expenses/components/filter-chips';
import { SectionHeader } from '@/features/expenses/components/section-header';
import { SpendingHero } from '@/features/expenses/components/spending-hero';
import {
  categories,
  categoryIcons,
  initialExpenses,
  uncategorizedIcon,
} from '@/features/expenses/expense-data';
import { styles } from '@/features/expenses/expense-styles';
import type { Category, ExpenseFilter } from '@/features/expenses/types';

export default function HomeScreen() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [activeFilter, setActiveFilter] = useState<ExpenseFilter>('All');
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  const filterOptions: ExpenseFilter[] = ['All', 'Uncategorized', ...categories];

  const filteredExpenses = useMemo(() => {
    if (activeFilter === 'All') {
      return expenses;
    }

    if (activeFilter === 'Uncategorized') {
      return expenses.filter((expense) => expense.category === null);
    }

    return expenses.filter((expense) => expense.category === activeFilter);
  }, [activeFilter, expenses]);

  const total = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [filteredExpenses],
  );

  function addExpense() {
    const trimmedTitle = title.trim();
    const parsedAmount = Number(amount.replace(',', '.'));

    if (!trimmedTitle) {
      Alert.alert('Missing description', 'Add a short name for this expense.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter a number greater than zero.');
      return;
    }

    setExpenses((currentExpenses) => [
      {
        id: `${Date.now()}`,
        title: trimmedTitle,
        amount: parsedAmount,
        category,
        icon: category ? categoryIcons[category] : uncategorizedIcon,
      },
      ...currentExpenses,
    ]);
    setTitle('');
    setAmount('');
    setCategory(null);
  }

  function removeExpense(id: string) {
    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id));
  }

  function selectCategory(nextCategory: Category | null) {
    setCategory(nextCategory);
    setCategoryPickerOpen(false);
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
            <AppHeader />

            <SpendingHero
              activeFilter={activeFilter}
              expenseCount={filteredExpenses.length}
              total={total}
            />

            <ExpenseForm
              amount={amount}
              category={category}
              onAddExpense={addExpense}
              onAmountChange={setAmount}
              onOpenCategoryPicker={() => setCategoryPickerOpen(true)}
              onTitleChange={setTitle}
              title={title}
            />

            <SectionHeader title="Categories" meta={`${filterOptions.length} filters`} />
            <FilterChips
              activeFilter={activeFilter}
              filters={filterOptions}
              onChangeFilter={setActiveFilter}
            />

            <SectionHeader title="Recent expenses" meta={`${filteredExpenses.length} items`} />
            <ExpenseList expenses={filteredExpenses} onRemoveExpense={removeExpense} />
          </ScrollView>
        </KeyboardAvoidingView>

        <CategoryPickerModal
          selectedCategory={category}
          onClose={() => setCategoryPickerOpen(false)}
          onSelectCategory={selectCategory}
          visible={categoryPickerOpen}
        />
      </SafeAreaView>
    </View>
  );
}
