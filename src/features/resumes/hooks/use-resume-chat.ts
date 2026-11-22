import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";

import { SITE_URL } from "@/constants/api-config";
import { authClient } from "@/lib/auth-client";

import type { ChatMessage, ResumeDetail } from "../types/types";

const transport = new DefaultChatTransport<ChatMessage>({
  api: `${SITE_URL}/api/resume/chat`,
  fetch: expoFetch as unknown as typeof globalThis.fetch,
  credentials: "omit",
  headers: async () => ({
    Cookie: await authClient.getCookie(),
  }),
});

export function useResumeChat(
  resume: ResumeDetail | undefined,
  onReplyComplete: (message: ChatMessage) => void,
) {
  return useChat<ChatMessage>({
    id: resume?.id ?? "loading-resume",
    messages: resume?.messages,
    transport,
    onFinish: ({ message, isAbort, isDisconnect, isError, finishReason }) => {
      if (isAbort || isDisconnect || isError || finishReason === "error") return;
      onReplyComplete(message);
    },
  });
}
