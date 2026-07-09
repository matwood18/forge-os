import type { Suggestion } from "@/lib/executive";

export function SuggestionCard({
  suggestion,
  position,
}: {
  suggestion: Suggestion;
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

            <button
              type="button"
              disabled
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-500 disabled:cursor-not-allowed"
            >
              Why?
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
