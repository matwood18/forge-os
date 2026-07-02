"use client";

import type { Question } from "@/lib/domain";

type QuestionCardProps = {
  question: Question;
  onAnswered(question: Question, answer: string): Promise<void>;
};

export default function QuestionCard({
  question,
  onAnswered,
}: QuestionCardProps) {
  const isDidYouMean = question.prompt.startsWith("Did you mean ");

  const candidateName = isDidYouMean
    ? question.prompt
        .replace("Did you mean ", "")
        .replace(/, or another .*\?$/, "")
    : null;

  if (isDidYouMean && candidateName) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="mb-2 text-sm font-medium text-amber-300">
          I need one detail.
        </div>

        <div className="text-lg font-semibold">{question.prompt}</div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => onAnswered(question, candidateName)}
            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400"
          >
            Yes, {candidateName}
          </button>

          <button
            type="button"
            onClick={() => onAnswered(question, "__DIFFERENT_PERSON__")}
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
          >
            Different person
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="mb-2 text-sm font-medium text-amber-300">
        I need one detail.
      </div>

      <div className="text-lg font-semibold">{question.prompt}</div>

      <div className="mt-4 flex gap-3">
        <input
          placeholder="Full name"
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none transition focus:border-amber-500"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              const value = event.currentTarget.value.trim();

              if (value) {
                onAnswered(question, value);
                event.currentTarget.value = "";
              }
            }
          }}
        />
      </div>
    </div>
  );
}