import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";

import type { ResumeContent } from "../types";
import type { SaveStatus } from "../use-autosave";

type Basics = NonNullable<ResumeContent["basics"]>;

// Personal information saves automatically. Other sections are read-only until R3b.
export default function EditPanel({
  content,
  onChange,
  saveStatus,
  onRetry,
}: {
  content: ResumeContent;
  onChange: (content: ResumeContent) => void;
  saveStatus: SaveStatus;
  onRetry: () => void;
}) {
  const {
    basics = {},
    experiences = [],
    education = [],
    skills = [],
    projects = [],
  } = content;

  // Change one field in basics, keeping every other field (and every other section) as it is
  const setBasic = (key: keyof Basics) => (value: string) =>
    onChange({ ...content, basics: { ...basics, [key]: value } });

  return (
    <BottomSheetScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        gap: 24,
        paddingHorizontal: 16,
        paddingBottom: 60,
      }}
    >
      <SaveIndicator status={saveStatus} onRetry={onRetry} />

      <Section title="Personal Information">
        <Field
          label="Full name"
          value={basics.fullName ?? ""}
          onChangeText={setBasic("fullName")}
        />
        <Field
          label="Headline"
          value={basics.headline ?? ""}
          onChangeText={setBasic("headline")}
        />
        <Field
          label="Email"
          value={basics.email ?? ""}
          onChangeText={setBasic("email")}
        />
        <Field
          label="Phone"
          value={basics.phone ?? ""}
          onChangeText={setBasic("phone")}
        />
        <Field
          label="Location"
          value={basics.location ?? ""}
          onChangeText={setBasic("location")}
          placeholder="Melbourne, VIC"
        />
        <Field
          label="Summary"
          value={basics.summary ?? ""}
          onChangeText={setBasic("summary")}
          multiline
        />
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

function SaveIndicator({
  status,
  onRetry,
}: {
  status: SaveStatus;
  onRetry: () => void;
}) {
  if (status === "idle") return null;
  if (status === "error")
    return (
      <Pressable onPress={onRetry} hitSlop={8} className="self-end">
        <Text className="text-xs text-rose-ink dark:text-rose-ink-dark">
          Couldn&apos;t save · Retry
        </Text>
      </Pressable>
    );
  return (
    <View className="flex-row items-center gap-1 self-end">
      <Text className="text-xs text-[#8E8E93]">
        {status === "saving" ? "Saving…" : "Saved"}
      </Text>
    </View>
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

// Controlled input: shows `value` and reports changes. Without onChangeText it's read-only and dimmed.
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const dark = useColorScheme() === "dark";
  const editable = !!onChangeText;

  return (
    <View className="gap-1.5">
      <Text className="text-xs text-[#8E8E93]">{label}</Text>
      <BottomSheetTextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
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
          opacity: editable ? 1 : 0.6,
        }}
      />
    </View>
  );
}
