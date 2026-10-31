export type Resume = {
  id: string;
  resumeName: string;
  updatedAt: string;
};

/** Matches the server's lib/schemas/resume.ts, trimmed to the fields the app uses. Every field can be missing. */
export type ResumeContent = {
  basics?: {
    fullName?: string;
    headline?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
  };
  experiences?: { role?: string; company?: string; location?: string; dates?: string; highlights?: string[] }[];
  education?: { institution?: string; degree?: string; field?: string; dates?: string }[];
  skills?: { name: string; category?: string }[];
  projects?: { name?: string; url?: string; description?: string }[];
};

export type ResumeDetail = Resume & {
  content: ResumeContent;
  designLayout: any; // typed when we do section order / design
  messages: any[]; // typed when we do the chat
};
