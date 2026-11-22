export type ApplicationStatus =
  | "processing"
  | "awaiting_response"
  | "generating_resume"
  | "generating_cover_letter"
  | "scoring"
  | "ready"
  | "failed";

export type FitInsights = {
  fitScore: number;
  summary?: string;
  strengths?: string[];
  gaps?: string[];
};

export type Application = {
  id: string;
  title: string;
  jobTitle: string;
  company: string;
  location: string;
  status: ApplicationStatus;
  fitInsights: FitInsights | null;
  createdAt: string;
};