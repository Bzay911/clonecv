// Cache keys for resume data, in one place so every file uses the same ones.
// ['resumes'] also matches ['resumes', id], so invalidating `all` refreshes the list and every resume.
export const resumeKeys = {
  all: ['resumes'] as const,
  detail: (id: string) => ['resumes', id] as const,
};
