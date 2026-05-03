import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, Text, View } from 'react-native';

import { styles } from '../expense-styles';

type AppHeaderProps = {
  leftAccessibilityLabel?: string;
  leftIcon?: ImageSourcePropType;
  onLeftPress?: () => void;
  subtitle?: string;
  title?: string;
};

export function AppHeader({
  leftAccessibilityLabel = 'Open expenses',
  leftIcon = require('@/assets/icons/menu.png'),
  onLeftPress,
  subtitle = 'Welcome back',
  title = 'Kanto',
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={leftAccessibilityLabel}
        onPress={onLeftPress}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Image source={leftIcon} style={styles.navIcon} />
      </Pressable>
      <View style={styles.profileCluster}>
        <Image source={require('@/assets/images/avatar.png')} style={styles.avatar} />
        <View>
          <Text style={styles.profileLabel}>{subtitle}</Text>
          <Text style={styles.profileName}>{title}</Text>
        </View>
      </View>
      <Pressable style={styles.iconButton}>
        <Image source={require('@/assets/icons/setting.png')} style={styles.navIcon} />
      </Pressable>
    </View>
  );
}
