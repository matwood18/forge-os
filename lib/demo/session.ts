// lib/demo/session.ts
import type { AuthorizationDecisionInspector } from "./authorization";
import type { DemoPipeline } from "./types";
import type { PassExecutionInspector } from "./pass-execution";
import type { RecommendationInspector } from "./recommendation";
import type { ReflectionInspector } from "./reflection";
import type { ExecutionTimeline } from "./timeline";

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
};