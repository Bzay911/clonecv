import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { useState, useEffect } from "react";

import type { SaveStatus } from "../hooks/use-autosave";

export default function SaveIndicator({
  status,
  onRetry,
}: {
  status: SaveStatus;
  onRetry: () => void;
}) {
  const dark = useColorScheme() === "dark";
  const [hidden, setHidden] = useState(false);

 useEffect(() => {
  if (status !== "saved") return;
  const t = setTimeout(() => setHidden(true), 2000);
  return () => {
    clearTimeout(t);
    setHidden(false); // reset for the next save
  };
}, [status]);

if (status === "idle" || (status === "saved" && hidden)) return null;

  if (status === "error")
    return (
      <Pressable onPress={onRetry} hitSlop={8} className="self-end">
        <Text className="text-xs text-rose-ink dark:text-rose-ink-dark">
          Couldn&apos;t save · Retry
        </Text>
      </Pressable>
    );

  if (status === "saving")
    return (
      <View className="flex-row items-center gap-1 self-end">
        <Text className="text-xs text-[#8E8E93]">Saving…</Text>
      </View>
    );

  // saved
  return (
    <View className="flex-row items-center gap-1 self-end">
      <Ionicons
        name="checkmark-circle"
        size={14}
        color={dark ? "#4ADE9B" : "#0A7154"}
      />
      <Text className="text-xs font-semibold text-mint-ink dark:text-mint-ink-dark">
        Saved
      </Text>
    </View>
  );
}