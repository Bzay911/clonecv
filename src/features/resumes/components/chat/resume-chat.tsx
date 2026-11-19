import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { isToolUIPart } from "ai";
import { useRef, useState, type ComponentRef } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ChatMessage } from "../../types/types";

// "tool-updateExperience" → "Experience updated"
function toolLabel(type: string, state?: string) {
  const name = type
    .replace(/^tool-(update)?/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  if (state === "output-error") return `Couldn't update ${name.toLowerCase()}`;
  return `${name} updated`;
}

// Turns a stored message into what a bubble shows: its text, plus a chip per AI edit.
function toBubble(message: ChatMessage) {
  const text = message.parts
    .flatMap((part) =>
      part.type === "text" && part.text.trim() ? [part.text] : [],
    )
    .join("\n\n");
  const tools = message.parts
    .filter(isToolUIPart)
    .filter(
      (part) =>
        part.state === "output-available" || part.state === "output-error",
    )
    .map((p) => ({
      label: toolLabel(p.type, p.state),
      failed: p.state === "output-error",
    }));
  return { text, tools };
}

type ResumeChatProps = {
  messages: ChatMessage[];
  busy: boolean;
  failed: boolean;
  editNotice: string | null;
  onSend: (text: string) => Promise<void>;
};

export default function ResumeChat({
  messages,
  busy,
  failed,
  editNotice,
  onSend,
}: ResumeChatProps) {
  const dark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ComponentRef<typeof BottomSheetScrollView>>(null);

  const [input, setInput] = useState("");
  const canSend = input.trim().length > 0 && !busy;

  const send = () => {
    if (!canSend) return;
    void onSend(input.trim());
    setInput("");
  };

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
            Ask for feedback on your resume.
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
        {busy && (
          <Text className="text-xs text-[#8E8E93]">Replying…</Text>
        )}
        {failed && (
          <Text
            accessibilityRole="alert"
            className="text-sm text-rose-ink dark:text-rose-ink-dark"
          >
            The reply couldn’t be loaded. Try sending your message again.
          </Text>
        )}
        {editNotice && (
          <Text accessibilityRole="alert" className="text-sm text-[#8E8E93]">
            {editNotice}
          </Text>
        )}
      </BottomSheetScrollView>

      <View
        style={{ paddingBottom: insets.bottom + 8 }}
        className="flex-row items-end gap-2 border-t border-[#E5E5EA] px-4 pt-2 dark:border-[#38383A]"
      >
        <BottomSheetTextInput
          value={input}
          onChangeText={setInput}
          placeholder="Message the resume assistant"
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
          disabled={!canSend}
          onPress={send}
          accessibilityLabel="Send"
          accessibilityState={{ disabled: !canSend }}
          className={`h-10 w-10 items-center justify-center rounded-full bg-sky dark:bg-sky-dark ${
            canSend ? "" : "opacity-40"
          }`}
        >
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </>
  );
}
