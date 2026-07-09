import { executiveSessionStore } from "@/lib/executive";
import { TodayExperience } from "./components/today-experience";

export default async function TodayPage() {
  const session = executiveSessionStore.current();

  return <TodayExperience output={session?.projection.executiveOutput} />;
}
