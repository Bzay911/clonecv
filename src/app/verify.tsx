import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
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

// Must match `otpLength` in the server's emailOTP() config (default 6).
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyScreen() {
  const colors = useTheme();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function handleVerify(code = otp) {
    if (code.length !== OTP_LENGTH || loading) return;

    setError(null);
    setLoading(true);
    const { error } = await authClient.signIn.emailOtp({ email, otp: code });
    setLoading(false);

    if (error) {
      setError(
        error.code === 'TOO_MANY_ATTEMPTS'
          ? 'Too many attempts. Request a new code.'
          : (error.message ?? 'Invalid code. Try again.'),
      );
      setOtp('');
      return;
    }
    // On success the session updates and Stack.Protected in _layout swaps to (protected).
  }

  async function handleResend() {
    setError(null);
    setCooldown(RESEND_SECONDS);
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' });
    if (error) setError(error.message ?? 'Could not resend the code.');
  }

  function handleChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(digits);
    if (digits.length === OTP_LENGTH) handleVerify(digits);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          contentContainerClassName="grow justify-center gap-8 px-6 py-8"
          keyboardShouldPersistTaps="handled">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            className="absolute left-6 top-4 h-10 w-10 items-center justify-center">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={colors.text}
            />
          </Pressable>

          <View className="items-center gap-2">
            <Text className="text-[30px] font-bold leading-[38px] tracking-[-0.6px] text-ink dark:text-ink-dark">
              Check your email
            </Text>
            <Text className="text-center text-[15px] leading-[22px] text-ink-muted dark:text-ink-muted-dark">
              We sent a {OTP_LENGTH}-digit code to{'\n'}
              <Text className="font-semibold text-ink dark:text-ink-dark">{email}</Text>
            </Text>
          </View>

          <View className="gap-2">
            <TextInput
              value={otp}
              onChangeText={handleChange}
              placeholder={'•'.repeat(OTP_LENGTH)}
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              autoFocus
              editable={!loading}
              className="h-[60px] rounded-md border border-line bg-surface-sunken px-3.5 text-center text-[24px] font-semibold tracking-[12px] text-ink dark:border-line-dark dark:bg-surface-sunken-dark dark:text-ink-dark"
            />
            {error && <Text className="text-center text-[13px] leading-5 text-red-600">{error}</Text>}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => handleVerify()}
            disabled={loading || otp.length !== OTP_LENGTH}
            className="h-[52px] flex-row items-center justify-center rounded-md bg-ink active:opacity-80 disabled:opacity-60 dark:bg-ink-dark">
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text className="text-base font-semibold text-surface-raised dark:text-surface-dark">
                Verify
              </Text>
            )}
          </Pressable>

          <Pressable accessibilityRole="button" onPress={handleResend} disabled={cooldown > 0}>
            <Text className="text-center text-[14px] text-ink-muted dark:text-ink-muted-dark">
              {cooldown > 0 ? (
                `Resend code in ${cooldown}s`
              ) : (
                <Text className="font-semibold text-ink underline dark:text-ink-dark">Resend code</Text>
              )}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
