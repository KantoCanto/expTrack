import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';

import { ExpensesProvider } from '@/features/expenses/expenses-context';

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

if (!clerkPublishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your environment.');
}

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
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ExpensesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ExpensesProvider>
    </ClerkProvider>
  );
}
