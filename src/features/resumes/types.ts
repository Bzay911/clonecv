export type Resume = {
  id: string;
  resumeName: string;
  updatedAt: string;
};

// ---- Resume content: one type per section (matches the server's lib/schemas/resume.ts). Every field can be missing. ----

export type Basics = {
  fullName?: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
};

export type Experience = {
  role?: string;
  company?: string;
  location?: string;
  dates?: string;
  highlights?: string[];
};

export type Education = {
  institution?: string;
  degree?: string;
  field?: string;
  dates?: string;
};

export type Skill = {
  name: string;
  category?: string;
};

export type Project = {
  name?: string;
  url?: string;
  description?: string;
};

export type Certification = {
  name?: string;
  issuer?: string;
  date?: string;
  url?: string;
};

export type Reference = {
  name?: string;
  relationship?: string;
  email?: string;
  phone?: string;
  description?: string;
};

export type CustomSection = {
  id: string;
  title: string;
  highlights: string[];
};

export type ResumeContent = {
  basics?: Basics;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  references?: Reference[];
  customSections?: CustomSection[];
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
