import { useLocalSearchParams } from "expo-router";

import ResumeDetailScreen from "@/features/resumes/screens/resume-detail-screen";

export default function ResumeDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ResumeDetailScreen id={id} />;
}
