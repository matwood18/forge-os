import DashboardHeader from "@/components/dashboard/dashboard-header";
import StatsGrid from "@/components/dashboard/stats-grid";
import Conversation from "@/components/conversation/conversation";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-10">
      <DashboardHeader />
      <Conversation />
      <StatsGrid />
    </div>
  );
}