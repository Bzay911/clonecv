import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { ResumableZoom } from "react-native-zoom-toolkit";

import EditPanel from "@/components/resume/edit-panel";
import ResumeChat from "@/components/resume/resume-chat";
import ResumePage, { PAGE_WIDTH } from "@/components/resume/resume-page";

const TABS = ["Chat", "Edit", "Design"] as const;
type Tab = (typeof TABS)[number];

export default function ResumeDetailScreen() {
  const [tab, setTab] = useState<Tab>("Chat");
  const dark = useColorScheme() === "dark";
  const { width, height } = useWindowDimensions();

  const onDownload = () =>
    Alert.alert("Download resume?", undefined, [
      { text: "Cancel", style: "cancel" },
      { text: "Download" },
    ]);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={onDownload} hitSlop={8}>
              <Ionicons
                name="download-outline"
                size={22}
                color={dark ? "#FFFFFF" : "#000000"}
              />
            </Pressable>
          ),
        }}
      />
      <ResumableZoom
        // Stop at the page's real size; zooming past it stretches the text and blurs it.
        maxScale={PAGE_WIDTH / (width - 32)}
        style={{
          flex: 1,
          // Keep the page clear of the collapsed sheet (its 15% snap point).
          marginBottom: height * 0.15,
          backgroundColor: dark ? "#000000" : "#F2F2F7",
        }}
      >
        <ResumePage />
      </ResumableZoom>

      <BottomSheet
        snapPoints={["15%", "50%", "90%"]}
        backgroundStyle={{ backgroundColor: dark ? "#1C1C1E" : "#FFFFFF" }}
        handleIndicatorStyle={{ backgroundColor: "#8E8E93" }}
        enableDynamicSizing={false}
        keyboardBlurBehavior="restore"
      >
        <View className="px-4 pb-3">
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
        </View>

        {tab === "Chat" && <ResumeChat />}
        {tab === "Edit" && <EditPanel />}
      </BottomSheet>
    </>
  );
}
