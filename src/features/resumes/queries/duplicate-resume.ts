import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { resumeKeys } from './keys';

// POST /api/v1/resumes/:id/duplicate → { id } of the copy
export function duplicateResume(id: string) {
  return api<{ id: string }>(`/resumes/${id}/duplicate`, 'POST');
}

export function useDuplicateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: duplicateResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumeKeys.all }),
  });
}
