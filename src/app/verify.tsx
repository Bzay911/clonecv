import { useLocalSearchParams } from "expo-router";

import VerifyScreen from "@/features/auth/screens/verify-screen";

export default function VerifyRoute() {
  const { email } = useLocalSearchParams<{ email: string }>();

  return <VerifyScreen email={email} />;
}
