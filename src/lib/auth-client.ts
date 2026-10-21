import { expoClient } from '@better-auth/expo/client';
import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  // Override with EXPO_PUBLIC_API_URL in .env to point at a local server during development.
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://clonecv.com',
  plugins: [
    expoClient({
      scheme: 'clonecv',
      storagePrefix: 'clonecv',
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
});
