import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SaveIndicator from "../../lib/save-indicator";

import type { SaveStatus } from "../../lib/use-autosave";
import type { ResumeLayout } from "../../types/types";
import { FONT_FAMILIES, FONT_SIZES, SPACING } from "./design-constants";
import { TEMPLATES, TEMPLATE_THUMNAILS } from "./template-thumbnails";

// iOS has these built in. Calibri and Android show the system font in the picker.
const previewFont = (f: string) =>
  Platform.OS === "ios" && f !== "Calibri" ? { fontFamily: f } : undefined;

function Heading({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-sm font-semibold text-black dark:text-white">
      {children}
    </Text>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`rounded-lg px-3.5 py-2 ${
        selected ? "bg-sky dark:bg-sky-dark" : "bg-[#F2F2F7] dark:bg-[#2C2C2E]"
      }`}
    >
      <Text
        className={`text-xs font-semibold ${
          selected
            ? "text-on-sky dark:text-on-sky-dark"
            : "text-black dark:text-white"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type Props = {
  designLayout: ResumeLayout;
  onChange: (next: ResumeLayout) => void;
  saveStatus: SaveStatus;
  onRetry: () => void;
};

export default function ResumeDesignLayout({
  designLayout,
  onChange,
  saveStatus,
  onRetry,
}: Props) {
  const dark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const [fontOpen, setFontOpen] = useState(false);

  const {
    template,
    fontFamily,
    fontSize,
    spacing,
    skillsLayout,
    resumeSections,
  } = designLayout;

  // Always send the whole layout: the server replaces it as one object
  const set = <K extends keyof ResumeLayout>(key: K, value: ResumeLayout[K]) =>
    onChange({ ...designLayout, [key]: value });

  const updateSection = (index: number, patch: Partial<ResumeLayout["resumeSections"][number]>) => set( "resumeSections",
      resumeSections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= resumeSections.length) return;
    const next = [...resumeSections];
    [next[index], next[target]] = [next[target], next[index]];
    set("resumeSections", next);
  };

  return (
    <BottomSheetScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        gap: 20,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: insets.bottom + 40,
      }}
    >
      {/* Save status */}
   <SaveIndicator status={saveStatus} onRetry={onRetry} />

      {/* Template */}
      <View>
        <Heading>Template</Heading>
        <View className="flex-row gap-1.5">
          {TEMPLATES.map((t) => {
            const selected = template === t;
            return (
              <Pressable
                key={t}
                onPress={() => set("template", t)}
                accessibilityRole="button"
                accessibilityLabel={`${t} template`}
                accessibilityState={{ selected }}
                className={`flex-1 overflow-hidden rounded-lg border-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] ${
                  selected
                    ? "border-sky dark:border-sky-dark"
                    : "border-[#E5E5EA] dark:border-[#38383A]"
                }`}
              >
                <View
                  className="w-full bg-white"
                  style={{ aspectRatio: 4 / 5 }}
                >
                  <Image
                    source={TEMPLATE_THUMNAILS[t]}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  className={`py-1.5 text-center text-[11px] font-semibold ${
                    selected
                      ? "text-sky dark:text-sky-dark"
                      : "text-black dark:text-white"
                  }`}
                >
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Font */}
      <View>
        <Heading>Font</Heading>
        <Pressable
          onPress={() => setFontOpen(true)}
          className="h-10 flex-row items-center justify-between rounded-lg bg-[#F2F2F7] px-3.5 dark:bg-[#2C2C2E]"
        >
          <Text
            className="text-[15px] text-black dark:text-white"
            style={previewFont(fontFamily)}
          >
            {fontFamily}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#8E8E93" />
        </Pressable>
      </View>

      {/* Size */}
      <View>
        <Heading>Size</Heading>
        <View className="flex-row gap-1.5">
          {FONT_SIZES.map((o) => (
            <Chip
              key={o}
              label={o}
              selected={fontSize === o}
              onPress={() => set("fontSize", o)}
            />
          ))}
        </View>
      </View>

      {/* Spacing */}
      <View>
        <Heading>Spacing</Heading>
        <View className="flex-row gap-1.5">
          {SPACING.map((o) => (
            <Chip
              key={o}
              label={o}
              selected={spacing === o}
              onPress={() => set("spacing", o)}
            />
          ))}
        </View>
        <Text className="mt-2 text-xs text-[#8E8E93]">
          Template, font, size and spacing show in the PDF and on the website.
          The preview here doesnt change for them.
        </Text>
      </View>

      {/* Skills layout */}
      <View>
        <Heading>Skills layout</Heading>
        <View className="flex-row gap-1.5">
          <Chip
            label="Grouped"
            selected={skillsLayout === "categorized"}
            onPress={() => set("skillsLayout", "categorized")}
          />
          <Chip
            label="List"
            selected={skillsLayout === "list"}
            onPress={() => set("skillsLayout", "list")}
          />
        </View>
      </View>

      {/* Sections */}
      <View>
        <Heading>Sections</Heading>
        <View className="gap-1.5">
          {resumeSections.map((section, i) => (
            <View
              key={section.key}
              className="flex-row items-center gap-2 rounded-lg bg-[#F2F2F7] py-2 pl-2.5 pr-2 dark:bg-[#2C2C2E]"
            >
              {/* Reorder */}
              <View className="items-center">
                <Pressable
                  onPress={() => move(i, -1)}
                  disabled={i === 0}
                  hitSlop={6}
                >
                  <Ionicons
                    name="chevron-up"
                    size={18}
                    color={i === 0 ? "#C7C7CC" : "#8E8E93"}
                  />
                </Pressable>
                <Pressable
                  onPress={() => move(i, 1)}
                  disabled={i === resumeSections.length - 1}
                  hitSlop={6}
                >
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={
                      i === resumeSections.length - 1 ? "#C7C7CC" : "#8E8E93"
                    }
                  />
                </Pressable>
              </View>

              {/* Rename */}
              <BottomSheetTextInput
                value={section.label}
                onChangeText={(t) => updateSection(i, { label: t })}
                placeholder="Section title"
                placeholderTextColor="#8E8E93"
                style={{
                  flex: 1,
                  fontSize: 14,
                  paddingVertical: 6,
                  color: dark ? "#FFFFFF" : "#000000",
                  opacity: section.visible ? 1 : 0.5,
                }}
              />

              {/* Show / hide */}
              <Pressable
                onPress={() => updateSection(i, { visible: !section.visible })}
                accessibilityRole="switch"
                accessibilityState={{ checked: section.visible }}
                accessibilityLabel={`${section.label} ${
                  section.visible ? "visible" : "hidden"
                }`}
                className={`flex-row items-center gap-1.5 rounded-sm px-2.5 py-1 ${
                  section.visible
                    ? "bg-mint-soft dark:bg-mint-soft-dark"
                    : "bg-transparent"
                }`}
              >
                <Ionicons
                  name={section.visible ? "eye-outline" : "eye-off-outline"}
                  size={14}
                  color={section.visible ? "#0A7154" : "#8E8E93"}
                />
                <Text
                  className={`text-xs font-semibold ${
                    section.visible
                      ? "text-mint-ink dark:text-mint-ink-dark"
                      : "text-[#8E8E93]"
                  }`}
                >
                  {section.visible ? "Visible" : "Hidden"}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      {/* Font picker */}
      <Modal
        transparent
        animationType="fade"
        visible={fontOpen}
        onRequestClose={() => setFontOpen(false)}
      >
        <Pressable
          onPress={() => setFontOpen(false)}
          className="flex-1 justify-center bg-black/40 px-8"
        >
          <View className="overflow-hidden rounded-xl bg-white dark:bg-[#2C2C2E]">
            {FONT_FAMILIES.map((f) => (
              <Pressable
                key={f}
                onPress={() => {
                  set("fontFamily", f);
                  setFontOpen(false);
                }}
                className="flex-row items-center justify-between px-4 py-3.5"
              >
                <Text
                  className="text-[15px] text-black dark:text-white"
                  style={previewFont(f)}
                >
                  {f}
                </Text>
                {fontFamily === f && (
                  <Ionicons name="checkmark" size={18} color="#0A84FF" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </BottomSheetScrollView>
  );
}
