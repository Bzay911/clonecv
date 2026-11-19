import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams } from "expo-router";
import { isToolUIPart } from "ai";
import { useState, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { ResumableZoom } from "react-native-zoom-toolkit";
import { useQueryClient } from "@tanstack/react-query";

import ResumeChat from "../../features/resumes/components/chat/resume-chat";
import ResumeDesignLayout from "@/features/resumes/components/design/resume-design";
import EditPanel from "@/features/resumes/components/edit/edit-panel";
import ResumePage, {
  PAGE_WIDTH,
} from "@/features/resumes/components/resume-page";
import { useResume } from "@/features/resumes/queries/get-resume";
import {
  saveDesignLayout,
  useSaveDesignLayout,
  applyLayoutToCache,
} from "@/features/resumes/queries/save-design-layout";
import {
  saveResumeContent,
  useSaveResumeContent,
} from "@/features/resumes/queries/save-resume-content";
import type {
  ChatMessage,
  ResumeContent,
  ResumeLayout,
} from "@/features/resumes/types/types";
import { findCustomSection, syncCustomSectionLayout } from "@/features/resumes/lib/custom-section-layout";
import { useResumeChat } from "@/features/resumes/lib/use-resume-chat";
import { useAutosave } from "../../features/resumes/lib/use-autosave";
import { useDownloadResumePdf } from "../../features/resumes/queries/download-resume-pdf";

const TABS = ["Chat", "Edit", "Design"] as const;
type Tab = (typeof TABS)[number];

const AI_EDIT_SECTIONS = {
  basics: "Personal information",
  experiences: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  references: "References",
  customSections: "Custom sections",
} satisfies Record<keyof ResumeContent, string>;

function isResumeSection(value: unknown): value is keyof ResumeContent {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(AI_EDIT_SECTIONS, value)
  );
}

