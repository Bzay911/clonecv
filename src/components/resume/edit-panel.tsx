import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { Text, useColorScheme, View } from "react-native";

import resume from "@/dummydata/resumedata/resume.json";

// Fields are prefilled from the dummy data. Changes aren't saved yet.
export default function EditPanel() {
  const { personal, experience, education, skills, projects } = resume;

  return (
    <BottomSheetScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        gap: 24,
        paddingHorizontal: 16,
        paddingBottom: 60,
      }}
    >
      <Section title="Personal Information">
        <Field label="Full name" value={personal.fullName} />
        <Field label="Headline" value={personal.headline} />
        <Field label="Email" value={personal.email} />
        <Field label="Phone" value={personal.phone} />
        <Field
          label="Location"
          value={personal.location}
          placeholder="Melbourne, VIC"
        />
        <Field label="Summary" value={personal.summary} multiline />
      </Section>

      <Section title="Experience">
        {experience.length === 0 && (
          <View className="gap-0.5 rounded-lg border border-dashed border-[#C7C7CC] p-4 dark:border-[#38383A]">
            <Text className="text-sm font-semibold text-black dark:text-white">
              No experience yet
            </Text>
            <Text className="text-xs text-[#8E8E93]">Add a role.</Text>
          </View>
        )}
      </Section>

      <Section title="Education">
        {education.map((item) => (
          <Card key={item.school}>
            <Field label="School" value={item.school} />
            <Field label="Degree" value={item.degree} />
            <Field label="Start date" value={item.startDate} />
            <Field label="End date" value={item.endDate} />
          </Card>
        ))}
      </Section>

      <Section title="Skills">
        {skills.groups.map((group) => (
          <Card key={group.category}>
            <Field label="Category" value={group.category} />
            <Field label="Skills" value={group.items.join(", ")} />
          </Card>
        ))}
      </Section>

      <Section title="Projects">
        {projects.map((project) => (
          <Card key={project.name}>
            <Field label="Name" value={project.name} />
            <Field label="Link" value={project.link} />
          </Card>
        ))}
      </Section>
    </BottomSheetScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-black dark:text-white">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <View className="gap-3 rounded-lg border border-[#E5E5EA] p-4 dark:border-[#38383A]">
      {children}
    </View>
  );
}

function Field({
  label,
  value,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const dark = useColorScheme() === "dark";

  return (
    <View className="gap-1.5">
      <Text className="text-xs text-[#8E8E93]">{label}</Text>
      <BottomSheetTextInput
        defaultValue={value}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        multiline={multiline}
        style={{
          minHeight: multiline ? 110 : undefined,
          textAlignVertical: multiline ? "top" : "center",
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 10,
          fontSize: 15,
          backgroundColor: dark ? "#2C2C2E" : "#F2F2F7",
          color: dark ? "#FFFFFF" : "#000000",
        }}
      />
    </View>
  );
}
