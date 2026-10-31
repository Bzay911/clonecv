import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // retry a failed request once
      staleTime: 30_000, // reuse fetched data for 30s before refetching
    },
  },
});
