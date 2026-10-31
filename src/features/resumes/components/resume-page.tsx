import { useState, type ReactNode } from "react";
import { Text, useWindowDimensions, View } from "react-native";

import type { ResumeContent } from "../types";

// A4 width in px. The page is drawn at this size, then shrunk to fit the screen like a document.
export const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

// Draws the resume like a document page. Every field can be missing, so empty sections are hidden.
export default function ResumePage({ content }: { content: ResumeContent }) {
  const {
    basics = {},
    experiences = [],
    education = [],
    skills = [],
    projects = [],
  } = content;
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(PAGE_HEIGHT);
  const scale = (width - 32) / PAGE_WIDTH;

  const contact = [basics.email, basics.phone, basics.location]
    .filter(Boolean)
    .join(" | ");
  const skillGroups = groupSkills(skills);

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

        {!!basics.summary && (
          <Section title="Summary">
            <Text className="text-sm text-black">{basics.summary}</Text>
          </Section>
        )}

        {experiences.length > 0 && (
          <Section title="Experience">
            {experiences.map((job, i) => (
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
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((item, i) => (
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
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            {Object.entries(skillGroups).map(([category, names]) => (
              <Text key={category} className="text-sm text-black">
                <Text className="font-semibold">{category}: </Text>
                {names.join(", ")}
              </Text>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((project, i) => (
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
            ))}
          </Section>
        )}
      </View>
    </View>
  );
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
