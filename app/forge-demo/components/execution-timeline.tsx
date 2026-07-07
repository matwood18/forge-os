// app/forge-demo/components/execution-timeline.tsx
import type { ExecutionTimeline } from "@/lib/demo";

import { ExecutionTimelineItemView } from "./execution-timeline-item";

type ExecutionTimelineProps = {
  timeline: ExecutionTimeline;
};

export function ExecutionTimelineView({ timeline }: ExecutionTimelineProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Execution Timeline
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-slate-100">
          Cognitive Trace
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {timeline.items.length} timeline{" "}
          {timeline.items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="space-y-3">
        {timeline.items.map((item) => (
          <ExecutionTimelineItemView key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}