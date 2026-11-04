import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCreateResume } from "@/features/resumes/queries/create-resume";
import { useDeleteResume } from "@/features/resumes/queries/delete-resume";
import { useDuplicateResume } from "@/features/resumes/queries/duplicate-resume";
import { useResumes } from "@/features/resumes/queries/get-resumes";
import { useRenameResume } from "@/features/resumes/queries/rename-resume";
import type { Resume } from "@/features/resumes/types";

export default function ResumesScreen() {
  const {
    data: resumes = [],
    error,
    isLoading,
    refetch,
    isRefetching,
  } = useResumes();

  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");
  // null = the pop-up creates a resume; an id = it renames that resume
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const createResume = useCreateResume();
  const renameResume = useRenameResume();
  const duplicateResume = useDuplicateResume();
  const deleteResume = useDeleteResume();

  // Whichever mutation the pop-up is currently doing (for "Saving…" and errors)
  const saving = renamingId ? renameResume : createResume;

  const closeInput = () => {
    setShowInput(false);
    setName("");
    setRenamingId(null);
    createResume.reset(); // clear any old error next time the pop-up opens
    renameResume.reset();
  };

  // Handles both create and rename
  const onSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed || saving.isPending) return;

    if (renamingId) {
      renameResume.mutate(
        { id: renamingId, name: trimmed },
        { onSuccess: closeInput },
      );
    } else {
      createResume.mutate(trimmed, {
        onSuccess: ({ id }) => {
          closeInput();
          router.push(`/resume/${id}`); // open the new resume straight away
        },
      });
    }
  };

  const canSubmit = !!name.trim() && !saving.isPending;

  // The resume a duplicate/delete is running on, so its row can dim
  const busyId =
    (duplicateResume.isPending && duplicateResume.variables) ||
    (deleteResume.isPending && deleteResume.variables) ||
    null;

  const openMenu = (item: Resume) => {
    const rename = () => {
      setRenamingId(item.id);
      setName(item.resumeName);
      setShowInput(true);
    };
    const duplicate = () =>
      duplicateResume.mutate(item.id, {
        onError: (e) => Alert.alert("Couldn't duplicate", e.message),
      });
    const confirmDelete = () =>
      Alert.alert(`Delete "${item.resumeName}"?`, "This can't be undone.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteResume.mutate(item.id, {
              onError: (e) => Alert.alert("Couldn't delete", e.message),
            }),
        },
      ]);

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: item.resumeName,
          options: ["Rename", "Duplicate", "Delete", "Cancel"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 3,
        },
        (index) => [rename, duplicate, confirmDelete][index]?.(),
      );
    } else {
      Alert.alert(
        item.resumeName,
        undefined,
        [
          { text: "Rename", onPress: rename },
          { text: "Duplicate", onPress: duplicate },
          { text: "Delete", style: "destructive", onPress: confirmDelete },
        ],
        { cancelable: true },
      );
    }
  };

  return (
    <>
      <FlatList
        data={resumes}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator className="mt-10" />
          ) : error ? (
            <Text className="mt-10 text-center text-[#8E8E93]">
              {error.message}
            </Text>
          ) : null
        }
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-[#F2F2F7] dark:bg-black"
        contentContainerClassName="px-4 pb-28 pt-3"
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Link href={`/resume/${item.id}`} asChild>
            <Pressable
              onLongPress={() => openMenu(item)}
              disabled={busyId === item.id}
              className={`flex-row items-center gap-3 rounded-lg bg-white px-4 py-4 active:opacity-70 dark:bg-[#1C1C1E] ${busyId === item.id ? "opacity-40" : ""}`}
            >
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
              <Pressable
                onPress={() => openMenu(item)}
                hitSlop={10}
                accessibilityLabel={`Options for ${item.resumeName}`}
                className="h-8 w-8 items-center justify-center rounded-full active:bg-[#E5E5EA] dark:active:bg-[#2C2C2E]"
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={18}
                  color="#8E8E93"
                />
              </Pressable>
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
              {renamingId ? "Rename resume" : "New resume"}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              placeholder="Resume name"
              placeholderTextColor="#8E8E93"
              className="rounded-md border border-line-strong px-3.5 py-3 text-sm text-black dark:border-line-strong-dark dark:text-white"
            />
            {saving.error && (
              <Text className="text-xs text-rose-ink dark:text-rose-ink-dark">
                {saving.error.message}
              </Text>
            )}
            <View className="flex-row justify-end gap-2">
              <Pressable onPress={closeInput} className="px-4 py-2.5">
                <Text className="text-sm font-semibold text-[#8E8E93]">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                disabled={!canSubmit}
                onPress={onSubmit}
                className={`rounded-md bg-sky px-4 py-2.5 dark:bg-sky-dark ${canSubmit ? "" : "opacity-50"}`}
              >
                <Text className="text-sm font-semibold text-on-sky dark:text-on-sky-dark">
                  {saving.isPending
                    ? renamingId
                      ? "Saving…"
                      : "Creating…"
                    : renamingId
                      ? "Save"
                      : "Create"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
