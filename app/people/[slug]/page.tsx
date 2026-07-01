import { notFound } from "next/navigation"

import { getInteractionsForPerson } from "@/lib/interaction-service"
import { getPerson } from "@/lib/person-service"

interface PersonPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { slug } = await params
  const person = getPerson(slug)

  if (!person) {
    notFound()
  }

  const personInteractions = getInteractionsForPerson(person.slug)

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

      <div className="mb-6 flex flex-wrap gap-2">
        {person.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Relationship Score
          </h2>

          <p className="mt-3 font-mono text-5xl font-bold">
            {person.relationshipScore}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Last Interaction
          </h2>

          <p className="mt-3 text-2xl font-bold">
            {person.lastInteraction}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 lg:col-span-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Notes
          </h2>

          <p className="mt-3 leading-7 text-zinc-300">
            {person.notes}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Timeline
        </h2>

        <div className="space-y-4">
          {personInteractions.map((interaction) => (
            <div
              key={interaction.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">
                    {interaction.subject}
                  </p>

                  <p className="text-sm text-zinc-500">
                    {interaction.source} · {interaction.createdAt}
                  </p>
                </div>

                <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs uppercase tracking-wide text-zinc-400">
                  {interaction.sentiment}
                </span>
              </div>

              <p className="leading-7 text-zinc-300">
                {interaction.body}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {interaction.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}