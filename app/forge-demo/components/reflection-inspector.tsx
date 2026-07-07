// app/forge-demo/components/reflection-inspector.tsx
import type {
  ReflectionInspector,
  ReflectionInspectorItem,
} from "@/lib/demo/reflection";

import { formatDemoTime } from "./demo-date";

type ReflectionInspectorProps = {
  inspector: ReflectionInspector;
};

function formatKind(kind: ReflectionInspectorItem["kind"]): string {
  return kind
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function severityStyles(
  severity: ReflectionInspectorItem["severity"]
): string {
  if (severity === "critical") {
    return "border-rose-900/70 bg-rose-950/40 text-rose-300";
  }

  if (severity === "warning") {
    return "border-amber-900/70 bg-amber-950/40 text-amber-300";
  }

  return "border-sky-900/70 bg-sky-950/40 text-sky-300";
}

export function ReflectionInspectorView({
  inspector,
}: ReflectionInspectorProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Reflection Inspector
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Execution-level reflections generated after the cognitive trace is complete.
          </p>
        </div>

        <div className="rounded-full border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
          {inspector.items.length}{" "}
          {inspector.items.length === 1 ? "reflection" : "reflections"}
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
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatKind(item.kind)} · {formatDemoTime(item.createdAt)}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${severityStyles(
                    item.severity
                  )}`}
                >
                  {item.severity}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-400">{item.summary}</p>

              {item.target ? (
                <p className="mt-3 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-500">
                  Target: {item.target.type} / {item.target.id}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-500">
            No reflections were recorded.
          </p>
        )}
      </div>
    </section>
  );
}