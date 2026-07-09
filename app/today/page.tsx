import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import { buildShowcaseProjection } from "@/lib/showcase";
import { TodayExperience } from "./components/today-experience";

const todaySeedInput = `Jess is mad at me for not contacting insurance.
I need to call the dentist before Friday.
Maxx asked me to help with his project again.`;

export default async function TodayPage() {
  const execution = await new ForgeKernel().execute(todaySeedInput);
  const projection = await buildShowcaseProjection(execution);

  return <TodayExperience output={projection.executiveOutput} />;
}
