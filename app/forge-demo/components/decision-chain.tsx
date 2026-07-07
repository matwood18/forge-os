import type { DecisionChainProjection } from "@/lib/demo";

type DecisionChainViewProps = {
  projection: DecisionChainProjection;
};

export function DecisionChainView({
  projection,
}: DecisionChainViewProps) {
  return (
    <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Decision Chain
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-100">
          Why Forge created this action
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Forge connects materialized intended work to the reflections,
          recommendations, and authorization decisions that caused it.
        </p>
      </div>

      {projection.items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No complete materialized decision chains were produced for this run.
        </p>
      ) : (
        <div className="space-y-6">
          {projection.items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-slate-800 bg-slate-950/50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-100">
                {item.headline}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.explanation}
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-slate-800 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Forge noticed
                  </p>

                  <div className="mt-2 space-y-3">
                    {item.reflections.map((reflection) => (
                      <div key={reflection.id}>
                        <p className="text-sm font-medium text-slate-200">
                          {reflection.title}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {reflection.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Therefore Forge recommended
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-200">
                    {item.recommendation.title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.recommendation.rationale}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Policy evaluation
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-200">
                    {item.authorizationDecision.outcome}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.authorizationDecision.rationale}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Forge materialized
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-200">
                    {item.action.title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.action.rationale}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Status: {item.action.status}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}