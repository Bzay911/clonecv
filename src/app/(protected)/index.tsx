import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [jobInput, setJobInput] = useState("");

  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const canSubmit = jobInput.trim().length > 0;

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-surface dark:bg-surface-dark"
    >
      <ScrollView
        contentContainerClassName="gap-6 px-4 pb-8 pt-3"
        keyboardShouldPersistTaps="handled"
      >
        <View className="h-11 flex-row items-center gap-2.5">
          <Image
            source={require("@/assets/images/clonecv-logo.webp")}
            style={{ width: 30, height: 32 }}
            contentFit="contain"
            accessibilityLabel="CloneCV logo"
          />
          <Text className="grow text-lg font-extrabold tracking-[-0.4px] text-ink dark:text-ink-dark">
            CloneCV
          </Text>
          <View className="h-8 justify-center rounded-full bg-surface-sunken px-3 dark:bg-surface-sunken-dark">
            <Text className="text-xs font-semibold text-ink-muted dark:text-ink-muted-dark">
              Free plan
            </Text>
          </View>
          <Link href="/account" asChild>
            <Pressable
              accessibilityLabel="Account"
              className="h-11 w-11 items-center justify-center"
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-navy">
                <Ionicons name="person" size={18} color="#FFFFFF" />
              </View>
            </Pressable>
          </Link>
        </View>

        <View className="gap-1">
          <Text className="text-xs tracking-[0.9px] text-ink-muted dark:text-ink-muted-dark">
            {today}
          </Text>
          <Text className="text-2xl font-bold tracking-[-0.6px] text-ink dark:text-ink-dark">
            Where are you applying today?
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold text-ink dark:text-ink-dark">
            Paste a job ad and we&apos;ll tailor your resume and cover letter
            for you.
          </Text>
          <TextInput
            value={jobInput}
            onChangeText={setJobInput}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Paste the full job description, inlcuding the title, company and requirements"
            placeholderClassName="text-ink-muted dark:text-ink-muted-dark"
            className="min-h-28 rounded-md border border-line-strong bg-surface-raised px-3.5 py-3 text-sm text-ink dark:border-line-strong-dark dark:bg-surface-raised-dark dark:text-ink-dark"
          />
          {/* <View>

          <Text className="text-xs text-ink-muted dark:text-ink-muted-dark">
            Just need a resume?
          </Text>
          <Pressable>
            <Text className="text-xs text-blue-500">Go to resumes</Text>
           <Ionicons name="arrow-forward" size={18} color="blue" />
          </Pressable>
          </View> */}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          className={`h-[52px] flex-row items-center justify-center gap-2 rounded-md bg-sky active:bg-sky-pressed dark:bg-sky-dark dark:active:bg-sky-pressed-dark ${
            canSubmit ? "" : "opacity-50"
          }`}
        >
          <Text className="text-sm font-semibold text-on-sky dark:text-on-sky-dark">
            Generate
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold tracking-[-0.2px] text-ink dark:text-ink-dark">
              Recent applications
            </Text>
            <Link href="/resumes" asChild>
              <Pressable className="py-3">
                <Text className="text-sm font-semibold text-sky dark:text-sky-dark">
                  See all
                </Text>
              </Pressable>
            </Link>
          </View>

          {/* Placeholder until saved resumes are wired up. */}
          <View className="items-center gap-1.5 rounded-lg border border-dashed border-line bg-surface-sunken px-4 py-7 dark:border-line-dark dark:bg-surface-sunken-dark">
            <View className="mb-1.5 h-9 w-9 items-center justify-center rounded-[10px] bg-sky-soft dark:bg-sky-soft-dark">
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#2563C9"
              />
            </View>
            <Text className="text-sm font-bold text-ink dark:text-ink-dark">
              No resumes yet
            </Text>
            <Text className="text-center text-xs text-ink-muted dark:text-ink-muted-dark">
              Resumes you tailor will show up here.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
