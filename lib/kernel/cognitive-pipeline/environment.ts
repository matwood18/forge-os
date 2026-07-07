// lib/kernel/cognitive-pipeline/environment.ts
import type { CuriosityEngine } from "../curiosity";
import type { GoalEngine } from "../goal";
import type { MemoryService, RelationshipMemoryProducer } from "../memory";
import type { ObservationRepository } from "../observation";
import type { PlanningEngine } from "../planning";
import type { QuestionStore } from "../question-store";
import type { ReasoningEngine } from "../reasoning";
import type { RelationshipEngine } from "../relationship";

export type CognitiveEnvironment = {
  reasoningEngine: ReasoningEngine;
  relationshipEngine: RelationshipEngine;
  memoryService: MemoryService;
  relationshipMemoryProducer: RelationshipMemoryProducer;
  curiosityEngine: CuriosityEngine;
  questionStore: QuestionStore;
  goalEngine: GoalEngine;
  planningEngine: PlanningEngine;
  observationRepository?: ObservationRepository;
};