import { Pressable, ScrollView, Text } from 'react-native';

import { styles } from '../expense-styles';
import type { ExpenseFilter } from '../types';

type FilterChipsProps = {
  activeFilter: ExpenseFilter;
  filters: ExpenseFilter[];
  onChangeFilter: (filter: ExpenseFilter) => void;
};

export function FilterChips({ activeFilter, filters, onChangeFilter }: FilterChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
      {filters.map((filter) => {
        const selected = activeFilter === filter;
        return (
          <Pressable
            key={filter}
            onPress={() => onChangeFilter(filter)}
            style={({ pressed }) => [
              styles.filterChip,
              selected && styles.filterChipSelected,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{filter}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
