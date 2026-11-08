import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { Alert, Pressable, Text, useColorScheme, View } from "react-native";

import type { ResumeContent } from "../../types";
import type { SaveStatus } from "../../use-autosave";

/** Every section form receives the whole content and sends back a new whole content. */
export type FormProps = {
  content: ResumeContent;
  onChange: (content: ResumeContent) => void;
};

/** For "one per line" boxes (highlights, skills): list → text, and text → list. */
export const toLines = (list?: string[]) => (list ?? []).join("\n");
export const fromLines = (text: string) => text.split("\n");

/** Asks before removing, because there's no undo. */
export function confirmRemove(what: string, onConfirm: () => void) {
  Alert.alert(`Remove this ${what}?`, undefined, [
    { text: "Cancel", style: "cancel" },
    { text: "Remove", style: "destructive", onPress: onConfirm },
  ]);
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-black dark:text-white">
        {title}
      </Text>
      {children}
    </View>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <View className="gap-3 rounded-lg border border-[#E5E5EA] p-4 dark:border-[#38383A]">
      {children}
    </View>
  );
}

/** Top row of a card: what the entry is, plus a Remove button. */
export function CardHeader({
  title,
  onRemove,
}: {
  title: string;
  onRemove: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text
        className="flex-1 text-sm font-semibold text-black dark:text-white"
        numberOfLines={1}
      >
        {title}
      </Text>
      <Pressable onPress={onRemove} hitSlop={8}>
        <Text className="text-sm text-rose-ink dark:text-rose-ink-dark">
          Remove
        </Text>
      </Pressable>
    </View>
  );
}

/** Dashed button at the end of a section, e.g. "Add a role". */
export function AddButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center rounded-lg border border-dashed border-[#C7C7CC] py-3 active:opacity-70 dark:border-[#38383A]"
    >
      <Text className="text-sm font-semibold text-sky dark:text-sky-dark">
        {label}
      </Text>
    </Pressable>
  );
}

// Controlled input: shows `value` and reports changes. Without onChangeText it's read-only and dimmed.
export function Field({
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

export function SaveIndicator({
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
