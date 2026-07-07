// app/forge-demo/components/action-inspector.tsx
import type {
  ActionInspector,
  ActionInspectorItem,
} from "@/lib/demo/action";

type ActionInspectorProps = {
  inspector: ActionInspector;
};

function formatValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function statusStyles(status: ActionInspectorItem["status"]): string {
  if (status === "pending") {
    return "border-sky-900/70 bg-sky-950/40 text-sky-300";
  }

  if (status === "cancelled") {
    return "border-slate-700 bg-slate-900 text-slate-400";
  }

  return "border-slate-700 bg-slate-900 text-slate-400";
}

export function ActionInspectorView({
  inspector,
}: ActionInspectorProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Action Inspector
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Durable intended work materialized from authorized recommendations.
            Actions shown here have not been executed and do not imply kernel
            mutation.
          </p>
        </div>

        <div className="rounded-full border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
          {inspector.items.length}{" "}
          {inspector.items.length === 1 ? "action" : "actions"}
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
                    {formatValue(item.kind)} ·{" "}
                    {item.createdAt.toLocaleTimeString()}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles(
                    item.status
                  )}`}
                >
                  {formatValue(item.status)}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-400">
                {item.rationale}
              </p>

              <div className="mt-3 space-y-1 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                <p className="text-xs text-slate-500">
                  Recommendation: {item.recommendationId}
                </p>

                <p className="text-xs text-slate-500">
                  Authorization decision: {item.authorizationDecisionId}
                </p>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-500">
            No actions were materialized for this execution.
          </p>
        )}
      </div>
    </section>
  );
}