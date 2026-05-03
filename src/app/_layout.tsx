import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans: require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
    PlusJakartaSansMedium: require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
    PlusJakartaSansSemiBold: require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    PlusJakartaSansBold: require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
    PlusJakartaSansExtraBold: require('@/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
