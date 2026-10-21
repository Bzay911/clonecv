import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { authClient } from '@/lib/auth-client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  // Icons and the placeholder take colour props, not classes, so they still read the theme.
  const colors = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setError('Enter a valid email address.');
      return;
    }

    setError(null);
    setLoading(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: trimmed,
      type: 'sign-in',
    });
    setLoading(false);

    if (error) {
      setError(error.message ?? 'Could not send the code. Try again.');
      return;
    }
    router.push({ pathname: '/verify', params: { email: trimmed } });
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          contentContainerClassName="grow justify-center gap-8 px-6 py-8"
          keyboardShouldPersistTaps="handled">
          <View className="items-center gap-2">
            <Image
              source={require('@/assets/images/clonecv-logo.webp')}
              style={{ width: 45, height: 48 }}
              contentFit="contain"
              accessibilityLabel="CloneCV logo"
            />
            <Text className="mt-4 text-[30px] font-bold leading-[38px] tracking-[-0.6px] text-ink dark:text-ink-dark">
              Sign in
            </Text>
            <Text className="text-center text-[15px] leading-[22px] text-ink-muted dark:text-ink-muted-dark">
              New to CloneCV? We&apos;ll create your account.
            </Text>
          </View>

          <View className="gap-5">
            <Pressable
              accessibilityRole="button"
              className="h-[52px] flex-row items-center justify-center gap-2.5 rounded-md border border-line bg-surface-raised active:bg-surface-sunken dark:border-line-dark dark:bg-surface-raised-dark dark:active:bg-surface-sunken-dark">
              <Text className="text-lg font-bold text-[#4285F4]">G</Text>
              <Text className="text-base font-semibold text-ink dark:text-ink-dark">
                Continue with Google
              </Text>
            </Pressable>

            <View className="flex-row items-center gap-4">
              <View className="h-px flex-1 bg-line dark:bg-line-dark" />
              <Text className="text-xs font-semibold tracking-[1px] text-ink-muted dark:text-ink-muted-dark">
                OR
              </Text>
              <View className="h-px flex-1 bg-line dark:bg-line-dark" />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold leading-5 text-ink dark:text-ink-dark">
                Email
              </Text>
              <TextInput
                placeholder="you@email.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={handleContinue}
                returnKeyType="send"
                editable={!loading}
                className="h-[52px] rounded-md border border-line bg-surface-sunken px-3.5 text-[15px] text-ink dark:border-line-dark dark:bg-surface-sunken-dark dark:text-ink-dark"
              />
              {error && <Text className="text-[13px] leading-5 text-red-600">{error}</Text>}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleContinue}
              disabled={loading}
              className="h-[52px] flex-row items-center justify-center gap-2 rounded-md bg-ink active:opacity-80 disabled:opacity-60 dark:bg-ink-dark">
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <>
                  <Text className="text-base font-semibold text-surface-raised dark:text-surface-dark">
                    Continue
                  </Text>
                  <SymbolView
                    name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                    size={18}
                    tintColor={colors.background}
                  />
                </>
              )}
            </Pressable>
          </View>

          <Text className="text-center text-[13px] leading-5 text-ink-muted dark:text-ink-muted-dark">
            By continuing, you agree to our{' '}
            <Text className="text-ink underline dark:text-ink-dark">Terms</Text> and{' '}
            <Text className="text-ink underline dark:text-ink-dark">Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
