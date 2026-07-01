import DashboardHeader from "@/components/dashboard/dashboard-header"
import StatsGrid from "@/components/dashboard/stats-grid"

export default function Home() {
  return (
    <div className="p-10">
      <DashboardHeader />
      <StatsGrid />
    </div>
  )
}