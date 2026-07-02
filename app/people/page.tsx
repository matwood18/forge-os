import Link from "next/link";
import { Search } from "lucide-react";

import { getKernel } from "@/lib/kernel/get-kernel";

export default async function PeoplePage() {
  const forge = getKernel();
  const entities = await forge.people();

  const people = entities.filter((entity) => entity.type === "PERSON");

  return (
    <div className="max-w-7xl p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">People</h1>

        <p className="mt-2 text-zinc-400">
          People Forge has learned through conversation.
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
              <th>Type</th>
              <th>Known Since</th>
            </tr>
          </thead>

          <tbody>
            {people.map((person) => (
              <tr
                key={person.id}
                className="border-t border-zinc-800 transition hover:bg-zinc-900/60"
              >
                <td className="px-6 py-4 font-medium">
                  <Link
                    href={`/people/${person.id}`}
                    className="text-white transition hover:text-amber-400"
                  >
                    {person.displayName}
                  </Link>
                </td>

                <td className="text-zinc-400">{person.type}</td>
                <td className="text-zinc-500">
                  {person.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}

            {people.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="border-t border-zinc-800 px-6 py-10 text-center text-zinc-500"
                >
                  No people learned yet. Tell Forge about someone from the home
                  page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}