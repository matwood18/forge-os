// app/forge-demo/components/semantic-understanding-inspector.tsx
import type { SemanticUnderstandingInspector } from "@/lib/demo/semantic-understanding";

type SemanticUnderstandingInspectorViewProps = {
  inspector: SemanticUnderstandingInspector;
};

function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function SemanticUnderstandingInspectorView({
  inspector,
}: SemanticUnderstandingInspectorViewProps) {
  return (
    <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Semantic Understanding
        </p>

        <h2 className="mt-2 text-lg font-semibold text-slate-100">
          What Forge Understood
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Real interpretation signals and semantic observations produced by the
          kernel execution path.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <h3 className="text-sm font-semibold text-slate-200">
            Semantic Signals
          </h3>

          {inspector.signals.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No semantic signals were produced.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {inspector.signals.map((signal) => (
                <article
                  key={signal.id}
                  className="rounded-md border border-slate-800 bg-slate-900 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">
                        {signal.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {signal.kind}
                      </p>
                    </div>

                    <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400">
                      {formatConfidence(signal.confidence)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {signal.summary}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <h3 className="text-sm font-semibold text-slate-200">
            Admitted Observations
          </h3>

          {inspector.observations.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No semantic observations were admitted into the world model.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {inspector.observations.map((observation) => (
                <article
                  key={observation.id}
                  className="rounded-md border border-slate-800 bg-slate-900 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">
                        {observation.predicate}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        World-model observation
                      </p>
                    </div>

                    <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400">
                      {formatConfidence(observation.confidence)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {observation.objectValue ?? "No value recorded."}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}