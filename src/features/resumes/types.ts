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
  certifications?: { name?: string; issuer?: string; date?: string; url?: string }[];
  references?: {
    name?: string;
    relationship?: string;
    email?: string;
    phone?: string;
    description?: string;
  }[];
  customSections?: { id: string; title: string; highlights: string[] }[];
};

/** Matches the server's resumeLayoutDesignSchema. Array order of resumeSections = order on the page. */
export type ResumeLayout = {
  template: string;
  fontFamily: string;
  accentColor?: string;
  fontSize: string;
  spacing: string;
  skillsLayout: string; // "categorized" | "list"
  resumeSections: { key: string; label: string; visible: boolean }[];
};

export type ResumeDetail = Resume & {
  content: ResumeContent;
  designLayout: ResumeLayout;
  messages: ChatMessage[];
};

/** One piece of a chat message (Vercel AI SDK format). Text parts carry `text`; tool parts ("tool-updateExperience") carry `state`. */
export type ChatPart = { type: string; text?: string; state?: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: ChatPart[];
  metadata?: { createdAt?: string };
};
