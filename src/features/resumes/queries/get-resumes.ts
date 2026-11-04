import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { Resume } from '../types';
import { resumeKeys } from './keys';

// GET /api/v1/resumes
export function getResumes() {
  return api<Resume[]>('/resumes');
}

export function useResumes() {
  return useQuery({
    queryKey: resumeKeys.all,
    queryFn: getResumes,
  });
}
