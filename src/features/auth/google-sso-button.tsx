import { useSSO } from '@clerk/expo';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { getAuthErrorMessage } from './auth-errors';

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
      className={[
        'min-h-[52px] items-center justify-center rounded-lg border border-[#E4C8A8] bg-[#FBEEDC] active:opacity-[0.78]',
        isLoading ? 'opacity-[0.54]' : '',
      ].join(' ')}>
      <Text className="font-jakarta-extrabold text-[15px] leading-5 text-[#4A2A16]">
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </Text>
    </Pressable>
  );
}
