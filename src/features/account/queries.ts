import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { Me } from './types';

// The fetch function: calls GET /api/v1/me
export function getMe() {
  return api<Me>('/me');
}

// The hook screens use: caching, loading and error state on top of getMe()
export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });
}
