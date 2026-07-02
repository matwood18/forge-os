import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";
import { ArrowRight, RotateCcw } from "lucide-react";

import { formatRelativeDate } from "@/lib/format-relative-date";

interface StatusObservationProps {
  observation: ObservationRecord;
}

export function StatusObservation({ observation }: StatusObservationProps) {
  const statusValue =
    observation.objectValue ?? observation.objectEntityId ?? "Unknown";

  return (
    <article className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-2">
            <RotateCcw className="h-4 w-4 text-white" />
          </div>

          <div>
            <p className="font-medium text-white">Status Updated</p>

            <p className="mt-0.5 text-xs uppercase tracking-wide text-zinc-500">
              {formatRelativeDate(observation.createdAt)}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          {Math.round(observation.confidence * 100)}%
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-amber-400/20 bg-black/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-100/70">
          Current Status
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />

          <p className="text-lg font-semibold text-white">{statusValue}</p>

          <ArrowRight className="h-4 w-4 text-amber-100/50" />
        </div>
      </div>

      <div className="mt-5 border-t border-white/5 pt-3 text-xs text-zinc-500">
        Source event: {observation.sourceEventId ?? "none yet"}
      </div>
    </article>
  );
}