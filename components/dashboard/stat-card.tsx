import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: number | string
  description: string
  icon: LucideIcon
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 transition-all duration-200 hover:border-zinc-700 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
          {title}
        </CardTitle>

        <Icon className="h-4 w-4 text-zinc-500" />
      </CardHeader>

      <CardContent>
        <div
          className="text-5xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {value}
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}