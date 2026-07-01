import Link from "next/link"
import { Search } from "lucide-react"

import { people } from "@/lib/people"

export default function PeoplePage() {
  return (
    <div className="max-w-7xl p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">People</h1>

        <p className="mt-2 text-zinc-400">
          Every relationship you&apos;ve ever built.
        </p>
      </div>

      <div className="mb-8 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
        <Search className="h-4 w-4 text-zinc-500" />

        <input
          className="w-full bg-transparent outline-none placeholder:text-zinc-600"
          placeholder="Search people..."
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full">
          <thead className="bg-zinc-900">
            <tr className="text-left text-sm text-zinc-400">
              <th className="px-6 py-4">Name</th>
              <th>Role</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Last Interaction</th>
            </tr>
          </thead>

          <tbody>
            {people.map((person) => (
              <tr
                key={person.slug}
                className="border-t border-zinc-800 transition hover:bg-zinc-900/60"
              >
                <td className="px-6 py-4 font-medium">
                  <Link
                    href={`/people/${person.slug}`}
                    className="text-white transition hover:text-amber-400"
                  >
                    {person.name}
                  </Link>
                </td>

                <td className="text-zinc-400">{person.role}</td>
                <td className="text-zinc-400">{person.platform}</td>
                <td className="text-zinc-400">{person.status}</td>
                <td className="text-zinc-500">{person.lastInteraction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}