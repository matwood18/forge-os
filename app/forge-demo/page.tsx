// app/forge-demo/page.tsx
import {
  DemoDataProvider,
  FULL_LIFECYCLE_DEMO_SCENARIO,
} from "@/lib/demo";
import { createKernel } from "@/lib/kernel/create-kernel";

import { ActionInspectorView } from "./components/action-inspector";
import { AuthorizationDecisionInspectorView } from "./components/authorization-decision-inspector";
import { ExecutionTimelineView } from "./components/execution-timeline";
import { PassExecutionInspectorView } from "./components/pass-execution-inspector";
import { PipelineStage } from "./components/pipeline-stage";
import { RecommendationInspectorView } from "./components/recommendation-inspector";
import { ReflectionInspectorView } from "./components/reflection-inspector";
import { RunSummaryView } from "./components/run-summary";

export default async function ForgeDemoPage() {
  const kernel = createKernel();
  const session = await new DemoDataProvider(kernel).loadScenario(
    FULL_LIFECYCLE_DEMO_SCENARIO
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Forge OS
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Cognitive Demo
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            {FULL_LIFECYCLE_DEMO_SCENARIO.title}
          </p>

          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            {FULL_LIFECYCLE_DEMO_SCENARIO.description}
          </p>

          <p className="mt-3 text-xs text-slate-600">
            Session {session.id} · {session.createdAt.toLocaleString()}
          </p>
        </header>

        <RunSummaryView summary={session.runSummary} />

        <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-300">Input</h2>

          <p className="mt-2 text-slate-400">
            {session.input || "No input provided."}
          </p>
        </section>

        <ExecutionTimelineView timeline={session.timeline} />

        <PassExecutionInspectorView
          inspector={session.passExecutionInspector}
        />

        <ReflectionInspectorView inspector={session.reflectionInspector} />

        <RecommendationInspectorView
          inspector={session.recommendationInspector}
        />

        <AuthorizationDecisionInspectorView
          inspector={session.authorizationDecisionInspector}
        />

        <ActionInspectorView inspector={session.actionInspector} />

        <div className="space-y-4">
          {session.pipeline.stages.map((stage) => (
            <PipelineStage key={stage.id} stage={stage} />
          ))}
        </div>
      </div>
    </main>
  );
}