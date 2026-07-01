import Link from "next/link"

import { getPerson } from "@/lib/person-service"
import { getTasks } from "@/lib/task-service"

export default function TasksPage() {
  const tasks = getTasks()

  return (
    <div className="max-w-7xl p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Tasks</h1>

        <p className="mt-2 text-zinc-400">
          Follow-ups and relationship actions you don&apos;t want to forget.
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => {
          const person = getPerson(task.personSlug)

          return (
            <div
              key={task.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{task.title}</p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {person ? (
                      <Link
                        href={`/people/${person.slug}`}
                        className="transition hover:text-amber-400"
                      >
                        {person.name}
                      </Link>
                    ) : (
                      "Unknown person"
                    )}{" "}
                    · Due {task.dueDate}
                  </p>
                </div>

                <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs uppercase tracking-wide text-zinc-400">
                  {task.priority}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}