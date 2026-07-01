import {
  Inbox,
  SquareCheckBig,
  UserRoundCheck,
  Users,
} from "lucide-react"

import { getInteractions } from "@/lib/interaction-service"
import { getPeople } from "@/lib/person-service"
import StatCard from "./stat-card"

export default function StatsGrid() {
  const people = getPeople()
  const interactions = getInteractions()

  const dashboardStats = [
    {
      title: "People",
      value: people.length,
      description: "Tracked relationships",
      icon: Users,
    },
    {
      title: "Needs Attention",
      value: interactions.filter(
        (interaction) => interaction.sentiment === "positive"
      ).length,
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
      value: interactions.length,
      description: "Across all sources",
      icon: Inbox,
    },
  ]

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