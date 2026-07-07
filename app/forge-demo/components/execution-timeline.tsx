// app/forge-demo/components/execution-timeline.tsx
import type { ExecutionTimeline } from "@/lib/demo";

type ExecutionTimelineProps = {
  timeline: ExecutionTimeline;
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
          <article
            key={item.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
          >
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
                {item.occurredAt.toLocaleTimeString()}
              </time>
            </div>

            <p className="mt-2 text-sm text-slate-400">{item.summary}</p>

            <p className="mt-3 text-xs text-slate-600">{item.type}</p>
          </article>
        ))}
      </div>
    </section>
  );
}