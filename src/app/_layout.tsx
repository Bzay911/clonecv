import "@/global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { data: session, isPending } = authClient.useSession();

  // Forget the previous user's data on logout.
  useEffect(() => {
    if (!isPending && !session) queryClient.clear();
  }, [isPending, session]);

  // Keep the native splash up until we know whether a session exists (cached in SecureStore).
  if (isPending) return null;

  const isLoggedIn = !!session;

  return (
    <QueryClientProvider client={queryClient}>
      {/* Needed for gestures like dragging the bottom sheet. */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <AnimatedSplashOverlay />
          {/* Screens draw their own headers; the account tab has its own Stack for its large title. */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isLoggedIn}>
              <Stack.Screen name="(protected)" />
              {/* Outside the tabs so it covers the tab bar. */}
              <Stack.Screen
                name="resume/[id]"
                options={{
                  headerShown: true,
                  title: "Resume",
                  headerBackButtonDisplayMode: "minimal",
                }}
              />
            </Stack.Protected>

            <Stack.Protected guard={!isLoggedIn}>
              <Stack.Screen name="login" />
              <Stack.Screen name="verify" />
            </Stack.Protected>
          </Stack>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
