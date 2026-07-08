// app/forge-showcase/components/interactive-forge-showcase.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

type CognitiveStageStatus = "future" | "active" | "complete";

type CognitiveStage = {
  title: string;
  summary: string;
  log: string;
  details: string[];
};

const sampleInputs = [
  "Jess is mad at me for not contacting insurance.",
  "I need to call the dentist before Friday.",
  "Maxx asked me to help with his project again.",
];

const defaultInput = sampleInputs[0];

const stageDurationMs = 950;

function buildStages(input: string): CognitiveStage[] {
  const normalizedInput = input.toLowerCase();

  const hasJess = normalizedInput.includes("jess");
  const hasInsurance = normalizedInput.includes("insurance");
  const hasContact = normalizedInput.includes("contact");
  const hasMad = normalizedInput.includes("mad");
  const hasMe =
    normalizedInput.includes(" me ") ||
    normalizedInput.startsWith("me ") ||
    normalizedInput.includes(" i ") ||
    normalizedInput.startsWith("i ");

  const personMention = hasJess ? "Jess" : "unresolved person";
  const operatorMention = hasMe ? "current operator" : "operator implied";
  const obligationMention =
    hasInsurance && hasContact
      ? "contact insurance"
      : hasInsurance
        ? "insurance obligation"
        : "possible follow-up obligation";

  return [
    {
      title: "Receiving Input",
      summary: "Forge receives the raw life input without cleaning it up first.",
      log: "Captured source text from operator.",
      details: [input],
    },
    {
      title: "Understanding Meaning",
      summary:
        "Forge looks for emotional pressure, social context, and unresolved work.",
      log: "Detected concern, relationship pressure, and unfinished obligation.",
      details: [
        hasMad ? "emotional signal: someone is upset" : "emotional signal: mild",
        "context type: personal responsibility",
        "possible need: repair trust through follow-up",
      ],
    },
    {
      title: "Extracting Entity Mentions",
      summary:
        "Forge identifies references before pretending it knows what they mean.",
      log: "Extracted person, operator, and task-like mentions.",
      details: [personMention, operatorMention, obligationMention],
    },
    {
      title: "Grounding Knowledge",
      summary:
        "Forge separates known references from unresolved references that need grounding.",
      log: "Marked unresolved mentions for future canonical resolution.",
      details: [
        `${personMention} → person candidate`,
        `${operatorMention} → actor candidate`,
        `${obligationMention} → obligation candidate`,
      ],
    },
    {
      title: "Evaluating Safety",
      summary:
        "Forge checks whether anything should happen automatically. It should not.",
      log: "No external action authorized. No persistence required in showcase mode.",
      details: [
        "no email sent",
        "no calendar event created",
        "no database mutation",
        "authorization required before action",
      ],
    },
    {
      title: "Understanding Complete",
      summary:
        "Forge has transformed messy input into structured understanding.",
      log: "Compiled input into safe, explainable cognitive state.",
      details: [
        "meaning understood",
        "mentions extracted",
        "knowledge boundaries preserved",
        "ready for future reasoning runtime",
      ],
    },
  ];
}

function getStageStatus(
  stageIndex: number,
  activeStageIndex: number
): CognitiveStageStatus {
  if (stageIndex < activeStageIndex) {
    return "complete";
  }

  if (stageIndex === activeStageIndex) {
    return "active";
  }

  return "future";
}

function formatTimestamp(offsetSeconds: number) {
  return `00:${String(offsetSeconds).padStart(2, "0")}`;
}

