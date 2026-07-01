import { getInteractions } from "@/lib/interaction-service"

export default function InboxPage() {
  const interactions = getInteractions()

  return (
    <div className="max-w-7xl p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Inbox</h1>

        <p className="mt-2 text-zinc-400">
          Every incoming conversation, across every platform.
        </p>
      </div>

      <div className="space-y-4">
        {interactions.map((interaction) => (
          <div
            key={interaction.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700"
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

            <p className="leading-7 text-zinc-300">{interaction.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}