export default function ResumeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: resume, error, isLoading } = useResume(id);
  const queryClient = useQueryClient();
  const downloadResumePdf = useDownloadResumePdf();
  const [tab, setTab] = useState<Tab>("Chat");
  const dark = useColorScheme() === "dark";
  const { width, height } = useWindowDimensions();

  // Content edits. null = nothing edited yet, so the draft is just the server's content
  const [edits, setEdits] = useState<ResumeContent | null>(null);
  const draft = edits ?? resume?.content ?? null;
  const draftAtSend = useRef<ResumeContent | null>(null);
  const [aiEditNotice, setAiEditNotice] = useState<string | null>(null);

  const saveContent = useSaveResumeContent();
  const autosave = useAutosave<ResumeContent>({
    value: draft,
    flush: (content) => saveResumeContent({ id, content }),
    mutate: (content) => saveContent.mutate({ id, content }),
    state: saveContent,
  });

  const [layoutEdits, setLayoutEdits] = useState<ResumeLayout | null>(null);
  const layoutDraft = layoutEdits ?? resume?.designLayout ?? null;

  const saveLayout = useSaveDesignLayout();
  const layoutAutosave = useAutosave<ResumeLayout>({
    value: layoutDraft,
    flush: (designLayout) =>
      saveDesignLayout({ id, designLayout }).then(() =>
        applyLayoutToCache(queryClient, id, designLayout),
      ),
    mutate: (designLayout) => saveLayout.mutate({ id, designLayout }),
    state: saveLayout, 
  });

  const updateContent = (content: ResumeContent) => {
    setEdits(content);
    if (!layoutDraft || content.customSections === draft?.customSections) return;

    const layout = syncCustomSectionLayout(
      layoutDraft,
      draft?.customSections ?? [],
      content.customSections ?? [],
    );
    if (layout !== layoutDraft) setLayoutEdits(layout);
  };

  const applyAiEdits = (message: ChatMessage) => {
    const sentDraft = draftAtSend.current;
    draftAtSend.current = null;
    if (!sentDraft || !draft) return;

    let updatedDraft = draft;
    const skippedSections = new Set<string>();

    for (const part of message.parts) {
      if (!isToolUIPart(part) || part.state !== "output-available") continue;

      const output = part.output;
      if (!output || typeof output !== "object") continue;
      if (!("section" in output) || !("data" in output)) continue;

      const { section, data } = output;
      if (!isResumeSection(section)) continue;

      // The server validates the fields. Check the expected container here.
      const validShape = section === "basics"
        ? data !== null && typeof data === "object" && !Array.isArray(data)
        : Array.isArray(data);
        
      if (!validShape) continue;

      if (JSON.stringify(draft[section]) !== JSON.stringify(sentDraft[section])) {
        skippedSections.add(AI_EDIT_SECTIONS[section]);
        continue;
      }

      updatedDraft = { ...updatedDraft, [section]: data };
    }

    if (updatedDraft !== draft) updateContent(updatedDraft);

    if (skippedSections.size) {
      setAiEditNotice(
        `Kept your changes to ${[...skippedSections].join(", ")} because you edited those sections while the assistant was replying.`,
      );
    }
  };

  const chat = useResumeChat(resume, applyAiEdits);

  const updateLayout = (layout: ResumeLayout) => {
    setLayoutEdits(layout);
    if (!draft?.customSections?.length || !layoutDraft) return;

    const titles = new Map<string, string>();
    for (const entry of layout.resumeSections) {
      const previous = layoutDraft.resumeSections.find((section) => section.key === entry.key);
      if (entry.label === previous?.label) continue;
      const section = findCustomSection(draft.customSections, entry.key);
      if (section) titles.set(section.id, entry.label);
    }
    if (!titles.size) return;

    setEdits({
      ...draft,
      customSections: draft.customSections.map((section) => {
        const title = titles.get(section.id);
        return title === undefined ? section : { ...section, title };
      }),
    });
  };

  const onDownload = () =>
    downloadResumePdf.mutate({
      id,
      name: resume?.resumeName ?? "Resume",
      // The server renders the saved copy, so push any pending edits first
      beforeDownload: async () => {
        try {
          await Promise.all([autosave.flushNow(), layoutAutosave.flushNow()]);
        } catch {
          throw new Error("Couldn't save your latest changes. Try again.");
        }
      },
    });

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
            <Pressable
              onPress={onDownload}
              disabled={downloadResumePdf.isPending}
              hitSlop={8}
            >
              {downloadResumePdf.isPending ? (
                <ActivityIndicator
                  size="small"
                  color={dark ? "#FFFFFF" : "#000000"}
                />
              ) : (
                <Ionicons
                  name="download-outline"
                  size={22}
                  color={dark ? "#FFFFFF" : "#000000"}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <ResumableZoom
        maxScale={PAGE_WIDTH / (width - 32)}
        style={{
          flex: 1,
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

        {tab === "Chat" && draft && layoutDraft && (
          <ResumeChat
            messages={chat.messages}
            busy={chat.status === "submitted" || chat.status === "streaming"}
            failed={chat.status === "error"}
            editNotice={aiEditNotice}
            onSend={(text) => {
              draftAtSend.current = draft;
              setAiEditNotice(null);
              return chat.sendMessage(
                { text, metadata: { createdAt: new Date().toISOString() } },
                {
                  body: {
                    resumeId: id,
                    content: draft,  
                    designLayout: layoutDraft,
                  },
                },
              );
            }}
          />
        )}
        {tab === "Edit" && draft && (
          <EditPanel
            content={draft}
            onChange={updateContent}
            saveStatus={autosave.status}
            onRetry={autosave.retry}
          />
        )}
        {tab === "Design" && layoutDraft && (
          <ResumeDesignLayout
            designLayout={layoutDraft}
            onChange={updateLayout}
            saveStatus={layoutAutosave.status}
            onRetry={layoutAutosave.retry}
          />
        )}
      </BottomSheet>
    </>
  );
}
