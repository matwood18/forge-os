// app/forge-demo/components/pass-execution-inspector.tsx
import type {
  PassExecutionInspector,
  PassExecutionInspectorItem,
} from "@/lib/demo/pass-execution";

import { formatDemoTime } from "./demo-date";

type PassExecutionInspectorProps = {
  inspector: PassExecutionInspector;
};

const ARTIFACT_LABELS: Array<{
  key: keyof PassExecutionInspectorItem["artifacts"];
  label: string;
}> = [
  { key: "reasoningSessions", label: "Reasoning" },
  { key: "observations", label: "Observations" },
  { key: "relationships", label: "Relationships" },
  { key: "memories", label: "Memories" },
  { key: "questions", label: "Questions" },
  { key: "plans", label: "Plans" },
];

function formatDuration(durationMs: number): string {
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  }

  return `${(durationMs / 1000).toFixed(2)}s`;
}

function formatPassName(passName: string): string {
  return passName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function statusStyles(status: PassExecutionInspectorItem["status"]): string {
  if (status === "completed") {
    return "border-emerald-900/70 bg-emerald-950/40 text-emerald-300";
  }

  return "border-rose-900/70 bg-rose-950/40 text-rose-300";
}

export function PassExecutionInspectorView({
  inspector,
}: PassExecutionInspectorProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Pass Execution Inspector
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Cognitive pass orchestration projected from kernel execution data.
          </p>
        </div>

        <div className="rounded-full border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
          {inspector.items.length}{" "}
          {inspector.items.length === 1 ? "pass" : "passes"}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {inspector.items.length > 0 ? (
          inspector.items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    {formatPassName(item.passName)}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatDemoTime(item.startedAt)} →{" "}
                    {formatDemoTime(item.completedAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                  <span className="rounded-full border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                    {formatDuration(item.durationMs)}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {ARTIFACT_LABELS.map(({ key, label }) => (
                  <div
                    key={key}
                    className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {item.artifacts[key]}
                    </p>
                  </div>
                ))}
              </div>

              {item.errorMessage ? (
                <p className="mt-4 rounded-lg border border-rose-900/70 bg-rose-950/30 p-3 text-sm text-rose-300">
                  {item.errorMessage}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-500">
            No pass executions were recorded.
          </p>
        )}
      </div>
    </section>
  );
}