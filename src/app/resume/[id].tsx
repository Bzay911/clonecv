import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import resume from "@/dummydata/resumedata/resume.json";

const TABS = ["Chat", "Edit", "Design"] as const;
type Tab = (typeof TABS)[number];

// Every resume shows the same dummy data until the details endpoint exists.
export default function ResumeDetailScreen() {
  const { personal, education, skills, projects } = resume;
  const [tab, setTab] = useState<Tab>("Chat");
  const dark = useColorScheme() === "dark";

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-[#F2F2F7] dark:bg-black"
        contentContainerClassName="px-4 pb-40 pt-3"
      >
        <View className="gap-6 bg-white p-5 dark:bg-[#1C1C1E]">
          <View className="items-center gap-1">
            <Text className="text-2xl font-bold text-black dark:text-white">
              {personal.fullName}
            </Text>
            <Text className="text-center text-xs text-[#8E8E93]">
              {personal.headline}
            </Text>
            <Text className="text-center text-xs text-[#8E8E93]">
              {personal.email} | {personal.phone}
            </Text>
          </View>

          <Section title="Summary">
            <Text className="text-sm text-black dark:text-white">
              {personal.summary}
            </Text>
          </Section>

          <Section title="Education">
            {education.map((item) => (
              <View key={item.school}>
                <Text className="text-sm font-semibold text-black dark:text-white">
                  {item.school}
                </Text>
                <Text className="text-xs italic text-[#8E8E93]">
                  {item.degree}
                </Text>
                <Text className="text-xs italic text-[#8E8E93]">
                  {item.startDate} – {item.endDate}
                </Text>
              </View>
            ))}
          </Section>

          <Section title="Skills">
            {skills.groups.map((group) => (
              <Text
                key={group.category}
                className="text-sm text-black dark:text-white"
              >
                <Text className="font-semibold">{group.category}: </Text>
                {group.items.join(", ")}
              </Text>
            ))}
          </Section>

          <Section title="Projects">
            {projects.map((project) => (
              <View key={project.name}>
                <Text className="text-sm font-semibold text-black dark:text-white">
                  {project.name}
                </Text>
                <Text className="text-xs italic text-[#8E8E93]">
                  {project.link}
                </Text>
              </View>
            ))}
          </Section>
        </View>
      </ScrollView>

      <BottomSheet
        snapPoints={["15%", "50%", "90%"]}
        backgroundStyle={{ backgroundColor: dark ? "#1C1C1E" : "#FFFFFF" }}
        handleIndicatorStyle={{ backgroundColor: "#8E8E93" }}
      >
        <BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View className="flex-row rounded-md bg-[#F2F2F7] p-1 dark:bg-black">
            {TABS.map((name) => (
              <Pressable
                key={name}
                onPress={() => setTab(name)}
                className={`flex-1 items-center rounded-sm py-2 ${tab === name ? "bg-white dark:bg-[#2C2C2E]" : ""}`}
              >
                <Text
                  className={`text-sm ${tab === name ? "font-semibold text-black dark:text-white" : "text-[#8E8E93]"}`}
                >
                  {name}
                </Text>
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="border-b border-black pb-1 text-sm font-bold uppercase text-black dark:border-white dark:text-white">
        {title}
      </Text>
      {children}
    </View>
  );
}
