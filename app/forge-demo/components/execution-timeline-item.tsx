// app/forge-demo/components/execution-timeline-item.tsx
import type { ExecutionTimelineItem } from "@/lib/demo";

import { formatDemoTime } from "./demo-date";

type ExecutionTimelineItemViewProps = {
  item: ExecutionTimelineItem;
};

const KIND_LABELS: Record<string, string> = {
  input: "Input",
  event: "Event",
  observation: "Observation",
  relationship: "Relationship",
  memory: "Memory",
  reasoning: "Reasoning",
  question: "Question",
  unknown: "Unknown",
};

export function ExecutionTimelineItemView({
  item,
}: ExecutionTimelineItemViewProps) {
  const metadataEntries = Object.entries(item.metadata);

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            #{item.sequence} · {KIND_LABELS[item.kind]}
          </p>

          <h3 className="mt-1 text-sm font-semibold text-slate-100">
            {item.title}
          </h3>
        </div>

        <time className="text-xs text-slate-600">
          {formatDemoTime(item.occurredAt)}
        </time>
      </div>

      <p className="mt-2 text-sm text-slate-400">{item.summary}</p>

      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Inspector
        </p>

        <dl className="mt-2 grid gap-2 text-xs">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Step Type</dt>
            <dd className="text-right text-slate-400">{item.type}</dd>
          </div>

          {metadataEntries.map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <dt className="text-slate-500">{key}</dt>
              <dd className="text-right text-slate-400">{String(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}