import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { Resume, ResumeDetail } from './types';

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: () => api<Resume[]>('/resumes'),
  });
}

export function useResume(id: string) {
  return useQuery({
    queryKey: ['resumes', id],
    queryFn: () => api<ResumeDetail>(`/resumes/${id}`),
  });
}
