import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";
import {
  CheckCircle2,
  CircleDot,
  MessageSquare,
  NotebookText,
  PencilLine,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import {
  getObservationIconName,
  getObservationLabel,
  getObservationTone,
} from "@/lib/observation-rendering";
import { formatRelativeDate } from "@/lib/format-relative-date";

interface DefaultObservationProps {
  observation: ObservationRecord;
}

function ObservationIcon({
  name,
}: {
  name: ReturnType<typeof getObservationIconName>;
}) {
  switch (name) {
    case "status":
      return <RotateCcw className="h-4 w-4 text-white" />;

    case "task":
      return <PencilLine className="h-4 w-4 text-white" />;

    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-white" />;

    case "interaction":
      return <MessageSquare className="h-4 w-4 text-white" />;

    case "note":
      return <NotebookText className="h-4 w-4 text-white" />;

    case "summary":
      return <Sparkles className="h-4 w-4 text-white" />;

    default:
      return <CircleDot className="h-4 w-4 text-white" />;
  }
}

export function DefaultObservation({ observation }: DefaultObservationProps) {
  const iconName = getObservationIconName(observation);

  return (
    <article
      className={`rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${getObservationTone(
        observation,
      )}`}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-2">
            <ObservationIcon name={iconName} />
          </div>

          <div>
            <p className="font-medium text-white">
              {getObservationLabel(observation)}
            </p>

            <p className="mt-0.5 text-xs uppercase tracking-wide text-zinc-500">
              {formatRelativeDate(observation.createdAt)}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          {Math.round(observation.confidence * 100)}%
        </span>
      </div>

      <p className="mt-4 leading-7 text-zinc-200">
        {observation.objectValue ?? observation.objectEntityId ?? "—"}
      </p>

      <div className="mt-5 border-t border-white/5 pt-3 text-xs text-zinc-500">
        Source event: {observation.sourceEventId ?? "none yet"}
      </div>
    </article>
  );
}