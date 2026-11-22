import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { applicationKeys } from './keys';
import type { Application } from '../types/types';

export function getApplications() {
    return api<Application[]>("/applications");
}

export function useApplications() {
    return useQuery({
        queryKey: applicationKeys.all,
        queryFn: getApplications,
    });
}