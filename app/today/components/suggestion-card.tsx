import type { PresentedExecutiveSuggestion } from "@/lib/executive";

export function SuggestionCard({
  suggestion,
  position,
}: {
  suggestion: PresentedExecutiveSuggestion;
  position: number;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-sm font-semibold text-slate-400">
          {position}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            {suggestion.title}
          </h2>

          <p className="mt-4 leading-7 text-slate-400">
            {suggestion.whyItMatters}
          </p>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Suggested next step
            </p>

            <p className="mt-3 leading-7 text-slate-200">
              {suggestion.suggestedNextStep}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              disabled
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-500 disabled:cursor-not-allowed"
            >
              Done
            </button>

            <button
              type="button"
              disabled
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-500 disabled:cursor-not-allowed"
            >
              Snooze
            </button>

            <details className="w-full pt-3">
              <summary className="cursor-pointer rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300">
                Why?
              </summary>

              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  {suggestion.why.headline}
                </p>

                {suggestion.why.supportingFacts.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                    {suggestion.why.supportingFacts.map((fact) => (
                      <li key={fact}>• {fact}</li>
                    ))}
                  </ul>
                ) : null}

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {suggestion.why.rationale}
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </article>
  );
}
