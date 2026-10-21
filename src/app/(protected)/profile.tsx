import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();
  console.log(session)

  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <Text>{session?.user.email}</Text>
      {/* signOut clears the SecureStore session; Stack.Protected in _layout then shows login. */}
      <Pressable accessibilityRole="button" onPress={() => authClient.signOut()}>
        <Text>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}
