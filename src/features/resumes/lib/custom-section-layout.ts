import type { CustomSection, ResumeLayout } from "../types/types";

export function findCustomSection(sections: CustomSection[], key: string) {
  const byId = sections.find((section) => section.id === key);
  const legacyIndex = /^custom-(\d+)$/.exec(key);
  return byId ?? (legacyIndex ? sections[Number(legacyIndex[1])] : undefined);
}

export function syncCustomSectionLayout(
  layout: ResumeLayout,
  previous: CustomSection[],
  next: CustomSection[],
): ResumeLayout {
  const nextById = new Map(next.map((section) => [section.id, section]));
  const remaining = new Map(nextById);
  const resumeSections = layout.resumeSections.flatMap((entry) => {
    const oldSection = findCustomSection(previous, entry.key);
    const section = nextById.get(oldSection?.id ?? entry.key);
    if (!section) return oldSection ? [] : [entry];
    if (!remaining.delete(section.id)) return [];

    const label = section.title === oldSection?.title
      ? entry.label
      : section.title.trim() || "Untitled section";
    return [entry.key === section.id && entry.label === label
      ? entry
      : { ...entry, key: section.id, label }];
  });

  for (const section of remaining.values()) {
    resumeSections.push({
      key: section.id,
      label: section.title.trim() || "Untitled section",
      visible: true,
    });
  }

  if (
    resumeSections.length === layout.resumeSections.length &&
    resumeSections.every((section, index) => section === layout.resumeSections[index])
  ) {
    return layout;
  }
  return { ...layout, resumeSections };
}
