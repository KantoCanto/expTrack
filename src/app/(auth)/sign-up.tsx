import { useAuth, useSignUp } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { getAuthErrorMessage } from '@/features/auth/auth-errors';
import { AuthFrame } from '@/features/auth/auth-frame';
import { GoogleSsoButton } from '@/features/auth/google-sso-button';

const cardClassName = 'gap-3 rounded-lg border border-[#E4C8A8] bg-[#FFF7ED] p-[18px]';
const inputClassName =
  'min-h-[54px] rounded-lg border border-[#E0BE95] bg-[#FBEEDC] px-4 font-jakarta-semibold text-[15px] text-[#4A2A16]';
const labelClassName = 'font-jakarta-bold text-[13px] leading-[18px] text-[#4A2A16]';
const errorClassName = 'font-jakarta-medium text-[13px] leading-[18px] text-[#9A3F16]';
const subtitleClassName = 'font-jakarta-medium text-[15px] leading-[22px] text-[#8A6A4E]';
const primaryButtonClassName =
  'mt-1 min-h-[54px] items-center justify-center rounded-lg bg-[#8F3D12] active:opacity-[0.78]';
const primaryButtonTextClassName =
  'font-jakarta-extrabold text-[15px] leading-5 text-[#FFF8EC]';
const secondaryButtonClassName =
  'min-h-12 items-center justify-center rounded-lg active:opacity-[0.78]';
const secondaryButtonTextClassName = 'font-jakarta-bold text-sm leading-5 text-[#B9571D]';
const disabledClassName = 'opacity-[0.54]';

export default function SignUpScreen() {
  const { isSignedIn } = useAuth();
  const { errors, fetchStatus, signUp } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [actionError, setActionError] = useState('');

  const isSubmitting = fetchStatus === 'fetching';
  const canSubmit = emailAddress.trim().length > 0 && password.length > 0 && !isSubmitting;
  const needsEmailVerification =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0;

  async function finishSignUp() {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          return;
        }

        const url = decorateUrl('/');

        if (Platform.OS === 'web' && url.startsWith('http')) {
          window.location.href = url;
          return;
        }

        router.replace(url as Href);
      },
    });
  }

  async function handleSubmit() {
    setActionError('');

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setActionError(getAuthErrorMessage(error));
        return;
      }

      await signUp.verifications.sendEmailCode();
    } catch (error) {
      setActionError(getAuthErrorMessage(error));
    }
  }

  async function handleVerify() {
    setActionError('');

    try {
      await signUp.verifications.verifyEmailCode({ code });

      if (signUp.status === 'complete') {
        await finishSignUp();
      }
    } catch (error) {
      setActionError(getAuthErrorMessage(error));
    }
  }

  if (signUp.status === 'complete' || isSignedIn) {
    return null;
  }

  if (needsEmailVerification) {
    return (
      <AuthFrame
        eyebrow="One more step"
        fallbackHref="/sign-in"
        showBackButton
        subtitle="Create a Clerk user to keep this tracker private."
        title="Verify email">
        <View className={cardClassName}>
          <Text className={subtitleClassName}>Enter the code Clerk sent to your inbox.</Text>
          <TextInput
            autoComplete="one-time-code"
            keyboardType="number-pad"
            onChangeText={setCode}
            placeholder="Verification code"
            placeholderTextColor="#9B8063"
            className={inputClassName}
            value={code}
          />
          {errors.fields.code ? (
            <Text className={errorClassName}>{errors.fields.code.message}</Text>
          ) : null}
          {actionError ? <Text className={errorClassName}>{actionError}</Text> : null}
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting || code.trim().length === 0}
            onPress={handleVerify}
            className={[
              primaryButtonClassName,
              isSubmitting || code.trim().length === 0 ? disabledClassName : '',
            ].join(' ')}>
            <Text className={primaryButtonTextClassName}>Verify</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => signUp.verifications.sendEmailCode()}
            className={secondaryButtonClassName}>
            <Text className={secondaryButtonTextClassName}>Send a new code</Text>
          </Pressable>
        </View>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      eyebrow="Create account"
      subtitle="Create a Clerk user to keep this tracker private."
      title="Sign up">
      <View className={cardClassName}>
        <Text className={labelClassName}>Email address</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmailAddress}
          placeholder="you@example.com"
          placeholderTextColor="#9B8063"
          className={inputClassName}
          textContentType="emailAddress"
          value={emailAddress}
        />
        {errors.fields.emailAddress ? (
          <Text className={errorClassName}>{errors.fields.emailAddress.message}</Text>
        ) : null}
        <Text className={labelClassName}>Password</Text>
        <TextInput
          autoComplete="new-password"
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#9B8063"
          secureTextEntry
          className={inputClassName}
          textContentType="newPassword"
          value={password}
        />
        {errors.fields.password ? (
          <Text className={errorClassName}>{errors.fields.password.message}</Text>
        ) : null}
        {errors.global?.[0]?.message ? (
          <Text className={errorClassName}>{errors.global[0]?.message}</Text>
        ) : null}
        {actionError ? <Text className={errorClassName}>{actionError}</Text> : null}
        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          onPress={handleSubmit}
          className={[primaryButtonClassName, !canSubmit ? disabledClassName : ''].join(' ')}>
          <Text className={primaryButtonTextClassName}>Create account</Text>
        </Pressable>
        <View className="flex-row items-center gap-2.5">
          <View className="h-px flex-1 bg-[#E0BE95]" />
          <Text className="font-jakarta-bold text-xs leading-4 text-[#8A6A4E]">OR</Text>
          <View className="h-px flex-1 bg-[#E0BE95]" />
        </View>
        <GoogleSsoButton onError={setActionError} />
        <View nativeID="clerk-captcha" />
      </View>
      <View className="flex-row items-center justify-center gap-1.5">
        <Text className="font-jakarta-medium text-sm leading-5 text-[#8A6A4E]">
          Already have an account?
        </Text>
        <Link href="/sign-in" asChild>
          <Pressable>
            <Text className="font-jakarta-bold text-sm leading-5 text-[#B9571D]">Sign in</Text>
          </Pressable>
        </Link>
      </View>
    </AuthFrame>
  );
}
