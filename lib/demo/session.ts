// lib/demo/session.ts
import type { ActionInspector } from "./action";
import type { AuthorizationDecisionInspector } from "./authorization";
import type { PassExecutionInspector } from "./pass-execution";
import type { RecommendationInspector } from "./recommendation";
import type { ReflectionInspector } from "./reflection";
import type { RunSummary } from "./run-summary";
import type { ExecutionTimeline } from "./timeline";
import type { DemoPipeline } from "./types";

export type DemoSession = {
  id: string;
  createdAt: Date;
  input: string;
  pipeline: DemoPipeline;
  timeline: ExecutionTimeline;
  passExecutionInspector: PassExecutionInspector;
  reflectionInspector: ReflectionInspector;
  recommendationInspector: RecommendationInspector;
  authorizationDecisionInspector: AuthorizationDecisionInspector;
  actionInspector: ActionInspector;
  runSummary: RunSummary;
};