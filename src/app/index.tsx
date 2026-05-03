import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Category = (typeof categories)[number];

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category | null;
  createdAt: Date;
};

const categories = [
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

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const initialExpenses: Expense[] = [
  {
    id: 'seed-1',
    title: 'Weekly groceries',
    amount: 84.2,
    category: 'Groceries',
    createdAt: new Date(),
  },
  {
    id: 'seed-2',
    title: 'Coffee',
    amount: 4.8,
    category: null,
    createdAt: new Date(),
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category | 'All' | 'Uncategorized'>('All');
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

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
        createdAt: new Date(),
      },
      ...currentExpenses,
    ]);
    setTitle('');
    setAmount('');
    setCategory(null);
  }

  const filterOptions: (Category | 'All' | 'Uncategorized')[] = [
    'All',
    'Uncategorized',
    ...categories,
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <View style={[styles.iconFrame, { backgroundColor: theme.backgroundElement }]}>
                <Image source={require('@/assets/icons/wallet.png')} style={styles.headerIcon} />
              </View>
              <View style={styles.headerText}>
                <ThemedText type="title" style={styles.title}>
                  Expenses
                </ThemedText>
                <ThemedText themeColor="textSecondary">
                  Add spending now. Categories stay optional.
                </ThemedText>
              </View>
            </View>

            <View style={[styles.summaryPanel, { backgroundColor: theme.text }]}>
              <ThemedText style={[styles.summaryLabel, { color: theme.background }]}>
                {activeFilter === 'All' ? 'Total tracked' : `${activeFilter} total`}
              </ThemedText>
              <ThemedText style={[styles.summaryValue, { color: theme.background }]}>
                {currencyFormatter.format(total)}
              </ThemedText>
              <ThemedText style={[styles.summaryMeta, { color: theme.background }]}>
                {filteredExpenses.length}{' '}
                {filteredExpenses.length === 1 ? 'expense' : 'expenses'} shown
              </ThemedText>
            </View>

            <View style={[styles.formPanel, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Add expense
              </ThemedText>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Description"
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                  },
                ]}
              />

              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="Amount"
                placeholderTextColor={theme.textSecondary}
                keyboardType="decimal-pad"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                  },
                ]}
              />

              <Pressable
                onPress={() => setCategoryPickerOpen(true)}
                style={({ pressed }) => [
                  styles.categorySelector,
                  {
                    backgroundColor: theme.background,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}>
                <View>
                  <ThemedText type="small" themeColor="textSecondary">
                    Category
                  </ThemedText>
                  <ThemedText>{category ?? 'No category'}</ThemedText>
                </View>
                <ThemedText type="smallBold">Change</ThemedText>
              </Pressable>

              <Pressable
                onPress={addExpense}
                style={({ pressed }) => [
                  styles.addButton,
                  {
                    backgroundColor: theme.text,
                    opacity: pressed ? 0.82 : 1,
                  },
                ]}>
                <Image
                  source={require('@/assets/icons/add.png')}
                  style={[styles.addIcon, { tintColor: theme.background }]}
                />
                <ThemedText type="smallBold" style={{ color: theme.background }}>
                  Add expense
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Filters
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Choose one
              </ThemedText>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}>
              {filterOptions.map((filter) => {
                const selected = activeFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setActiveFilter(filter)}
                    style={({ pressed }) => [
                      styles.filterChip,
                      {
                        backgroundColor: selected ? theme.text : theme.backgroundElement,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: selected ? theme.background : theme.text }}>
                      {filter}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Recent expenses
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {filteredExpenses.length} shown
              </ThemedText>
            </View>

            <View style={styles.expenseList}>
              {filteredExpenses.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="smallBold">No expenses here yet</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
                    Add one or change the active filter.
                  </ThemedText>
                </View>
              ) : (
                filteredExpenses.map((expense) => (
                  <View
                    key={expense.id}
                    style={[styles.expenseRow, { backgroundColor: theme.backgroundElement }]}>
                    <View style={styles.expenseMain}>
                      <ThemedText type="smallBold">{expense.title}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {expense.category ?? 'No category'}
                      </ThemedText>
                    </View>
                    <ThemedText type="smallBold">
                      {currencyFormatter.format(expense.amount)}
                    </ThemedText>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal
          animationType="fade"
          transparent
          visible={categoryPickerOpen}
          onRequestClose={() => setCategoryPickerOpen(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setCategoryPickerOpen(false)}>
            <Pressable
              style={[styles.modalPanel, { backgroundColor: theme.background }]}
              onPress={(event) => event.stopPropagation()}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Category
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Leave it blank or choose the best match.
              </ThemedText>

              <View style={styles.categoryGrid}>
                <CategoryOption
                  label="No category"
                  selected={category === null}
                  onPress={() => {
                    setCategory(null);
                    setCategoryPickerOpen(false);
                  }}
                />
                {categories.map((categoryOption) => (
                  <CategoryOption
                    key={categoryOption}
                    label={categoryOption}
                    selected={category === categoryOption}
                    onPress={() => {
                      setCategory(categoryOption);
                      setCategoryPickerOpen(false);
                    }}
                  />
                ))}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

type CategoryOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function CategoryOption({ label, selected, onPress }: CategoryOptionProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryOption,
        {
          backgroundColor: selected ? theme.text : theme.backgroundElement,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <ThemedText type="smallBold" style={{ color: selected ? theme.background : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconFrame: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    lineHeight: 44,
  },
  summaryPanel: {
    borderRadius: 8,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  summaryLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    opacity: 0.72,
  },
  summaryValue: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '700',
  },
  summaryMeta: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.72,
  },
  formPanel: {
    borderRadius: 8,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  input: {
    minHeight: 52,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    fontWeight: '600',
  },
  categorySelector: {
    minHeight: 60,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  addButton: {
    minHeight: 52,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  addIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  filterList: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  filterChip: {
    minHeight: 40,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  expenseList: {
    gap: Spacing.two,
  },
  expenseRow: {
    minHeight: 68,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  expenseMain: {
    flex: 1,
    gap: Spacing.half,
  },
  emptyState: {
    borderRadius: 8,
    padding: Spacing.four,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
    justifyContent: 'flex-end',
    padding: Spacing.three,
  },
  modalPanel: {
    borderRadius: 8,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  categoryOption: {
    minHeight: 40,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
});
