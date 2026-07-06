import type { Question } from "@/lib/domain";

import type { MemoryRecord } from "../memory";
import type { ObservationRecord } from "../observation";
import type { ReasoningSession } from "../reasoning";
import type { RelationshipRecord } from "../relationship";

import type { CognitiveEnvironment } from "./environment";

export type CognitivePipelineInput = {
  text: string;
};

export type CognitiveContextArtifacts = {
  reasoningSession?: ReasoningSession;
  observations: ObservationRecord[];
  relationships: RelationshipRecord[];
  memories: MemoryRecord[];
  questions: Question[];
};

export type CognitiveContextMetadata = {
  startedAt: Date;
};

export type CognitiveContext = {
  input: CognitivePipelineInput;
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