export function InteractiveForgeShowcase() {
  const [input, setInput] = useState(defaultInput);
  const [submittedInput, setSubmittedInput] = useState(defaultInput);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const stages = useMemo(() => buildStages(submittedInput), [submittedInput]);
  const activeStage = stages[activeStageIndex];
  const isComplete = activeStageIndex >= stages.length - 1;

  const progressPercentage =
    stages.length <= 1
      ? 100
      : Math.round((activeStageIndex / (stages.length - 1)) * 100);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (activeStageIndex >= stages.length - 1) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveStageIndex((current) => Math.min(current + 1, stages.length - 1));
    }, stageDurationMs);

    return () => window.clearTimeout(timeout);
  }, [activeStageIndex, isRunning, stages.length]);

  function analyze() {
    setSubmittedInput(input.trim() || defaultInput);
    setActiveStageIndex(0);
    setIsRunning(true);
  }

  function selectSample(sample: string) {
    setInput(sample);
    setSubmittedInput(sample);
    setActiveStageIndex(0);
    setIsRunning(true);
  }

  function getStatusLabel() {
    if (isRunning && !isComplete) {
      return "thinking";
    }

    if (isComplete) {
      return "complete";
    }

    return "paused";
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
            Forge OS
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-bold tracking-tight md:text-6xl">
            Watch Forge think through messy life input.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
            This is the product-feel layer: a living cognitive experience that
            shows Forge receiving, interpreting, extracting, grounding, and
            safely stopping before action.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20">
          <label
            htmlFor="forge-input"
            className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500"
          >
            Try an input
          </label>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              id="forge-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  analyze();
                }
              }}
              className="min-h-14 flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 text-base text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            />

            <button
              type="button"
              onClick={analyze}
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Analyze
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {sampleInputs.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => selectSample(sample)}
                className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-200"
              >
                {sample}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Cognitive compiler
            </p>

            <div className="mt-5 space-y-3">
              {stages.map((stage, index) => {
                const status = getStageStatus(index, activeStageIndex);

                return (
                  <button
                    key={stage.title}
                    type="button"
                    onClick={() => {
                      setIsRunning(false);
                      setActiveStageIndex(index);
                    }}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      status === "active"
                        ? "border-cyan-300 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-500/10"
                        : status === "complete"
                          ? "border-emerald-400/30 bg-emerald-400/5 text-slate-200"
                          : "border-slate-800 bg-slate-950 text-slate-500"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          status === "active"
                            ? "bg-cyan-300 text-slate-950"
                            : status === "complete"
                              ? "bg-emerald-400 text-slate-950"
                              : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {status === "complete" ? "✓" : index + 1}
                      </span>

                      <span>
                        <span className="block font-semibold">
                          {stage.title}
                        </span>
                        <span className="mt-1 block text-sm text-slate-400">
                          {stage.summary}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/20">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-cyan-300">
                {activeStage.title}
              </p>

              <p className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                {getStatusLabel()}
              </p>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <h2 className="mt-8 text-3xl font-bold leading-tight">
              {activeStage.summary}
            </h2>

            <div className="mt-6 space-y-3">
              {activeStage.details.map((detail) => (
                <div
                  key={detail}
                  className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-slate-200"
                >
                  <span className="mr-3 text-cyan-300">→</span>
                  {detail}
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-slate-800 bg-black/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Compiler log
              </p>

              <div className="mt-4 space-y-2 font-mono text-sm">
                {stages.slice(0, activeStageIndex + 1).map((stage, index) => (
                  <p key={stage.title} className="text-slate-300">
                    <span className="text-cyan-400">
                      [{formatTimestamp(index + 1)}]
                    </span>{" "}
                    {stage.log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Knowledge graph
            </p>

            <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-6">
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <div className="relative h-40 w-40">
                  <div className="absolute left-1/2 top-4 h-4 w-4 -translate-x-1/2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/30" />
                  <div className="absolute bottom-8 left-8 h-4 w-4 rounded-full bg-slate-600" />
                  <div className="absolute bottom-8 right-8 h-4 w-4 rounded-full bg-slate-600" />
                  <div className="absolute left-1/2 top-8 h-24 w-px -translate-x-1/2 rotate-[-32deg] bg-slate-700" />
                  <div className="absolute left-1/2 top-8 h-24 w-px -translate-x-1/2 rotate-[32deg] bg-slate-700" />
                </div>

                <p className="text-lg font-semibold text-slate-200">
                  Coming soon
                </p>

                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  Canonical people, obligations, relationships, and unresolved
                  references will eventually appear here.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
          <p className="text-sm font-semibold text-cyan-200">
            Current honest behavior
          </p>

          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            This showcase does not mutate the kernel, write to Prisma, or create
            durable actions. It visualizes the cognitive shape Forge is growing
            toward while the real debug/proof layer remains isolated at{" "}
            <span className="font-mono text-slate-100">/forge-demo</span>.
          </p>
        </section>
      </div>
    </main>
  );
}