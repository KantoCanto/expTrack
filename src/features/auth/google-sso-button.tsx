import { useSSO } from '@clerk/expo';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { getAuthErrorMessage } from './auth-errors';
import { authStyles as styles } from './auth-styles';

type GoogleSsoButtonProps = {
  onError: (message: string) => void;
};

export function GoogleSsoButton({ onError }: GoogleSsoButtonProps) {
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    onError('');

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        return;
      }

      onError('Google sign-in was cancelled before a session was created.');
    } catch (error) {
      onError(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isLoading}
      onPress={handleGoogleSignIn}
      style={({ pressed }) => [
        styles.socialButton,
        isLoading && styles.primaryButtonDisabled,
        pressed && styles.pressed,
      ]}>
      <Text style={styles.socialButtonText}>{isLoading ? 'Connecting...' : 'Continue with Google'}</Text>
    </Pressable>
  );
}
