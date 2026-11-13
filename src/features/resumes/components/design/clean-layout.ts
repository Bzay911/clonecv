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

/**
 * Tidies the layout just before it's saved. Your draft on screen isn't changed.
 * - trims section titles; a blank one falls back to the default heading
 * - never touches `key`
 */
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