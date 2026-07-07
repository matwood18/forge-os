// lib/kernel/cognitive-pipeline/types.ts
import type { Question } from "@/lib/domain";

import type { MemoryRecord } from "../memory";
import type { ObservationRecord } from "../observation";
import type { Plan } from "../planning";
import type { ReasoningSession } from "../reasoning";
import type { RelationshipRecord } from "../relationship";
import type { WorldModel } from "../world-model";

import type { CognitivePassExecution } from "./execution/pass-execution";
import type { CognitiveEnvironment } from "./environment";

export type CognitivePipelineInput = {
  text: string;
};

export type CognitiveContextState = {
  worldModel: WorldModel;
};

export type CognitiveContextArtifacts = {
  reasoningSession?: ReasoningSession;
  observations: ObservationRecord[];
  relationships: RelationshipRecord[];
  memories: MemoryRecord[];
  questions: Question[];
  plans: Plan[];
};

export type CognitiveContextMetadata = {
  startedAt: Date;
  passExecutions: CognitivePassExecution[];
};

export type CognitiveContext = {
  input: CognitivePipelineInput;
  state: CognitiveContextState;
  artifacts: CognitiveContextArtifacts;
  metadata: CognitiveContextMetadata;
};

export type CognitivePipelineResult = {
  context: CognitiveContext;
};

export interface CognitivePass {
  readonly name: string;

  run(
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void>;
}