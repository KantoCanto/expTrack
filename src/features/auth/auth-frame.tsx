import { type Href, useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthFrameProps = {
  children: ReactNode;
  eyebrow: string;
  fallbackHref?: Href;
  onBack?: () => void;
  showBackButton?: boolean;
  subtitle: string;
  title: string;
};

export function AuthFrame({
  children,
  eyebrow,
  fallbackHref,
  onBack,
  showBackButton = false,
  subtitle,
  title,
}: AuthFrameProps) {
  const router = useRouter();

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    if (fallbackHref) {
      router.replace(fallbackHref);
    }
  }

  return (
    <View className="flex-1 items-center bg-[#F6EBDD]">
      <SafeAreaView className="w-full max-w-[430px] flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1">
          <ScrollView
            contentContainerClassName="flex-grow justify-center gap-[18px] px-[22px] pb-9 pt-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {showBackButton ? (
              <Pressable
                accessibilityLabel="Go back"
                accessibilityRole="button"
                onPress={handleBack}
                className="h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#E4C8A8] bg-[#FFF7ED] active:opacity-[0.78]">
                <Text className="-mt-0.5 font-jakarta-extrabold text-[30px] leading-[34px] text-[#5A351D]">
                  ‹
                </Text>
              </Pressable>
            ) : null}
            <View>
              <Text className="font-jakarta-bold text-[13px] leading-[18px] text-[#B9571D]">
                {eyebrow}
              </Text>
              <Text className="font-jakarta-extrabold text-4xl leading-[42px] text-[#4A2A16]">
                {title}
              </Text>
              <Text className="font-jakarta-medium text-[15px] leading-[22px] text-[#8A6A4E]">
                {subtitle}
              </Text>
            </View>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
