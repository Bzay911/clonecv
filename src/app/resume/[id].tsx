import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { ResumableZoom } from "react-native-zoom-toolkit";

import ResumeChat from "@/features/resumes/components/chat/resume-chat";
import ResumeDesignLayout from "@/features/resumes/components/design/resume-design";
import EditPanel from "@/features/resumes/components/edit/edit-panel";
import ResumePage, {
  PAGE_WIDTH,
} from "@/features/resumes/components/resume-page";
import { useResume } from "@/features/resumes/queries/get-resume";
import {
  saveDesignLayout,
  useSaveDesignLayout,
} from "@/features/resumes/queries/save-design-layout";
import {
  saveResumeContent,
  useSaveResumeContent,
} from "@/features/resumes/queries/save-resume-content";
import type {
  ResumeContent,
  ResumeLayout,
} from "@/features/resumes/types/types";
import { useAutosave } from "../../features/resumes/lib/use-autosave";

const TABS = ["Chat", "Edit", "Design"] as const;
type Tab = (typeof TABS)[number];

export default function ResumeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: resume, error, isLoading } = useResume(id);
  const [tab, setTab] = useState<Tab>("Chat");
  const dark = useColorScheme() === "dark";
  const { width, height } = useWindowDimensions();

  // Content edits. null = nothing edited yet, so the draft is just the server's content
  const [edits, setEdits] = useState<ResumeContent | null>(null);
  const draft = edits ?? resume?.content ?? null;

  const saveContent = useSaveResumeContent();
  const autosave = useAutosave<ResumeContent>({
    value: draft,
    flush: (content) => saveResumeContent({ id, content }),
    mutate: (content) => saveContent.mutate({ id, content }),
    state: saveContent,
  });

  // Design edits. Same idea: null = nothing changed yet
  const [layoutEdits, setLayoutEdits] = useState<ResumeLayout | null>(null);
  const layoutDraft = layoutEdits ?? resume?.designLayout ?? null;

  const saveLayout = useSaveDesignLayout();
  const layoutAutosave = useAutosave<ResumeLayout>({
    value: layoutDraft,
    flush: (designLayout) => saveDesignLayout({ id, designLayout }),
    mutate: (designLayout) => saveLayout.mutate({ id, designLayout }),
    state: saveLayout,
  });

  const onDownload = () =>
    Alert.alert("Download resume?", undefined, [
      { text: "Cancel", style: "cancel" },
      { text: "Download" },
    ]);

  if (isLoading) return <ActivityIndicator className="flex-1" />;
  if (error || !resume)
    return (
      <Text className="flex-1 p-6 text-center text-[#8E8E93]">
        {error?.message}
      </Text>
    );

  return (
    <>
      <Stack.Screen
        options={{
          title: resume.resumeName,
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
        <ResumePage
          content={draft ?? resume.content}
          layout={layoutDraft ?? resume.designLayout}
        />
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

        {tab === "Chat" && <ResumeChat messages={resume.messages} />}
        {tab === "Edit" && draft && (
          <EditPanel
            content={draft}
            onChange={setEdits}
            saveStatus={autosave.status}
            onRetry={autosave.retry}
          />
        )}
        {tab === "Design" && layoutDraft && (
          <ResumeDesignLayout
            designLayout={layoutDraft}
            onChange={setLayoutEdits}
            saveStatus={layoutAutosave.status}
            onRetry={layoutAutosave.retry}
          />
        )}
      </BottomSheet>
    </>
  );
}