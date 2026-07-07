// app/forge-demo/components/recommendation-inspector.tsx
import type {
  RecommendationInspector,
  RecommendationInspectorItem,
} from "@/lib/demo/recommendation";

type RecommendationInspectorProps = {
  inspector: RecommendationInspector;
};

function formatKind(kind: RecommendationInspectorItem["kind"]): string {
  return kind
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function statusStyles(
  status: RecommendationInspectorItem["status"]
): string {
  if (status === "accepted") {
    return "border-emerald-900/70 bg-emerald-950/40 text-emerald-300";
  }

  if (status === "rejected") {
    return "border-rose-900/70 bg-rose-950/40 text-rose-300";
  }

  if (status === "expired") {
    return "border-slate-700 bg-slate-900 text-slate-400";
  }

  return "border-violet-900/70 bg-violet-950/40 text-violet-300";
}

export function RecommendationInspectorView({
  inspector,
}: RecommendationInspectorProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Recommendation Inspector
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Reviewable proposals derived from post-execution reflections.
          </p>
        </div>

        <div className="rounded-full border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
          {inspector.items.length}{" "}
          {inspector.items.length === 1
            ? "recommendation"
            : "recommendations"}
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
                    {formatKind(item.kind)} ·{" "}
                    {item.createdAt.toLocaleTimeString()}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-400">
                {item.rationale}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Source reflections: {item.sourceReflectionIds.length}
              </p>

              {item.target ? (
                <p className="mt-3 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-500">
                  Target: {item.target.type} / {item.target.id}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-500">
            No recommendations were proposed.
          </p>
        )}
      </div>
    </section>
  );
}