import type { ClarificationRequest } from "@/lib/executive";

export function ClarificationCard({
  clarification,
}: {
  clarification: ClarificationRequest;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
      <h2 className="text-xl font-semibold text-slate-100">
        {clarification.question}
      </h2>

      <p className="mt-3 leading-7 text-slate-400">
        {clarification.whyForgeIsAsking}
      </p>

      {clarification.answerChoices.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {clarification.answerChoices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              disabled
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-500 disabled:cursor-not-allowed"
            >
              {choice.label}
            </button>
          ))}
        </div>
      ) : null}

      {clarification.allowsFreeFormAnswer ? (
        <p className="mt-4 text-sm text-slate-500">
          Free-form answers will be supported in a later ticket.
        </p>
      ) : null}
    </article>
  );
}
