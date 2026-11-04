import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { resumeKeys } from './keys';

// POST /api/v1/resumes → { id } of the new resume
export function createResume(name: string) {
  return api<{ id: string }>('/resumes', 'POST', { name });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResume,
    // The list is now out of date, so mark it stale and refetch it
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumeKeys.all }),
  });
}
