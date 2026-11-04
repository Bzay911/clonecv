import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { resumeKeys } from './keys';

// PATCH /api/v1/resumes/:id  { name }
export function renameResume({ id, name }: { id: string; name: string }) {
  return api<null>(`/resumes/${id}`, 'PATCH', { name });
}

export function useRenameResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renameResume,
    // The name shows in the list and on the resume screen, so refresh both
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumeKeys.all }),
  });
}
