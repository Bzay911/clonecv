import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, useColorScheme, View } from "react-native";

import type { SaveStatus } from "./use-autosave";

export default function SaveIndicator({
  status,
  onRetry,
}: {
  status: SaveStatus;
  onRetry: () => void;
}) {
  const dark = useColorScheme() === "dark";

  if (status === "idle") return null;

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