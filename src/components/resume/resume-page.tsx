import { useState, type ReactNode } from "react";
import { Text, useWindowDimensions, View } from "react-native";

import resume from "@/dummydata/resumedata/resume.json";

// A4 width in px. The page is drawn at this size, then shrunk to fit the screen like a document.
export const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

// Every resume shows the same dummy data until the details endpoint exists.
export default function ResumePage() {
  const { personal, education, skills, projects } = resume;
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(PAGE_HEIGHT);
  const scale = (width - 32) / PAGE_WIDTH;

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
            {personal.fullName}
          </Text>
          <Text className="text-center text-xs text-[#4A4A4A]">
            {personal.headline}
          </Text>
          <Text className="text-center text-xs text-[#4A4A4A]">
            {personal.email} | {personal.phone}
          </Text>
        </View>

        <Section title="Summary">
          <Text className="text-sm text-black">{personal.summary}</Text>
        </Section>

        <Section title="Education">
          {education.map((item) => (
            <View key={item.school}>
              <Text className="text-sm font-semibold text-black">
                {item.school}
              </Text>
              <Text className="text-xs italic text-[#4A4A4A]">
                {item.degree}
              </Text>
              <Text className="text-xs italic text-[#4A4A4A]">
                {item.startDate} – {item.endDate}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Skills">
          {skills.groups.map((group) => (
            <Text key={group.category} className="text-sm text-black">
              <Text className="font-semibold">{group.category}: </Text>
              {group.items.join(", ")}
            </Text>
          ))}
        </Section>

        <Section title="Projects">
          {projects.map((project) => (
            <View key={project.name}>
              <Text className="text-sm font-semibold text-black">
                {project.name}
              </Text>
              <Text className="text-xs italic text-[#4A4A4A]">
                {project.link}
              </Text>
            </View>
          ))}
        </Section>
      </View>
    </View>
  );
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
