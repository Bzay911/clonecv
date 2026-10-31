import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { Text, useColorScheme, View } from "react-native";

import type { ResumeContent } from "../types";

// Fields are prefilled from the saved resume. Changes aren't saved yet.
export default function EditPanel({ content }: { content: ResumeContent }) {
  const {
    basics = {},
    experiences = [],
    education = [],
    skills = [],
    projects = [],
  } = content;

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
        <Field label="Full name" value={basics.fullName ?? ""} />
        <Field label="Headline" value={basics.headline ?? ""} />
        <Field label="Email" value={basics.email ?? ""} />
        <Field label="Phone" value={basics.phone ?? ""} />
        <Field
          label="Location"
          value={basics.location ?? ""}
          placeholder="Melbourne, VIC"
        />
        <Field label="Summary" value={basics.summary ?? ""} multiline />
      </Section>

      <Section title="Experience">
        {experiences.length === 0 && (
          <View className="gap-0.5 rounded-lg border border-dashed border-[#C7C7CC] p-4 dark:border-[#38383A]">
            <Text className="text-sm font-semibold text-black dark:text-white">
              No experience yet
            </Text>
            <Text className="text-xs text-[#8E8E93]">Add a role.</Text>
          </View>
        )}
        {experiences.map((job, i) => (
          <Card key={i}>
            <Field label="Role" value={job.role ?? ""} />
            <Field label="Company" value={job.company ?? ""} />
            <Field label="Dates" value={job.dates ?? ""} />
            <Field
              label="Highlights"
              value={(job.highlights ?? []).join("\n")}
              multiline
            />
          </Card>
        ))}
      </Section>

      <Section title="Education">
        {education.map((item, i) => (
          <Card key={i}>
            <Field label="Institution" value={item.institution ?? ""} />
            <Field label="Degree" value={item.degree ?? ""} />
            <Field label="Field" value={item.field ?? ""} />
            <Field label="Dates" value={item.dates ?? ""} />
          </Card>
        ))}
      </Section>

      <Section title="Skills">
        <Field
          label="Skills"
          value={skills.map((s) => s.name).join(", ")}
          multiline
        />
      </Section>

      <Section title="Projects">
        {projects.map((project, i) => (
          <Card key={i}>
            <Field label="Name" value={project.name ?? ""} />
            <Field label="Link" value={project.url ?? ""} />
            <Field
              label="Description"
              value={project.description ?? ""}
              multiline
            />
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
