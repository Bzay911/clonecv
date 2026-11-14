import type { ResumeLayout } from "../../types/types";

// Same headings the server uses for new resumes
const DEFAULT_LABELS: Record<string, string> = {
  basics: "Summary",
  experiences: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  references: "References",
};

export const defaultSectionLabel = (key: string) =>
  DEFAULT_LABELS[key] ?? "Untitled section";


export function cleanLayout(layout: ResumeLayout): ResumeLayout {
  return {
    ...layout,
    resumeSections: layout.resumeSections.map((section) => ({
      ...section,
      label:
        section.label.trim() ||
        DEFAULT_LABELS[section.key] ||
        "Untitled section",
    })),
  };
}