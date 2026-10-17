import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type Mode = 'job' | 'resume';

const MODES = [
  { value: 'job', label: 'Job application' },
  { value: 'resume', label: 'Resume only' },
] as const;

export default function HomeScreen() {
  // Icons and the placeholder take colour props, not classes, so they still read the theme.
  const colors = useTheme();
  const [mode, setMode] = useState<Mode>('job');
  const [jobInput, setJobInput] = useState('');

  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const canSubmit = jobInput.trim().length > 0;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-surface dark:bg-surface-dark">
      <ScrollView
        contentContainerClassName="gap-6 px-4 pb-8 pt-3"
        keyboardShouldPersistTaps="handled">
        <View className="h-11 flex-row items-center gap-2.5">
          <Image
            source={require('@/assets/images/clonecv-logo.webp')}
            style={{ width: 30, height: 32 }}
            contentFit="contain"
            accessibilityLabel="CloneCV logo"
          />
          <Text className="grow text-[19px] font-extrabold tracking-[-0.4px] text-ink dark:text-ink-dark">
            CloneCV
          </Text>
          <View className="h-8 justify-center rounded-full bg-surface-sunken px-3 dark:bg-surface-sunken-dark">
            <Text className="text-xs font-semibold text-ink-muted dark:text-ink-muted-dark">
              Free plan
            </Text>
          </View>
          <Link href="/profile" asChild>
            <Pressable accessibilityLabel="Account" className="h-11 w-11 items-center justify-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-navy">
                <SymbolView
                  name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                  size={18}
                  tintColor={colors.onNavy}
                />
              </View>
            </Pressable>
          </Link>
        </View>

        <View className="gap-1">
          <Text className="text-[11px] font-bold uppercase leading-4 tracking-[0.9px] text-ink-muted dark:text-ink-muted-dark">
            {today}
          </Text>
          <Text className="text-[30px] font-bold leading-[38px] tracking-[-0.6px] text-ink dark:text-ink-dark">
            Where are you applying today?
          </Text>
        </View>

        <View
          accessibilityRole="tablist"
          className="flex-row gap-1 rounded-md bg-surface-sunken p-1 dark:bg-surface-sunken-dark">
          {MODES.map((option) => {
            const selected = mode === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setMode(option.value)}
                className={`h-10 flex-1 items-center justify-center rounded-[9px] ${
                  // Always set a shadow class: NativeWind remounts (and crashes in dev) if
                  // shadow variables appear after the first render.
                  selected ? 'bg-surface-raised shadow-sm dark:bg-surface-raised-dark' : 'shadow-none'
                }`}>
                <Text
                  className={`text-sm font-semibold ${
                    selected
                      ? 'text-ink dark:text-ink-dark'
                      : 'text-ink-muted dark:text-ink-muted-dark'
                  }`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold leading-5 text-ink dark:text-ink-dark">
            Job link or description
          </Text>
          <TextInput
            value={jobInput}
            onChangeText={setJobInput}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Paste a SEEK, LinkedIn or Indeed link, or the full job description"
            placeholderTextColor={colors.textSecondary}
            className="min-h-28 rounded-md border border-line-strong bg-surface-raised px-3.5 py-3 text-[15px] leading-[22px] text-ink dark:border-line-strong-dark dark:bg-surface-raised-dark dark:text-ink-dark"
          />
          <Text className="text-[13px] leading-5 text-ink-muted dark:text-ink-muted-dark">
            Works with SEEK, LinkedIn, Indeed and most job pages.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          className={`h-[52px] flex-row items-center justify-center gap-2 rounded-md bg-sky active:bg-sky-pressed dark:bg-sky-dark dark:active:bg-sky-pressed-dark ${
            canSubmit ? '' : 'opacity-50'
          }`}>
          <Text className="text-base font-semibold text-on-sky dark:text-on-sky-dark">
            {mode === 'job' ? 'Tailor my application' : 'Tailor my resume'}
          </Text>
          <SymbolView
            name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            size={18}
            tintColor={colors.onSky}
          />
        </Pressable>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold leading-[26px] tracking-[-0.2px] text-ink dark:text-ink-dark">
              Recent resumes
            </Text>
            <Link href="/resumes" asChild>
              <Pressable className="py-3">
                <Text className="text-sm font-semibold text-sky dark:text-sky-dark">See all</Text>
              </Pressable>
            </Link>
          </View>

          {/* Placeholder until saved resumes are wired up. */}
          <View className="items-center gap-1.5 rounded-lg border border-dashed border-line bg-surface-sunken px-4 py-7 dark:border-line-dark dark:bg-surface-sunken-dark">
            <View className="mb-1.5 h-9 w-9 items-center justify-center rounded-[10px] bg-sky-soft dark:bg-sky-soft-dark">
              <SymbolView
                name={{ ios: 'doc.text', android: 'description', web: 'description' }}
                size={18}
                tintColor={colors.sky}
              />
            </View>
            <Text className="text-[15px] font-bold leading-[22px] text-ink dark:text-ink-dark">
              No resumes yet
            </Text>
            <Text className="text-center text-[13px] leading-5 text-ink-muted dark:text-ink-muted-dark">
              Resumes you tailor will show up here.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
