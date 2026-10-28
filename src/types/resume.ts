export type Resume = {
  id: string;
  resumeName: string;
  updatedAt: string;
};

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };
