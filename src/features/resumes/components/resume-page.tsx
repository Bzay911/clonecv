import { useState, type ReactNode } from "react";
import { Text, useWindowDimensions, View } from "react-native";

import type { ResumeContent, ResumeLayout } from "../types";

// A4 width in px. The page is drawn at this size, then shrunk to fit the screen like a document.
export const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

// Used only if a resume has no saved layout (same as the server's default).
const DEFAULT_SECTIONS = [
  { key: "basics", label: "Summary", visible: true },
  { key: "experiences", label: "Experience", visible: true },
  { key: "education", label: "Education", visible: true },
  { key: "skills", label: "Skills", visible: true },
  { key: "projects", label: "Projects", visible: true },
];

// Draws the resume like a document page. Sections follow the saved order and visibility;
// every field can be missing, so empty sections are hidden.
export default function ResumePage({
  content,
  layout,
}: {
  content: ResumeContent;
  layout?: ResumeLayout;
}) {
  const { basics = {} } = content;
  const sections = (layout?.resumeSections ?? DEFAULT_SECTIONS).filter(
    (s) => s.visible,
  );
  // console.log("sections", sections);
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(PAGE_HEIGHT);
  const scale = (width - 32) / PAGE_WIDTH;

  const contact = [basics.email, basics.phone, basics.location]
    .filter(Boolean)
    .join(" | ");

  return (
    <View style={{ width: PAGE_WIDTH * scale, height: height * scale }}>
      <View
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        style={{
          width: PAGE_WIDTH,
          minHeight: PAGE_HEIGHT,
          transform: [{ scale }],
          transformOrigin: "top left",
        }}
        className="gap-6 bg-white px-14 py-12"
      >
        <View className="items-center gap-1">
          <Text className="text-2xl font-bold text-black">
            {basics.fullName}
          </Text>
          {!!basics.headline && (
            <Text className="text-center text-xs text-[#4A4A4A]">
              {basics.headline}
            </Text>
          )}
          {!!contact && (
            <Text className="text-center text-xs text-[#4A4A4A]">
              {contact}
            </Text>
          )}
        </View>

        {sections.map((section) => {
          const body = renderSection(section.key, content, layout?.skillsLayout);
          return body ? (
            <Section key={section.key} title={section.label}>
              {body}
            </Section>
          ) : null;
        })}
      </View>
    </View>
  );
}

/** What goes inside each section. Returns null when there's nothing to show. */
function renderSection(
  key: string,
  content: ResumeContent,
  skillsLayout = "categorized",
): ReactNode {
  const {
    basics = {},
    experiences = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    references = [],
    customSections = [],
  } = content;

  switch (key) {
    // The server calls the Summary section "basics".
    case "basics":
      return basics.summary ? (
        <Text className="text-sm text-black">{basics.summary}</Text>
      ) : null;

    case "experiences":
      return experiences.length
        ? experiences.map((job, i) => (
            <View key={i}>
              <Text className="text-sm font-semibold text-black">
                {[job.role, job.company].filter(Boolean).join(" · ")}
              </Text>
              {!!job.dates && (
                <Text className="text-xs italic text-[#4A4A4A]">
                  {job.dates}
                </Text>
              )}
              {job.highlights?.map((h, j) => (
                <Text key={j} className="text-sm text-black">
                  • {h}
                </Text>
              ))}
            </View>
          ))
        : null;

    case "education":
      return education.length
        ? education.map((item, i) => (
            <View key={i}>
              <Text className="text-sm font-semibold text-black">
                {item.institution}
              </Text>
              <Text className="text-xs italic text-[#4A4A4A]">
                {[item.degree, item.field].filter(Boolean).join(", ")}
              </Text>
              {!!item.dates && (
                <Text className="text-xs italic text-[#4A4A4A]">
                  {item.dates}
                </Text>
              )}
            </View>
          ))
        : null;

    case "skills":
      if (!skills.length) return null;
      if (skillsLayout === "list")
        return (
          <Text className="text-sm text-black">
            {skills.map((s) => s.name).join(", ")}
          </Text>
        );
      return Object.entries(groupSkills(skills)).map(([category, names]) => (
        <Text key={category} className="text-sm text-black">
          <Text className="font-semibold">{category}: </Text>
          {names.join(", ")}
        </Text>
      ));

    case "projects":
      return projects.length
        ? projects.map((project, i) => (
            <View key={i}>
              <Text className="text-sm font-semibold text-black">
                {project.name}
              </Text>
              {!!project.url && (
                <Text className="text-xs italic text-[#4A4A4A]">
                  {project.url}
                </Text>
              )}
              {!!project.description && (
                <Text className="text-sm text-black">
                  {project.description}
                </Text>
              )}
            </View>
          ))
        : null;

    case "certifications":
      return certifications.length
        ? certifications.map((c, i) => (
            <View key={i}>
              <Text className="text-sm font-semibold text-black">{c.name}</Text>
              <Text className="text-xs italic text-[#4A4A4A]">
                {[c.issuer, c.date].filter(Boolean).join(" · ")}
              </Text>
            </View>
          ))
        : null;

    case "references":
      return references.length
        ? references.map((r, i) => (
            <View key={i}>
              <Text className="text-sm font-semibold text-black">{r.name}</Text>
              <Text className="text-xs italic text-[#4A4A4A]">
                {[r.relationship, r.email, r.phone].filter(Boolean).join(" · ")}
              </Text>
            </View>
          ))
        : null;

    default: {
      // Custom sections are saved as "custom-0", "custom-1", ... → customSections[index]
      const index = key.startsWith("custom-") ? Number(key.slice(7)) : -1;
      const custom = customSections[index];
      return custom?.highlights.length
        ? custom.highlights.map((h, i) => (
            <Text key={i} className="text-sm text-black">
              • {h}
            </Text>
          ))
        : null;
    }
  }
}

// The server sends skills flat: [{ name, category }]. Group them as { "Mobile": ["React Native", ...] }.
function groupSkills(skills: { name: string; category?: string }[]) {
  const groups: Record<string, string[]> = {};
  for (const s of skills) (groups[s.category || "Skills"] ??= []).push(s.name);
  return groups;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="border-b border-black pb-1 text-sm font-bold uppercase text-black">
        {title}
      </Text>
      {children}
    </View>
  );
}
