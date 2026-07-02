"use client";

import { useState } from "react";
import type { Question } from "@/lib/domain";

type QuestionCardProps = {
  question: Question;
  onAnswered(question: Question, answer: string): Promise<void>;
};

export default function QuestionCard({
  question,
  onAnswered,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    const value = answer.trim();

    if (!value || busy) {
      return;
    }

    setBusy(true);

    try {
      await onAnswered(question, value);
      setAnswer("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="mb-2 text-sm font-medium text-amber-300">
        I need one detail.
      </div>

      <div className="text-lg font-semibold">{question.prompt}</div>

      <div className="mt-4 flex gap-3">
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Full name"
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none transition focus:border-amber-500"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSave();
            }
          }}
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400 disabled:opacity-50"
        >
          {busy ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}