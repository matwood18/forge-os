import { Bell, Search } from "lucide-react"

export default function AppHeader() {
  return (
    <header className="fixed left-64 right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 text-white backdrop-blur">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-500">
        <Search className="h-4 w-4" />
        <span>Search Forge...</span>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="h-5 w-5 text-zinc-400" />
        <div className="rounded-full bg-zinc-800 px-3 py-1 text-sm">
          Madison
        </div>
      </div>
    </header>
  )
}