import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function ApplicationsScreen() {
  const [composing, setComposing] = useState(false);
  const [description, setDescription] = useState("");

  const cancel = () => {
    setComposing(false);
    setDescription("");
  };

  const canGenerate = description.trim().length > 0;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      className="flex-1 bg-[#F2F2F7] dark:bg-black"
      contentContainerClassName="flex-grow px-4 pb-28 pt-3"
    >
      {composing ? (
        <View className="gap-4">
          <View className="gap-1">
            <Text className="text-lg font-bold text-black dark:text-white">
              New application
            </Text>
            <Text className="text-sm text-[#8E8E93]">
              Found a role you like? Paste it here and get everything you need
              to apply.
            </Text>
          </View>

          <View className="gap-3 rounded-lg bg-white p-3 dark:bg-[#1C1C1E]">
            <TextInput
              value={description}
              onChangeText={setDescription}
              autoFocus
              multiline
              textAlignVertical="top"
              placeholder="Paste the full job description, including the title, company, and requirements"
              placeholderTextColor="#8E8E93"
              className="min-h-48 max-h-96 px-1 text-sm text-black dark:text-white"
            />
            <View className="flex-row items-center justify-end gap-2">
              <Pressable onPress={cancel} className="px-4 py-2.5">
                <Text className="text-sm font-semibold text-[#8E8E93]">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                disabled={!canGenerate}
                className={`flex-row items-center gap-1.5 rounded-md bg-sky px-4 py-2.5 active:bg-sky-pressed dark:bg-sky-dark dark:active:bg-sky-pressed-dark ${canGenerate ? "" : "opacity-50"}`}
              >
                <Text className="text-sm font-semibold text-on-sky dark:text-on-sky-dark">
                  Generate
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <View className="h-16 w-16 items-center justify-center rounded-lg bg-sky-soft dark:bg-sky-soft-dark">
            <Ionicons name="briefcase-outline" size={30} color="#2563C9" />
          </View>
          <View className="items-center gap-1">
            <Text className="text-lg font-bold text-black dark:text-white">
              No applications yet
            </Text>
            <Text className="text-center text-sm text-[#8E8E93]">
              Paste a job description and we&apos;ll tailor your resume and
              cover letter for it. Want to create your first one?
            </Text>
          </View>
          <Pressable
            onPress={() => setComposing(true)}
            className="flex-row items-center gap-1.5 rounded-full bg-sky px-5 py-3 active:bg-sky-pressed dark:bg-sky-dark dark:active:bg-sky-pressed-dark"
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text className="text-sm font-semibold text-on-sky dark:text-on-sky-dark">
              Create application
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
