import { useAuth, useSignUp } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authStyles as styles } from '@/features/auth/auth-styles';

export default function SignUpScreen() {
  const { isSignedIn } = useAuth();
  const { errors, fetchStatus, signUp } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

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
    const { error } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  }

  async function handleVerify() {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === 'complete') {
      await finishSignUp();
    }
  }

  if (signUp.status === 'complete' || isSignedIn) {
    return null;
  }

  if (needsEmailVerification) {
    return (
      <AuthFrame eyebrow="One more step" title="Verify email">
        <View style={styles.formCard}>
          <Text style={styles.subtitle}>Enter the code Clerk sent to your inbox.</Text>
          <TextInput
            autoComplete="one-time-code"
            keyboardType="number-pad"
            onChangeText={setCode}
            placeholder="Verification code"
            placeholderTextColor="#766D82"
            style={styles.input}
            value={code}
          />
          {errors.fields.code ? (
            <Text style={styles.errorText}>{errors.fields.code.message}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting || code.trim().length === 0}
            onPress={handleVerify}
            style={({ pressed }) => [
              styles.primaryButton,
              (isSubmitting || code.trim().length === 0) && styles.primaryButtonDisabled,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.primaryButtonText}>Verify</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => signUp.verifications.sendEmailCode()}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Send a new code</Text>
          </Pressable>
        </View>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame eyebrow="Create account" title="Sign up">
      <View style={styles.formCard}>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmailAddress}
          placeholder="you@example.com"
          placeholderTextColor="#766D82"
          style={styles.input}
          textContentType="emailAddress"
          value={emailAddress}
        />
        {errors.fields.emailAddress ? (
          <Text style={styles.errorText}>{errors.fields.emailAddress.message}</Text>
        ) : null}
        <Text style={styles.label}>Password</Text>
        <TextInput
          autoComplete="new-password"
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#766D82"
          secureTextEntry
          style={styles.input}
          textContentType="newPassword"
          value={password}
        />
        {errors.fields.password ? (
          <Text style={styles.errorText}>{errors.fields.password.message}</Text>
        ) : null}
        {errors.global?.[0]?.message ? (
          <Text style={styles.errorText}>{errors.global[0]?.message}</Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.primaryButton,
            !canSubmit && styles.primaryButtonDisabled,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.primaryButtonText}>Create account</Text>
        </Pressable>
        <View nativeID="clerk-captcha" />
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Link href="/sign-in" asChild>
          <Pressable>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </Link>
      </View>
    </AuthFrame>
  );
}

type AuthFrameProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
};

function AuthFrame({ children, eyebrow, title }: AuthFrameProps) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View>
              <Text style={styles.eyebrow}>{eyebrow}</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>Create a Clerk user to keep this tracker private.</Text>
            </View>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
