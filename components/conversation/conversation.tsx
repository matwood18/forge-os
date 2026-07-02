"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import type { Question } from "@/lib/domain";
import QuestionCard from "@/components/conversation/question-card";
import ConversationLog, {
  type ConversationLogEntry,
} from "@/components/conversation/conversation-log";

type CaptureState = {
  status: "idle" | "busy" | "success" | "error";
  message?: string;
};

export default function Conversation() {
  const [text, setText] = useState("");
  const [state, setState] = useState<CaptureState>({ status: "idle" });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [log, setLog] = useState<ConversationLogEntry[]>([]);

  async function handleRemember() {
    if (!text.trim()) {
      setState({ status: "error", message: "Type something first." });
      return;
    }

    setState({ status: "busy", message: "Forge is thinking..." });

    const response = await fetch("/api/capture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();

    setLog((current) => [
      {
        id: crypto.randomUUID(),
        label: "Capture Result",
        payload: result,
      },
      ...current,
    ]);

    if (!response.ok) {
      setState({
        status: "error",
        message: result.error ?? "Something went wrong.",
      });
      return;
    }

    setQuestions(result.questions ?? []);
    setState({ status: "success", message: "Remembered." });
    setText("");
  }

  async function handleAnswered(question: Question, answer: string) {
    const response = await fetch("/api/questions/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer }),
    });

    const result = await response.json();

    if (result.needsFollowUp) {
     setState({
        status: "success",
        message: result.message,
   });

  return;
}

    setLog((current) => [
      {
        id: crypto.randomUUID(),
        label: "Answer Result",
        payload: result,
      },
      ...current,
    ]);

    if (!response.ok) {
      setState({
        status: "error",
        message: result.error ?? "Something went wrong.",
      });
      return;
    }

    setQuestions((current) =>
      current.filter((item) => item.id !== question.id)
    );

    setState({
      status: "success",
      message: `That helps. I’ll keep that context in mind.`,
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Good morning, Madison.</h1>

        <div className="mt-4 space-y-2 text-zinc-400">
          <p>🟢 2 opportunities worth pursuing</p>
          <p>🟡 3 people waiting on you</p>
          <p>🤔 1 question that would make me smarter</p>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="mb-6 grid gap-3">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onAnswered={handleAnswered}
            />
          ))}
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-amber-500/15 p-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {"Did something happen that Forge couldn't see?"}
          </h2>

          <p className="text-sm text-zinc-400">
            {
              "Tell Forge about anything important that happened while you were away."
            }
          </p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Met John at APA pool tonight. He owns a cue repair shop..."
        className="min-h-32 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm outline-none transition focus:border-amber-500"
      />

      {state.message && (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
          {state.message}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleRemember}
          disabled={state.status === "busy"}
          className="rounded-xl bg-amber-500 px-5 py-2.5 font-medium text-black transition hover:bg-amber-400 disabled:opacity-50"
        >
          {state.status === "busy" ? "Thinking..." : "Remember"}
        </button>
      </div>

      <ConversationLog entries={log} />
    </section>
  );
}