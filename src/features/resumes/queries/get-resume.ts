import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { ResumeDetail } from '../types';
import { resumeKeys } from './keys';

// GET /api/v1/resumes/:id
export function getResume(id: string) {
  return api<ResumeDetail>(`/resumes/${id}`);
}

export function useResume(id: string) {
  return useQuery({
    queryKey: resumeKeys.detail(id),
    queryFn: () => getResume(id),
  });
}
