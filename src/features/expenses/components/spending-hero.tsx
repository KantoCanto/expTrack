import { Image, Text, View } from 'react-native';

import { currencyFormatter } from '../expense-data';
import { styles } from '../expense-styles';
import type { ExpenseFilter } from '../types';

type SpendingHeroProps = {
  activeFilter: ExpenseFilter;
  expenseCount: number;
  total: number;
};

export function SpendingHero({ activeFilter, expenseCount, total }: SpendingHeroProps) {
  return (
    <View style={styles.heroCard}>
      <Image source={require('@/assets/images/splash-pattern.png')} style={styles.heroPattern} />
      <Text style={styles.heroEyebrow}>
        {activeFilter === 'All' ? 'Monthly spending' : activeFilter}
      </Text>
      <Text style={styles.heroAmount}>{currencyFormatter.format(total)}</Text>
      <Text style={styles.heroMeta}>
        {expenseCount} {expenseCount === 1 ? 'expense' : 'expenses'} currently visible
      </Text>
    </View>
  );
}
