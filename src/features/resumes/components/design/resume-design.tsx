import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Sortable, { type SortableGridRenderItem } from "react-native-sortables";

import SaveIndicator from "../save-indicator";
import type { SaveStatus } from "../../hooks/use-autosave";
import type { ResumeLayout } from "../../types/types";
import { defaultSectionLabel } from "../../lib/clean-layout";
import { FONT_SIZES, SPACING } from "./design-constants";
import FontPicker from "./font-picker";
import { TEMPLATES, TEMPLATE_THUMNAILS } from "./template-thumbnails";

type Section = ResumeLayout["resumeSections"][number];

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

  // Update by key, not index: rows change position when dragged
  const updateSection = (key: string, patch: Partial<Section>) =>
    set(
      "resumeSections",
      resumeSections.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    );

  // How one draggable row looks
  const renderSection: SortableGridRenderItem<Section> = useCallback(
    ({ item: section }) => (
      <View className="flex-row items-center gap-2 rounded-lg bg-[#F2F2F7] py-2 pl-2.5 pr-2 dark:bg-[#2C2C2E]">
        <Ionicons name="reorder-three" size={22} color="#8E8E93" />

        <BottomSheetTextInput
          value={section.label}
          onChangeText={(t) => updateSection(section.key, { label: t })}
          onBlur={() => {
            const cleaned =
              section.label.trim() || defaultSectionLabel(section.key);
            if (cleaned !== section.label)
              updateSection(section.key, { label: cleaned });
          }}
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

        <Pressable
          onPress={() =>
            updateSection(section.key, { visible: !section.visible })
          }
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
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [designLayout, dark],
  );

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
        <FontPicker value={fontFamily} onChange={(f) => set("fontFamily", f)} />
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
          The preview here doesn&apos;t change for them.
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
        <Text className="text-sm font-semibold text-black dark:text-white">
          Sections
        </Text>
        <Text className="mb-2 mt-0.5 text-xs text-[#8E8E93]">
          Drag a section to reorder it. Tap the eye to show or hide it.
        </Text>

        <Sortable.Grid
          columns={1}
          rowGap={6}
          data={resumeSections}
          keyExtractor={(s) => s.key}
          renderItem={renderSection}
          onDragEnd={({ data }) => set("resumeSections", data)}
        />
      </View>
    </BottomSheetScrollView>
  );
}