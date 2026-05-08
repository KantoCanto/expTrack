import * as WebBrowser from 'expo-web-browser';
import { Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function SsoCallbackScreen() {
  return (
    <View className="min-h-screen flex-1 items-center justify-center bg-[#FFF8EC] px-6">
      <Text className="text-center font-jakarta-bold text-base leading-6 text-[#4A2A16]">
        Finishing sign in...
      </Text>
      <View nativeID="clerk-captcha" />
    </View>
  );
}
