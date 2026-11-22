import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  FlatList,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { useApplications } from "@/features/applications/queries/get-applications";
import type { Application } from "@/features/applications/types/types";

const dateFormat = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
});

export default function ApplicationsScreen() {
  const dark = useColorScheme() === "dark";
  const {
    data: applications = [],
    error,
    isLoading,
    refetch,
    isRefetching,
  } = useApplications();

  return (
    <FlatList<Application>
      data={applications}
      onRefresh={refetch}
      refreshing={isRefetching}
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator className="mt-10" />
        ) : (
          <Text className="mt-10 text-center text-sm text-ink-muted dark:text-ink-muted-dark">
            {error?.message ?? "No applications yet"}
          </Text>
        )
      }
      keyExtractor={(item) => item.id}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-white dark:bg-black"
      contentContainerClassName="px-4 pb-28 pt-3"
      ItemSeparatorComponent={() => (
        <View className="h-px bg-line dark:bg-line-dark" />
      )}
      renderItem={({ item }) => (
        <View className="flex-row items-center gap-3 py-4">
          <View className="h-10 w-10 items-center justify-center rounded-sm bg-sky-soft dark:bg-sky-soft-dark">
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={dark ? "#6AAEFF" : "#2563C9"}
              accessible={false}
            />
          </View>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text
              className="text-sm font-semibold text-ink dark:text-ink-dark"
              numberOfLines={2}
            >
              {item.jobTitle || item.title || "Untitled application"}
            </Text>
            {(item.company || item.location) ? (
              <Text
                className="text-xs text-ink-muted dark:text-ink-muted-dark"
                numberOfLines={2}
              >
                {item.company ? (
                  <Text className="font-medium text-ink dark:text-ink-dark">
                    {item.company}
                  </Text>
                ) : null}
                {item.company && item.location ? "  " : ""}
                {item.location}
              </Text>
            ) : null}
          </View>
          <Text className="shrink-0 text-xs text-ink-muted dark:text-ink-muted-dark">
            {dateFormat.format(new Date(item.createdAt))}
          </Text>
        </View>
      )}
    />
  );
}
