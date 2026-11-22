import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { cleanLayout } from "../lib/clean-layout";
import type { ResumeDetail, ResumeLayout } from "../types/types";
import { resumeKeys } from "./keys";

// PATCH /api/v1/resumes/:id  { designLayout }: replaces the resume's whole design layout
export function saveDesignLayout({id, designLayout}: {id: string; designLayout: ResumeLayout; }) {
  return api<null>(`/resumes/${id}`, "PATCH", {
    designLayout: cleanLayout(designLayout),
  });
}

// Puts the saved layout into the cache and refreshes the list's "Updated" date
export function applyLayoutToCache(
  queryClient: QueryClient,
  id: string,
  designLayout: ResumeLayout,
) {
  queryClient.setQueryData<ResumeDetail>(resumeKeys.detail(id), (old) =>
    old ? { ...old, designLayout: cleanLayout(designLayout) } : old,
  );
  queryClient.invalidateQueries({ queryKey: resumeKeys.all, exact: true });
}

export function useSaveDesignLayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDesignLayout,
    onSuccess: (_data, { id, designLayout }) => {
      // Put the saved layout straight into the cache (no refetch, so it can't overwrite what you're changing)
      queryClient.setQueryData<ResumeDetail>(resumeKeys.detail(id), (old) =>
        old ? { ...old, designLayout: cleanLayout(designLayout) } : old,
      );
      // The "Updated" date in the list changed
      queryClient.invalidateQueries({ queryKey: resumeKeys.all, exact: true });
    },
  });
}