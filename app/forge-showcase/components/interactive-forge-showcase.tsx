// app/forge-showcase/components/interactive-forge-showcase.tsx

"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { ShowcaseProjection } from "@/lib/showcase";

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

function buildStages(
  input: string,
  projection: ShowcaseProjection | null
): CognitiveStage[] {
  if (!projection) {
    return [
      {
        title: "Ready",
        summary: "Forge is waiting for a real input to analyze.",
        log: "Awaiting operator input.",
        details: [input],
      },
    ];
  }

  return projection.stages.map((stage) => ({
    title: stage.title,
    summary: stage.headline,
    log: stage.log,
    details: stage.bullets,
  }));
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
  const [projection, setProjection] = useState<ShowcaseProjection | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const stages = useMemo(
    () => buildStages(submittedInput, projection),
    [submittedInput, projection]
  );

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

  function runAnalysis(nextInput: string) {
    const normalizedInput = nextInput.trim() || defaultInput;

    setInput(normalizedInput);
    setSubmittedInput(normalizedInput);
    setActiveStageIndex(0);
    setProjection(null);
    setError(null);
    setIsRunning(false);

    startTransition(async () => {
      try {
        const response = await fetch("/api/forge-showcase/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: normalizedInput }),
        });

        const result = (await response.json()) as {
          projection?: ShowcaseProjection;
          error?: string;
        };

        if (!response.ok || !result.projection) {
          throw new Error(result.error ?? "Forge could not complete this execution.");
        }

        setProjection(result.projection);
        setActiveStageIndex(0);
        setIsRunning(true);
      }  catch (error) {
            console.error(error);

            setError(
            error instanceof Error
                ? error.message
                : "Forge could not complete this execution."
            );
        }
    });
  }

  function analyze() {
    runAnalysis(input);
  }

  function selectSample(sample: string) {
    runAnalysis(sample);
  }

  function getStatusLabel() {
    if (isPending) {
      return "executing kernel";
    }

    if (projection && isComplete) {
      return "complete";
    }

    if (isRunning) {
      return "playing back";
    }

    return "ready";
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
            now plays back real Forge kernel execution instead of local simulated
            stages.
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
                if (event.key === "Enter" && !isPending) {
                  analyze();
                }
              }}
              className="min-h-14 flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 text-base text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            />

            <button
              type="button"
              onClick={analyze}
              disabled={isPending}
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Running..." : "Analyze"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {sampleInputs.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => selectSample(sample)}
                disabled={isPending}
                className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sample}
              </button>
            ))}
          </div>

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Real kernel playback
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
                Kernel log
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
              Execution graph
            </p>

            <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-6">
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <div className="relative h-40 w-40">
                  <div className="absolute left-1/2 top-4 h-4 w-4 -translate-x-1/2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/30" />
                  <div className="absolute bottom-8 left-8 h-4 w-4 rounded-full bg-emerald-400/70" />
                  <div className="absolute bottom-8 right-8 h-4 w-4 rounded-full bg-slate-600" />
                  <div className="absolute left-1/2 top-8 h-24 w-px -translate-x-1/2 rotate-[-32deg] bg-slate-700" />
                  <div className="absolute left-1/2 top-8 h-24 w-px -translate-x-1/2 rotate-[32deg] bg-slate-700" />
                </div>

                <p className="text-lg font-semibold text-slate-200">
                  {projection
                    ? `${projection.totalSteps} kernel steps`
                    : "No execution yet"}
                </p>

                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  This panel is now backed by real execution output. The visual
                  graph can grow as kernel artifacts become richer.
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
            This showcase now runs the real Forge kernel through a server
            boundary, then plays the result back as a product experience. It
            still avoids Prisma, durable persistence, and unauthorized external
            action.
          </p>
        </section>
      </div>
    </main>
  );
}