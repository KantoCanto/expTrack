import { useClerk, useUser } from '@clerk/expo';
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
  subtitle,
  title,
}: AppHeaderProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const profileName =
    title ??
    user?.firstName ??
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    'Kanto';
  const profileSubtitle = subtitle ?? (user ? 'Signed in' : 'Welcome back');
  const avatarSource: ImageSourcePropType = user?.imageUrl
    ? { uri: user.imageUrl }
    : require('@/assets/images/avatar.png');

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
        <Image source={avatarSource} style={styles.avatar} />
        <View>
          <Text style={styles.profileLabel}>{profileSubtitle}</Text>
          <Text style={styles.profileName}>{profileName}</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        onPress={() => signOut()}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Image source={require('@/assets/icons/setting.png')} style={styles.navIcon} />
      </Pressable>
    </View>
  );
}
