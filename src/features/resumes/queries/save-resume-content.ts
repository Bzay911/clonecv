import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { ResumeContent, ResumeDetail } from '../types';
import { resumeKeys } from './keys';

// PATCH /api/v1/resumes/:id  { content }: replaces the resume's whole content
export function saveResumeContent({ id, content }: { id: string; content: ResumeContent }) {
  return api<null>(`/resumes/${id}`, 'PATCH', { content });
}

export function useSaveResumeContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveResumeContent,
    onSuccess: (_data, { id, content }) => {
      // Put the saved content straight into the cache (no refetch, so it can't overwrite what you're typing)
      queryClient.setQueryData<ResumeDetail>(resumeKeys.detail(id), (old) =>
        old ? { ...old, content } : old,
      );
      // The "Updated" date in the list changed
      queryClient.invalidateQueries({ queryKey: resumeKeys.all, exact: true });
    },
  });
}