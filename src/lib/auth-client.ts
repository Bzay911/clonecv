import { expoClient } from '@better-auth/expo/client';
import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

import { SITE_URL } from '@/constants/api-config';

export const authClient = createAuthClient({
  baseURL: SITE_URL,
  plugins: [
    expoClient({
      scheme: 'clonecv',
      storagePrefix: 'clonecv',
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
});
