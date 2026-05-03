import { Text, View } from 'react-native';

import { styles } from '../expense-styles';

type SectionHeaderProps = {
  title: string;
  meta: string;
};

export function SectionHeader({ title, meta }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionMeta}>{meta}</Text>
    </View>
  );
}
