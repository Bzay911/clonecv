import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Fragment, type ComponentProps, type ReactNode } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { authClient } from '@/lib/auth-client';

type IconName = ComponentProps<typeof Ionicons>['name'];

const SECTIONS: { title: string; icon: IconName; value?: string }[][] = [
  [
    { title: 'Plan', icon: 'diamond-outline', value: 'Free' },
    { title: 'Notifications', icon: 'notifications-outline' },
  ],
  [
    { title: 'Help & Support', icon: 'help-circle-outline' },
    { title: 'Privacy Policy', icon: 'shield-checkmark-outline' },
    { title: 'Terms of Service', icon: 'document-text-outline' },
    
  ],
];



export default function AccountScreen() {
  const iconColor = useColorScheme() === 'dark' ? '#FFFFFF' : '#000000';
  const mutedColor = '#8E8E93';
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const displayName = user?.name || user?.email?.split('@')[0] || 'Your account';

  return (
    // Must be the screen's first child with automatic insets for the large title to collapse on scroll.
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-[#F2F2F7] dark:bg-black"
      contentContainerClassName="gap-8 px-4 pb-10 pt-3">
      <Card>
        <Pressable className="flex-row items-center gap-4 px-4 py-3.5 active:bg-[#E5E5EA] dark:active:bg-[#2C2C2E]">
          {user?.image ? (
            <Image
              source={user.image}
              style={{ width: 60, height: 60, borderRadius: 30 }}
              accessibilityLabel="Profile photo"
            />
          ) : (
            <View className="h-[60px] w-[60px] items-center justify-center rounded-full bg-[#E5E5EA] dark:bg-[#2C2C2E]">
              <Ionicons name="person" size={30} color={iconColor} />
            </View>
          )}
          <View className="flex-1 gap-0.5">
            <Text className="text-lg font-semibold text-black dark:text-white" numberOfLines={1}>
              {displayName}
            </Text>
            <Text className="text-xs text-[#8E8E93]" numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={mutedColor} />
        </Pressable>
      </Card>

      {SECTIONS.map((rows, i) => (
        <Card key={i}>
          {rows.map((row, j) => (
            <Fragment key={row.title}>
              {j > 0 && <View className="ml-[52px] h-px bg-[#E5E5EA] dark:bg-[#38383A]" />}
              <Pressable className="min-h-[52px] flex-row items-center gap-3 px-4 active:bg-[#E5E5EA] dark:active:bg-[#2C2C2E]">
                <Ionicons name={row.icon} size={22} color={iconColor} />
                <Text className="flex-1 text-sm text-black dark:text-white">{row.title}</Text>
                {row.value && <Text className="text-sm text-[#8E8E93]">{row.value}</Text>}
                <Ionicons name="chevron-forward" size={18} color={mutedColor} />
              </Pressable>
            </Fragment>
          ))}
        </Card>
      ))}

      <Card>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert('Log out?', 'You will need to sign in again to access your account.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log out', style: 'destructive', onPress: () => authClient.signOut() },
            ])
          }
          className="min-h-[52px] flex-row items-center gap-3 px-4 active:bg-[#E5E5EA] dark:active:bg-[#2C2C2E]">
          <Ionicons name="log-out-outline" size={22} color={iconColor} />
          <Text className="flex-1 text-sm text-black dark:text-white">Log out</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <View className="overflow-hidden rounded-xl bg-white dark:bg-[#1C1C1E]">{children}</View>
  );
}
