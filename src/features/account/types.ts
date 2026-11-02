export type Me = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    onboardedAt: string | null;
    createdAt: string;
  };
  subscription: { plan: string; status: string; currentPeriodEnd: string | null } | null;
  usage: { applicationsCount: number; resumesCount: number; coverLettersCount: number } | null;
};
