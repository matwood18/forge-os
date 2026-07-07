// lib/demo/index.ts
export { ActionInspectorBuilder } from "./action";
export { AuthorizationDecisionInspectorBuilder } from "./authorization";
export { DemoDataProvider } from "./demo-data-provider";
export { DemoPipelineBuilder } from "./demo-pipeline-builder";
export { DemoSessionBuilder } from "./demo-session-builder";
export { KernelDemoPipelineBuilder } from "./kernel-demo-pipeline-builder";

export { PassExecutionInspectorBuilder } from "./pass-execution";
export { RecommendationInspectorBuilder } from "./recommendation";
export { ReflectionInspectorBuilder } from "./reflection";
export { RunSummaryBuilder } from "./run-summary";

export {
  COGNITIVE_OUTPUT_DEMO_SCENARIO,
  DEMO_SCENARIOS,
  FULL_LIFECYCLE_DEMO_SCENARIO,
} from "./scenario";

export { ExecutionTimelineBuilder } from "./timeline";

export type { DemoSession } from "./session";

export type {
  ActionInspector,
  ActionInspectorItem,
} from "./action";

export type {
  AuthorizationDecisionInspector,
  AuthorizationDecisionInspectorItem,
} from "./authorization";

export type {
  DemoArtifact,
  DemoArtifactMetadataValue,
  DemoPipeline,
  DemoStage,
  DemoStageId,
} from "./types";

export type {
  DemoScenario,
  DemoScenarioId,
} from "./scenario";

export type {
  PassExecutionInspector,
  PassExecutionInspectorItem,
} from "./pass-execution";

export type {
  RecommendationInspector,
  RecommendationInspectorItem,
} from "./recommendation";

export type {
  ReflectionInspector,
  ReflectionInspectorItem,
} from "./reflection";

export type {
  RunSummary,
  RunSummaryChainItem,
  RunSummaryChainItemStatus,
} from "./run-summary";

export type {
  ExecutionTimeline,
  ExecutionTimelineItem,
  ExecutionTimelineItemKind,
} from "./timeline";