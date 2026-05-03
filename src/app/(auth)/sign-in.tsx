import { useSignIn } from '@clerk/expo';
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

export default function SignInScreen() {
  const { errors, fetchStatus, signIn } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const isSubmitting = fetchStatus === 'fetching';
  const canSubmit = emailAddress.trim().length > 0 && password.length > 0 && !isSubmitting;

  async function finishSignIn() {
    await signIn.finalize({
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
    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      return;
    }

    if (signIn.status === 'complete') {
      await finishSignIn();
      return;
    }

    if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code',
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    }
  }

  async function handleVerify() {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === 'complete') {
      await finishSignIn();
    }
  }

  if (signIn.status === 'needs_client_trust') {
    return (
      <AuthFrame eyebrow="Secure session" title="Verify sign in">
        <View style={styles.formCard}>
          <Text style={styles.subtitle}>Enter the code Clerk sent to your email.</Text>
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
            onPress={() => signIn.mfa.sendEmailCode()}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Send a new code</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => signIn.reset()}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Start over</Text>
          </Pressable>
        </View>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame eyebrow="Welcome back" title="Sign in">
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
        {errors.fields.identifier ? (
          <Text style={styles.errorText}>{errors.fields.identifier.message}</Text>
        ) : null}
        <Text style={styles.label}>Password</Text>
        <TextInput
          autoComplete="current-password"
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#766D82"
          secureTextEntry
          style={styles.input}
          textContentType="password"
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
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>No account?</Text>
        <Link href="/sign-up" asChild>
          <Pressable>
            <Text style={styles.footerLink}>Create one</Text>
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
              <Text style={styles.subtitle}>Use your Clerk account to sync expenses securely.</Text>
            </View>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
