// Cache keys for application data, in one place so every file uses the same ones.
// ['applications'] also matches ['applications', id], so invalidating `all` refreshes the list and every application.
export const applicationKeys = {
  all: ["applications"] as const,
  detail: (id: string) => ["applications", id] as const,
};
