import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';

import { expenseDateFormatter } from '../expense-data';
import { styles } from '../expense-styles';
import type { Expense } from '../types';

type ExpenseActionsModalProps = {
  expense: Expense | null;
  onClose: () => void;
  onDeleteExpense: (id: string) => void;
  onUpdateDate: (id: string, date: Date) => void;
};

export function ExpenseActionsModal({
  expense,
  onClose,
  onDeleteExpense,
  onUpdateDate,
}: ExpenseActionsModalProps) {
  const [dateInput, setDateInput] = useState('');

  useEffect(() => {
    if (!expense) {
      setDateInput('');
      return;
    }

    setDateInput(toDateInputValue(expense.date));
  }, [expense]);

  function saveDate() {
    if (!expense) {
      return;
    }

    const parsedDate = parseDateInput(dateInput);

    if (!parsedDate) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD, for example 2026-05-03.');
      return;
    }

    onUpdateDate(expense.id, parsedDate);
  }

  return (
    <Modal animationType="fade" transparent visible={expense !== null} onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalPanel} onPress={(event) => event.stopPropagation()}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{expense?.title || expense?.category || 'Expense'}</Text>
          {expense ? (
            <Text style={styles.modalSubtitle}>
              Current date: {expenseDateFormatter.format(expense.date)}
            </Text>
          ) : null}

          <View style={styles.actionGroup}>
            <Text style={styles.fieldLabel}>Edit date</Text>
            <TextInput
              value={dateInput}
              onChangeText={setDateInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9B8063"
              keyboardType="numbers-and-punctuation"
              style={styles.input}
            />
            <Pressable
              onPress={saveDate}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryButtonText}>Save date</Text>
            </Pressable>
          </View>

          {expense ? (
            <Pressable
              onPress={() => onDeleteExpense(expense.id)}
              style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}>
              <Text style={styles.dangerButtonText}>Delete expense</Text>
            </Pressable>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    parsedDate.getFullYear() !== Number(year) ||
    parsedDate.getMonth() !== Number(month) - 1 ||
    parsedDate.getDate() !== Number(day)
  ) {
    return null;
  }

  return parsedDate;
}
