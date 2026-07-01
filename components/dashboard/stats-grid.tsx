import {
  Inbox,
  SquareCheckBig,
  UserRoundCheck,
  Users,
} from "lucide-react"

import StatCard from "./stat-card"

const dashboardStats = [
  {
    title: "People",
    value: 0,
    description: "Tracked relationships",
    icon: Users,
  },
  {
    title: "Needs Attention",
    value: 0,
    description: "Priority conversations",
    icon: UserRoundCheck,
  },
  {
    title: "Open Tasks",
    value: 0,
    description: "Follow-ups waiting",
    icon: SquareCheckBig,
  },
  {
    title: "Unread Messages",
    value: 0,
    description: "Across all sources",
    icon: Inbox,
  },
]

export default function StatsGrid() {
  return (
    <div className="grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </div>
  )
}