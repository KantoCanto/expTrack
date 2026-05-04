import { Image, Pressable, Text, TextInput, View } from 'react-native';

import { categoryIcons, uncategorizedIcon } from '../expense-data';
import { styles } from '../expense-styles';
import type { Category } from '../types';

type ExpenseFormProps = {
  amount: string;
  category: Category | null;
  onAddExpense: () => void;
  onAmountChange: (amount: string) => void;
  onOpenCategoryPicker: () => void;
  onTitleChange: (title: string) => void;
  title: string;
};

export function ExpenseForm({
  amount,
  category,
  onAddExpense,
  onAmountChange,
  onOpenCategoryPicker,
  onTitleChange,
  title,
}: ExpenseFormProps) {
  return (
    <View style={styles.formCard}>
      <View style={styles.formHeader}>
        <Text style={styles.sectionTitle}>Add new expense</Text>
        <Image source={require('@/assets/icons/plus.png')} style={styles.sectionIcon} />
      </View>

      <TextInput
        value={title}
        onChangeText={onTitleChange}
        placeholder="Description (optional)"
        placeholderTextColor="#9B8063"
        style={styles.input}
      />

      <TextInput
        value={amount}
        onChangeText={onAmountChange}
        placeholder="Amount"
        placeholderTextColor="#9B8063"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <Pressable
        onPress={onOpenCategoryPicker}
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
        onPress={onAddExpense}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <Text style={styles.primaryButtonText}>Add expense</Text>
      </Pressable>
    </View>
  );
}
