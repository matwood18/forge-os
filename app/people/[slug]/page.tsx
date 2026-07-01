import { notFound } from "next/navigation"
import { people } from "@/lib/people"

interface PersonPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { slug } = await params
  const person = people.find((item) => item.slug === slug)

  if (!person) {
    notFound()
  }

  return (
    <div className="max-w-7xl p-10">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-amber-400">
          {person.status}
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          {person.name}
        </h1>

        <p className="mt-2 text-zinc-400">
          {person.role} · {person.platform}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Last Interaction
          </h2>

          <p className="mt-3 text-2xl font-bold">
            {person.lastInteraction}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 lg:col-span-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Notes
          </h2>

          <p className="mt-3 leading-7 text-zinc-300">
            {person.notes}
          </p>
        </div>
      </div>
    </div>
  )
}