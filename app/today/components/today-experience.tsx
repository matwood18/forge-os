import { BasicExecutivePresentationProjector } from "@/lib/executive";
import type {
  ExecutiveAttentionResult,
  ExecutiveOutput,
} from "@/lib/executive";
import { ClarificationCard } from "./clarification-card";
import { SuggestionCard } from "./suggestion-card";

export function TodayExperience({
  output,
  attention,
}: {
  output?: ExecutiveOutput;
  attention?: ExecutiveAttentionResult;
}) {
  const presentedSuggestions = output
    ? new BasicExecutivePresentationProjector().project({
        suggestions: output.suggestions,
      })
    : [];

  const visibleAttention = attention?.attention ?? [];

  const hasSession = Boolean(output);
  const hasSuggestions = presentedSuggestions.length > 0;
  const hasClarifications = (output?.clarifications.length ?? 0) > 0;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Forge Today
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-tight">
            Good morning.
          </h1>

          <p className="mt-5 text-xl leading-8 text-slate-400">
            Here&apos;s what deserves your attention.
          </p>
        </header>

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Forge is watching
          </p>

          {visibleAttention.length > 0 ? (
            <div className="mt-5 space-y-3">
              {visibleAttention.map((item) => (
                <div
                  key={item.priority.priority.title}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
                >
                  <p className="font-semibold text-slate-100">
                    {item.priority.priority.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.state === "surfaced"
                      ? "Forge surfaced this because it appears important."
                      : "Forge is quietly tracking this because it may matter."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 leading-7 text-slate-400">
              Forge is not currently holding anything that needs attention.
            </p>
          )}
        </section>

        <section aria-label="What matters today" className="space-y-4">
          {!hasSession ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-lg font-semibold text-slate-100">
                Forge doesn&apos;t have an executive briefing yet.
              </p>

              <p className="mt-3 leading-7 text-slate-400">
                Run Forge from the Showcase to establish the current executive session.
              </p>
            </div>
          ) : hasSuggestions ? (
            presentedSuggestions.map((suggestion, index) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                position={index + 1}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-lg font-semibold text-slate-100">
                Nothing needs your attention right now.
              </p>

              <p className="mt-3 leading-7 text-slate-400">
                Forge didn&apos;t find anything that currently deserves attention.
              </p>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Forge needs one answer
          </p>

          <div className="mt-5 space-y-4">
            {hasClarifications ? (
              output?.clarifications.map((clarification) => (
                <ClarificationCard
                  key={clarification.id}
                  clarification={clarification}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/80 p-5">
                <p className="font-semibold text-slate-100">
                  Forge doesn&apos;t need anything from you right now.
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  No clarifications are pending.
                </p>
              </div>
            )}
          </div>
        </section>

        <footer className="mt-8 rounded-3xl border border-slate-800 bg-slate-950 p-6 text-center">
          <p className="text-sm leading-6 text-slate-500">
            {hasSuggestions
              ? "Nothing else appears urgent."
              : "Forge is quiet because nothing else appears urgent."}
          </p>
        </footer>
      </div>
    </main>
  );
}
