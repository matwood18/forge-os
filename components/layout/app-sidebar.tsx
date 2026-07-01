"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  Inbox,
  Package,
  Settings,
  SquareCheckBig,
  Users,
} from "lucide-react";

import { navigationItems } from "@/lib/kernel/registry/navigation";

const iconMap = {
  dashboard: Home,
  people: Users,
  inbox: Inbox,
  tasks: SquareCheckBig,
  products: Package,
  analytics: BarChart3,
  settings: Settings,
};

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-zinc-800 bg-zinc-950 p-4 text-white">
      <div className="mb-8">
        <div className="text-xl font-bold tracking-tight">Forge</div>
        <div className="text-sm text-zinc-500">Relationship OS</div>
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.id as keyof typeof iconMap] ?? Home;

          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
              ].join(" ")}
            >
              <Icon
                className={[
                  "h-4 w-4",
                  isActive ? "text-amber-400" : "text-zinc-500",
                ].join(" ")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}