import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AccountLayout() {
  const dark = useColorScheme() === 'dark';
  const text = dark ? '#FFFFFF' : '#000000';

  return (
    <Stack
      screenOptions={{
        headerLargeTitleEnabled: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerTitleStyle: { color: text },
        headerLargeTitleStyle: { color: text, fontSize: 30, fontWeight: '700' },
        headerTintColor: text,
        ...(Platform.OS === 'ios'
          ? { headerTransparent: true }
          : { headerStyle: { backgroundColor: dark ? '#000000' : '#F2F2F7' } }),
      }}>
      <Stack.Screen name="index" options={{ title: 'My Account' }} />
    </Stack>
  );
}
