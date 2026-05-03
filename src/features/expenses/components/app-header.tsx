import { Image, Pressable, Text, View } from 'react-native';

import { styles } from '../expense-styles';

export function AppHeader() {
  return (
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
  );
}
