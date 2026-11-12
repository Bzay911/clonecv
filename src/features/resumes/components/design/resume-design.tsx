import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import type { ResumeLayout } from "../../types/types";
import { TEMPLATES, TEMPLATE_THUMNAILS } from "./template-thumbnails";

function Heading({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-sm font-semibold text-black dark:text-white">
      {children}
    </Text>
  );
}

function Chip({ label, selected }: { label: string; selected: boolean }) {
  return (
    <View
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
    </View>
  );
}

// Read-only for now: shows the design settings saved on the server. Editing comes later.
export default function ResumeDesignLayout({
  designLayout,
}: {
  designLayout: ResumeLayout;
}) {
  const insets = useSafeAreaInsets();
  const {
    template,
    fontFamily,
    fontSize,
    spacing,
    skillsLayout,
    resumeSections,
  } = designLayout;

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        gap: 20,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: insets.bottom + 40,
      }}
    >
      {/* Template */}
      <View>
        <Heading>Template</Heading>
        <View className="flex-row gap-1.5">
          {TEMPLATES.map((t) => {
            const selected = template === t;
            return (
              <View
                key={t}
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
              </View>
            );
          })}
        </View>
      </View>

      {/* Font */}
      <View>
        <Heading>Font</Heading>
        <View className="h-10 justify-center rounded-lg bg-[#F2F2F7] px-3.5 dark:bg-[#2C2C2E]">
          <Text className="text-[15px] text-black dark:text-white">
            {fontFamily}
          </Text>
        </View>
      </View>

      {/* Size */}
      <View>
        <Heading>Size</Heading>
        <View className="flex-row gap-1.5">
          {["Small", "Medium", "Large"].map((o) => (
            <Chip key={o} label={o} selected={fontSize === o} />
          ))}
        </View>
      </View>

      {/* Spacing */}
      <View>
        <Heading>Spacing</Heading>
        <View className="flex-row gap-1.5">
          {["Compact", "Normal", "Relaxed"].map((o) => (
            <Chip key={o} label={o} selected={spacing === o} />
          ))}
        </View>
      </View>

      {/* Skills layout */}
      <View>
        <Heading>Skills layout</Heading>
        <View className="flex-row gap-1.5">
          <Chip label="Grouped" selected={skillsLayout === "categorized"} />
          <Chip label="List" selected={skillsLayout === "list"} />
        </View>
      </View>

      {/* Sections */}
      <View>
        <Heading>Sections</Heading>
        <View className="gap-1.5">
          {resumeSections.map((section) => (
            <View
              key={section.key}
              className="flex-row items-center justify-between rounded-lg bg-[#F2F2F7] px-3.5 py-3 dark:bg-[#2C2C2E]"
            >
              <Text
                className={`text-sm ${
                  section.visible
                    ? "text-black dark:text-white"
                    : "text-[#8E8E93]"
                }`}
              >
                {section.label}
              </Text>
              <View
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
              </View>
            </View>
          ))}
        </View>
      </View>
    </BottomSheetScrollView>
  );
}
