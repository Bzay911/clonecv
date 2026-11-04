import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useRef, type ComponentRef } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ChatMessage } from "../types";

// "tool-updateExperience" → "Experience updated"
function toolLabel(type: string, state?: string) {
  const name = type
    .replace(/^tool-(update)?/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  if (state === "output-error") return `Couldn't update ${name.toLowerCase()}`;
  return `Update ${name} updated`;
}

// Turns a stored message into what a bubble shows: its text, plus a chip per AI edit.
function toBubble(message: ChatMessage) {
  const text = message.parts
    .filter((p) => p.type === "text" && p.text?.trim())
    .map((p) => p.text)
    .join("\n\n");
  const tools = message.parts
    .filter((p) => p.type.startsWith("tool-"))
    .map((p) => ({
      label: toolLabel(p.type, p.state),
      failed: p.state === "output-error",
    }));
  return { text, tools };
}

// Read-only for now: shows the conversation saved on the server. Sending comes later.
export default function ResumeChat({ messages }: { messages: ChatMessage[] }) {
  const dark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ComponentRef<typeof BottomSheetScrollView>>(null);

  // console.log(JSON.stringify(messages, null, 2));

  const bubbles = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ id: m.id, role: m.role, ...toBubble(m) }))
    .filter((b) => b.text || b.tools.length > 0);

  return (
    <>
      <BottomSheetScrollView
        ref={scrollRef}
        // Open on the newest message
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 16,
          paddingBottom: 40,
        }}
      >
        {bubbles.length === 0 && (
          <Text className="px-4 pt-6 text-center text-sm text-[#8E8E93]">
            No messages yet. Chat with the AI on the website to edit this
            resume, and the conversation shows here.
          </Text>
        )}

        {bubbles.map((bubble) => {
          const isUser = bubble.role === "user";
          return (
            <View
              key={bubble.id}
              className={`max-w-[85%] gap-1.5 ${isUser ? "self-end" : "self-start"}`}
            >
              {!!bubble.text && (
                <View
                  className={`rounded-lg px-3.5 py-2.5 ${
                    isUser
                      ? "bg-sky dark:bg-sky-dark"
                      : "bg-[#F2F2F7] dark:bg-[#2C2C2E]"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      isUser
                        ? "text-on-sky dark:text-on-sky-dark"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {bubble.text}
                  </Text>
                </View>
              )}
              {bubble.tools.map((tool, i) => (
                <View
                  key={i}
                  className={`flex-row items-center gap-1.5 self-start rounded-sm px-2.5 py-1 ${
                    tool.failed
                      ? "bg-rose-soft dark:bg-rose-soft-dark"
                      : "bg-mint-soft dark:bg-mint-soft-dark"
                  }`}
                >
                  <Ionicons
                    name={tool.failed ? "close" : "checkmark"}
                    size={14}
                    color={tool.failed ? "#B3263E" : "#0A7154"}
                  />
                  <Text
                    className={`text-xs font-semibold ${
                      tool.failed
                        ? "text-rose-ink dark:text-rose-ink-dark"
                        : "text-mint-ink dark:text-mint-ink-dark"
                    }`}
                  >
                    {tool.label}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </BottomSheetScrollView>

      <View
        style={{ paddingBottom: insets.bottom + 8 }}
        className="flex-row items-end gap-2 border-t border-[#E5E5EA] px-4 pt-2 dark:border-[#38383A]"
      >
        <BottomSheetTextInput
          editable={false}
          placeholder="Sending from the app is coming soon"
          placeholderTextColor="#8E8E93"
          multiline
          style={{
            flex: 1,
            maxHeight: 120,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontSize: 15,
            backgroundColor: dark ? "#2C2C2E" : "#F2F2F7",
            color: dark ? "#FFFFFF" : "#000000",
          }}
        />
        <Pressable
          disabled
          accessibilityLabel="Send"
          className="h-10 w-10 items-center justify-center rounded-full bg-sky opacity-40 dark:bg-sky-dark"
        >
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </>
  );
}
