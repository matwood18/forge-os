// app/forge-demo/components/run-summary.tsx
import type { RunSummary } from "@/lib/demo";

type RunSummaryViewProps = {
  summary: RunSummary;
};

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

export function RunSummaryView({ summary }: RunSummaryViewProps) {
  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80">
      <div className="border-b border-slate-800 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Forge Run Summary
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-100">
          {summary.headline}
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          {summary.summary}
        </p>

        {summary.decisionOutcome ? (
          <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Primary Decision Outcome
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {summary.decisionOutcome.explanation}
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-600">
                  Noticed
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {summary.decisionOutcome.noticed.join("; ")}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-600">
                  Recommended
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {summary.decisionOutcome.recommended}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-600">
                  Authorization
                </p>

                <p className="mt-1 text-sm capitalize text-slate-400">
                  {summary.decisionOutcome.authorizationOutcome}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-600">
                  Materialized
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {summary.decisionOutcome.materialized}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
          <span>{summary.durationMs} ms total duration</span>
          <span>
            {summary.passCount}{" "}
            {pluralize(summary.passCount, "cognitive pass", "cognitive passes")}
          </span>
          <span>
            {summary.actionCount}{" "}
            {pluralize(
              summary.actionCount,
              "materialized action",
              "materialized actions"
            )}
          </span>
        </div>
      </div>

      <div className="grid gap-px bg-slate-800 md:grid-cols-2 xl:grid-cols-3">
        {summary.chainItems.map((item, index) => (
          <article key={item.id} className="bg-slate-950/70 px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
                  Step {index + 1}
                </p>

                <h3 className="mt-2 font-semibold text-slate-200">
                  {item.label}
                </h3>
              </div>

              <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-400">
                {item.count}
              </span>
            </div>

            <p className="mt-3 text-sm leading-5 text-slate-500">
              {item.description}
            </p>

            <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-slate-600">
              {item.status === "completed" ? "Completed" : "No artifacts"}
            </p>
          </article>
        ))}
      </div>

      <div className="border-t border-slate-800 bg-slate-950/40 px-6 py-4">
        <p className="text-xs leading-5 text-slate-500">
          Materialized actions represent durable intended work only. They have
          not been executed and do not imply kernel mutation.
        </p>
      </div>
    </section>
  );
}