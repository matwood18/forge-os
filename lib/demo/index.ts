// lib/demo/index.ts
export { DemoDataProvider } from "./demo-data-provider";
export { DemoPipelineBuilder } from "./demo-pipeline-builder";
export { DemoSessionBuilder } from "./demo-session-builder";
export { KernelDemoPipelineBuilder } from "./kernel-demo-pipeline-builder";

export { PassExecutionInspectorBuilder } from "./pass-execution";
export { ReflectionInspectorBuilder } from "./reflection";
export { ExecutionTimelineBuilder } from "./timeline";

export type { DemoSession } from "./session";

export type {
  DemoArtifact,
  DemoArtifactMetadataValue,
  DemoPipeline,
  DemoStage,
  DemoStageId,
} from "./types";

export type {
  PassExecutionInspector,
  PassExecutionInspectorItem,
} from "./pass-execution";

export type {
  ReflectionInspector,
  ReflectionInspectorItem,
} from "./reflection";

export type {
  ExecutionTimeline,
  ExecutionTimelineItem,
  ExecutionTimelineItemKind,
} from "./timeline";