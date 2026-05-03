import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Category = (typeof categories)[number];

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category | null;
  icon: ImageSourcePropType;
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

const categoryIcons: Record<Category, ImageSourcePropType> = {
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

const uncategorizedIcon = require('@/assets/icons/wallet.png');

const initialExpenses: Expense[] = [
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

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function HomeScreen() {
  const [expenses, setExpenses] = useState(initialExpenses);
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

  const filterOptions: (Category | 'All' | 'Uncategorized')[] = [
    'All',
    'Uncategorized',
    ...categories,
  ];

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
            <View style={styles.header}>
              <Pressable style={styles.iconButton}>
                <Image source={require('@/assets/icons/menu.png')} style={styles.navIcon} />
              </Pressable>
              <View style={styles.profileCluster}>
                <Image source={require('@/assets/images/avatar.png')} style={styles.avatar} />
                <View>
                  <Text style={styles.profileLabel}>Welcome back</Text>
                  <Text style={styles.profileName}>Kanto</Text>
                </View>
              </View>
              <Pressable style={styles.iconButton}>
                <Image source={require('@/assets/icons/setting.png')} style={styles.navIcon} />
              </Pressable>
            </View>

            <View style={styles.heroCard}>
              <Image
                source={require('@/assets/images/splash-pattern.png')}
                style={styles.heroPattern}
              />
              <Text style={styles.heroEyebrow}>
                {activeFilter === 'All' ? 'Monthly spending' : activeFilter}
              </Text>
              <Text style={styles.heroAmount}>{currencyFormatter.format(total)}</Text>
              <Text style={styles.heroMeta}>
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}{' '}
                currently visible
              </Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.sectionTitle}>Add new expense</Text>
                <Image source={require('@/assets/icons/plus.png')} style={styles.sectionIcon} />
              </View>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Name"
                placeholderTextColor="#77717F"
                style={styles.input}
              />

              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="Amount"
                placeholderTextColor="#77717F"
                keyboardType="decimal-pad"
                style={styles.input}
              />

              <Pressable
                onPress={() => setCategoryPickerOpen(true)}
                style={({ pressed }) => [styles.selector, pressed && styles.pressed]}>
                <View style={styles.selectorIcon}>
                  <Image
                    source={category ? categoryIcons[category] : uncategorizedIcon}
                    style={styles.expenseIcon}
                  />
                </View>
                <View style={styles.selectorText}>
                  <Text style={styles.fieldLabel}>Category</Text>
                  <Text style={styles.fieldValue}>{category ?? 'No category'}</Text>
                </View>
                <Text style={styles.selectorAction}>Choose</Text>
              </Pressable>

              <Pressable
                onPress={addExpense}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                <Text style={styles.primaryButtonText}>Add expense</Text>
              </Pressable>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <Text style={styles.sectionMeta}>{filterOptions.length} filters</Text>
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
                      selected && styles.filterChipSelected,
                      pressed && styles.pressed,
                    ]}>
                    <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent expenses</Text>
              <Text style={styles.sectionMeta}>{filteredExpenses.length} items</Text>
            </View>

            <View style={styles.expenseList}>
              {filteredExpenses.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No expenses here yet</Text>
                  <Text style={styles.emptyMeta}>Add one or switch to another category.</Text>
                </View>
              ) : (
                filteredExpenses.map((expense) => (
                  <View key={expense.id} style={styles.expenseRow}>
                    <View style={styles.expenseIconFrame}>
                      <Image source={expense.icon} style={styles.expenseIcon} />
                    </View>
                    <View style={styles.expenseCopy}>
                      <Text style={styles.expenseTitle}>{expense.title}</Text>
                      <Text style={styles.expenseCategory}>{expense.category ?? 'No category'}</Text>
                    </View>
                    <Text style={styles.expenseAmount}>
                      {currencyFormatter.format(expense.amount)}
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${expense.title}`}
                      onPress={() => removeExpense(expense.id)}
                      style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}>
                      <Text style={styles.removeButtonText}>×</Text>
                    </Pressable>
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
            <Pressable style={styles.modalPanel} onPress={(event) => event.stopPropagation()}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Select category</Text>
              <Text style={styles.modalSubtitle}>New expenses stay uncategorized by default.</Text>

              <View style={styles.categoryGrid}>
                <CategoryOption
                  icon={uncategorizedIcon}
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
                    icon={categoryIcons[categoryOption]}
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
    </View>
  );
}

type CategoryOptionProps = {
  icon: ImageSourcePropType;
  label: string;
  selected: boolean;
  onPress: () => void;
};

function CategoryOption({ icon, label, selected, onPress }: CategoryOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryOption,
        selected && styles.categoryOptionSelected,
        pressed && styles.pressed,
      ]}>
      <Image source={icon} style={styles.categoryOptionIcon} />
      <Text style={[styles.categoryOptionText, selected && styles.categoryOptionTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09080D',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 112,
    gap: 22,
  },
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#18151F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#292432',
  },
  navIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#F9F4FF',
  },
  profileCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileLabel: {
    fontFamily: 'PlusJakartaSansMedium',
    color: '#8F879B',
    fontSize: 12,
    lineHeight: 16,
  },
  profileName: {
    fontFamily: 'PlusJakartaSansBold',
    color: '#F8F3FF',
    fontSize: 15,
    lineHeight: 20,
  },
  heroCard: {
    minHeight: 202,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FF7A1A',
    padding: 24,
    justifyContent: 'flex-end',
  },
  heroPattern: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.24,
    resizeMode: 'cover',
  },
  heroEyebrow: {
    fontFamily: 'PlusJakartaSansSemiBold',
    color: '#2D1605',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  heroAmount: {
    fontFamily: 'PlusJakartaSansExtraBold',
    color: '#120902',
    fontSize: 42,
    lineHeight: 48,
  },
  heroMeta: {
    fontFamily: 'PlusJakartaSansMedium',
    color: '#4A2508',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  formCard: {
    borderRadius: 8,
    backgroundColor: '#17141E',
    borderWidth: 1,
    borderColor: '#272230',
    padding: 18,
    gap: 14,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSansBold',
    color: '#F8F3FF',
    fontSize: 20,
    lineHeight: 26,
  },
  sectionIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#FF7A1A',
  },
  input: {
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: '#0F0D14',
    borderWidth: 1,
    borderColor: '#2B2534',
    color: '#F8F3FF',
    paddingHorizontal: 16,
    fontFamily: 'PlusJakartaSansSemiBold',
    fontSize: 15,
  },
  selector: {
    minHeight: 64,
    borderRadius: 8,
    backgroundColor: '#0F0D14',
    borderWidth: 1,
    borderColor: '#2B2534',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectorIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#211B29',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: 'PlusJakartaSansMedium',
    color: '#82788F',
    fontSize: 12,
    lineHeight: 16,
  },
  fieldValue: {
    fontFamily: 'PlusJakartaSansBold',
    color: '#F8F3FF',
    fontSize: 15,
    lineHeight: 20,
  },
  selectorAction: {
    fontFamily: 'PlusJakartaSansBold',
    color: '#FF7A1A',
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: '#FF7A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSansExtraBold',
    color: '#160B02',
    fontSize: 15,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: -8,
  },
  sectionMeta: {
    fontFamily: 'PlusJakartaSansMedium',
    color: '#80778B',
    fontSize: 13,
    lineHeight: 18,
  },
  filterList: {
    gap: 10,
    paddingRight: 22,
  },
  filterChip: {
    height: 42,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17141E',
    borderWidth: 1,
    borderColor: '#282331',
  },
  filterChipSelected: {
    backgroundColor: '#F8F3FF',
    borderColor: '#F8F3FF',
  },
  filterText: {
    fontFamily: 'PlusJakartaSansBold',
    color: '#A9A0B5',
    fontSize: 13,
    lineHeight: 18,
  },
  filterTextSelected: {
    color: '#15101B',
  },
  expenseList: {
    gap: 12,
  },
  expenseRow: {
    minHeight: 78,
    borderRadius: 8,
    backgroundColor: '#17141E',
    borderWidth: 1,
    borderColor: '#282331',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expenseIconFrame: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#231D2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  expenseCopy: {
    flex: 1,
    gap: 3,
  },
  expenseTitle: {
    fontFamily: 'PlusJakartaSansBold',
    color: '#F8F3FF',
    fontSize: 15,
    lineHeight: 20,
  },
  expenseCategory: {
    fontFamily: 'PlusJakartaSansMedium',
    color: '#82788F',
    fontSize: 12,
    lineHeight: 16,
  },
  expenseAmount: {
    fontFamily: 'PlusJakartaSansExtraBold',
    color: '#F8F3FF',
    fontSize: 15,
    lineHeight: 20,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#241A1C',
    borderWidth: 1,
    borderColor: '#3B2729',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontFamily: 'PlusJakartaSansExtraBold',
    color: '#FF7A1A',
    fontSize: 18,
    lineHeight: 18,
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  emptyCard: {
    borderRadius: 8,
    backgroundColor: '#17141E',
    borderWidth: 1,
    borderColor: '#282331',
    padding: 20,
  },
  emptyTitle: {
    fontFamily: 'PlusJakartaSansBold',
    color: '#F8F3FF',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyMeta: {
    fontFamily: 'PlusJakartaSansMedium',
    color: '#82788F',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  modalPanel: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#131018',
    borderWidth: 1,
    borderColor: '#2A2433',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
    gap: 14,
  },
  modalHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3A3245',
    alignSelf: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontFamily: 'PlusJakartaSansBold',
    color: '#F8F3FF',
    fontSize: 22,
    lineHeight: 28,
  },
  modalSubtitle: {
    fontFamily: 'PlusJakartaSansMedium',
    color: '#82788F',
    fontSize: 13,
    lineHeight: 18,
    marginTop: -8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryOption: {
    minHeight: 42,
    borderRadius: 8,
    backgroundColor: '#1B1722',
    borderWidth: 1,
    borderColor: '#2B2534',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryOptionSelected: {
    backgroundColor: '#FF7A1A',
    borderColor: '#FF7A1A',
  },
  categoryOptionIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  categoryOptionText: {
    fontFamily: 'PlusJakartaSansBold',
    color: '#F8F3FF',
    fontSize: 13,
    lineHeight: 18,
  },
  categoryOptionTextSelected: {
    color: '#160B02',
  },
  pressed: {
    opacity: 0.78,
  },
});
