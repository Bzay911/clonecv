import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { resumeKeys } from './keys';

// DELETE /api/v1/resumes/:id
export function deleteResume(id: string) {
  return api<null>(`/resumes/${id}`, 'DELETE');
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResume,
    onSuccess: (_data, id) => {
      // Forget the deleted resume's details, then refresh just the list
      queryClient.removeQueries({ queryKey: resumeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.all, exact: true });
    },
  });
}
