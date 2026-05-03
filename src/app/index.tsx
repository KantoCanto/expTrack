import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/features/expenses/components/app-header';
import { CategoryPickerModal } from '@/features/expenses/components/category-picker-modal';
import { ExpenseActionsModal } from '@/features/expenses/components/expense-actions-modal';
import { ExpenseForm } from '@/features/expenses/components/expense-form';
import { ExpenseList } from '@/features/expenses/components/expense-list';
import { FilterChips } from '@/features/expenses/components/filter-chips';
import { SectionHeader } from '@/features/expenses/components/section-header';
import { SpendingHero } from '@/features/expenses/components/spending-hero';
import { categories } from '@/features/expenses/expense-data';
import { styles } from '@/features/expenses/expense-styles';
import { useExpenses } from '@/features/expenses/expenses-context';
import type {
	Category,
	Expense,
	ExpenseFilter,
} from '@/features/expenses/types';

export default function HomeScreen() {
	const router = useRouter();
	const {
		addExpense: createExpense,
		error,
		expenses,
		isLoading,
		isRemoteSyncEnabled,
		removeExpense,
		updateExpenseDate,
	} = useExpenses();
	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState('');
	const [category, setCategory] = useState<Category | null>(null);
	const [activeFilter, setActiveFilter] = useState<ExpenseFilter>('All');
	const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
	const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

	const filterOptions: ExpenseFilter[] = [
		'All',
		'Uncategorized',
		...categories,
	];

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

	async function addExpense() {
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

		await createExpense({
			title: trimmedTitle,
			amount: parsedAmount,
			category,
		});
		setTitle('');
		setAmount('');
		setCategory(null);
	}

	async function handleRemoveExpense(id: string) {
		await removeExpense(id);
		setSelectedExpense(null);
	}

	async function handleUpdateExpenseDate(id: string, date: Date) {
		await updateExpenseDate(id, date);
		setSelectedExpense(null);
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
					style={styles.keyboardView}
				>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.content}
						keyboardShouldPersistTaps="handled"
					>
						<AppHeader onLeftPress={() => router.push('/expenses')} />

						<SpendingHero
							activeFilter={activeFilter}
							expenseCount={filteredExpenses.length}
							total={total}
						/>

						<SectionHeader
							title={isRemoteSyncEnabled ? 'Supabase sync' : 'Local mode'}
							meta={
								error ??
								(isLoading
									? 'Loading'
									: isRemoteSyncEnabled
										? 'Connected'
										: 'Demo data')
							}
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

						<SectionHeader
							title="Categories"
							meta={`${filterOptions.length} filters`}
						/>
						<FilterChips
							activeFilter={activeFilter}
							filters={filterOptions}
							onChangeFilter={setActiveFilter}
						/>

						<SectionHeader
							title="Recent expenses"
							meta={`${filteredExpenses.length} items`}
						/>
						<ExpenseList
							expenses={filteredExpenses}
							onOpenExpenseActions={setSelectedExpense}
						/>
					</ScrollView>
				</KeyboardAvoidingView>

				<CategoryPickerModal
					selectedCategory={category}
					onClose={() => setCategoryPickerOpen(false)}
					onSelectCategory={selectCategory}
					visible={categoryPickerOpen}
				/>

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
