import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";
import { MessageSquare } from "lucide-react";

import { formatRelativeDate } from "@/lib/format-relative-date";

interface InteractionObservationProps {
  observation: ObservationRecord;
}

export function InteractionObservation({
  observation,
}: InteractionObservationProps) {
  return (
    <article className="rounded-xl border border-purple-400/40 bg-purple-400/10 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-2">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>

          <div>
            <p className="font-medium text-white">Interaction</p>

            <p className="mt-0.5 text-xs uppercase tracking-wide text-zinc-500">
              {formatRelativeDate(observation.createdAt)}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          {Math.round(observation.confidence * 100)}%
        </span>
      </div>

      <p className="mt-4 leading-7 text-zinc-100">
        {observation.objectValue ?? observation.objectEntityId ?? "—"}
      </p>

      <div className="mt-5 rounded-lg border border-purple-400/20 bg-black/10 p-3 text-xs text-purple-100/80">
        Recorded as a relationship interaction.
      </div>

      <div className="mt-5 border-t border-white/5 pt-3 text-xs text-zinc-500">
        Source event: {observation.sourceEventId ?? "none yet"}
      </div>
    </article>
  );
}