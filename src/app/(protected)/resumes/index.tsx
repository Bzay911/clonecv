import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";
import { listResumes } from "@/lib/resumes";
import type { Resume } from "@/types/resume";

export default function ResumesScreen() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    listResumes().then((result) => {
      if (result.ok) setResumes(result.data);
      else if (result.error === "Unauthorized") authClient.signOut();
      else Alert.alert(result.error);
    });
  }, []);

  const closeInput = () => {
    setShowInput(false);
    setName("");
  };

  return (
    <>
      <FlatList
        data={resumes}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-[#F2F2F7] dark:bg-black"
        contentContainerClassName="px-4 pb-28 pt-3"
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Link href={`/resume/${item.id}`} asChild>
            <Pressable className="flex-row items-center gap-3 rounded-lg bg-white px-4 py-4 active:opacity-70 dark:bg-[#1C1C1E]">
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#2563C9"
              />
              <View className="flex-1">
                <Text
                  className="text-sm text-black dark:text-white"
                  numberOfLines={1}
                >
                  {item.resumeName}
                </Text>
                <Text className="text-xs text-[#8E8E93]">
                  Updated {new Date(item.updatedAt).toLocaleDateString("en-AU")}
                </Text>
              </View>
            </Pressable>
          </Link>
        )}
      />

      <Pressable
        onPress={() => setShowInput(true)}
        // Sit above the native tab bar, which covers the bottom of the screen and takes touches.
        style={{ bottom: insets.bottom + 34 }}
        className="absolute right-4 h-14 flex-row items-center gap-1.5 rounded-full bg-sky px-5 active:bg-sky-pressed dark:bg-sky-dark dark:active:bg-sky-pressed-dark"
      >
        <Ionicons name="add" size={22} color="#FFFFFF" />
        <Text className="text-sm font-semibold text-on-sky dark:text-on-sky-dark">
          Resume
        </Text>
      </Pressable>

      <Modal
        visible={showInput}
        transparent
        animationType="fade"
        onRequestClose={closeInput}
      >
        <View className="flex-1 justify-center bg-black/40 px-6">
          <View className="gap-4 rounded-lg bg-white p-5 dark:bg-[#1C1C1E]">
            <Text className="text-lg font-bold text-black dark:text-white">
              New resume
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              autoFocus
              placeholder="Resume name"
              placeholderTextColor="#8E8E93"
              className="rounded-md border border-line-strong px-3.5 py-3 text-sm text-black dark:border-line-strong-dark dark:text-white"
            />
            <View className="flex-row justify-end gap-2">
              <Pressable onPress={closeInput} className="px-4 py-2.5">
                <Text className="text-sm font-semibold text-[#8E8E93]">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                disabled={!name.trim()}
                onPress={closeInput}
                className={`rounded-md bg-sky px-4 py-2.5 dark:bg-sky-dark ${name.trim() ? "" : "opacity-50"}`}
              >
                <Text className="text-sm font-semibold text-on-sky dark:text-on-sky-dark">
                  Create
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
