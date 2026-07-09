import { executiveSessionStore } from "@/lib/executive";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { TodayExperience } from "./components/today-experience";

export default async function TodayPage() {
  const session = executiveSessionStore.current();

  return (
    <TodayExperience
      output={session?.projection.executiveOutput}
      attention={session?.projection.executiveAttention}
    />
  );
}
