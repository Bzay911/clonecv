import type { ResumeContent } from "../types/types";

/**
 * Tidies the content just before it's saved. Your draft on screen isn't changed.
 * - removes blank highlight lines and blank skills (left over from pressing Enter while typing)
 * - trims spaces at the start and end of each one
 */
export function cleanContent(content: ResumeContent): ResumeContent {
  const cleaned: ResumeContent = { ...content };

  if (content.experiences) {
    cleaned.experiences = content.experiences.map((job) => ({
      ...job,
      highlights: job.highlights
        ?.map((line) => line.trim())
        .filter((line) => line !== ""),
    }));
  }

  if (content.skills) {
    cleaned.skills = content.skills
      .map((skill) => ({ ...skill, name: skill.name.trim() }))
      .filter((skill) => skill.name !== "");
  }

  return cleaned;
}
