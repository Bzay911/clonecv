import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import chat from "@/dummydata/chatdata/chat.json";

export default function ResumeChat() {
  const dark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  return (
    <>
      <BottomSheetScrollView
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 16,
          paddingBottom: 40,
        }}
      >
        {chat.map((message) => (
          <View
            key={message.id}
            className={`max-w-[85%] rounded-lg px-3.5 py-2.5 ${
              message.role === "user"
                ? "self-end bg-sky dark:bg-sky-dark"
                : "self-start bg-[#F2F2F7] dark:bg-[#2C2C2E]"
            }`}
          >
            <Text
              className={`text-sm ${
                message.role === "user"
                  ? "text-on-sky dark:text-on-sky-dark"
                  : "text-black dark:text-white"
              }`}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </BottomSheetScrollView>

      <View
        style={{ paddingBottom: insets.bottom + 8 }}
        className="flex-row items-end gap-2 border-t border-[#E5E5EA] px-4 pt-2 dark:border-[#38383A]"
      >
        <BottomSheetTextInput
          placeholder="Ask for a change, e.g. add a metric to my last role"
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
        <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-sky dark:bg-sky-dark">
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </>
  );
}
