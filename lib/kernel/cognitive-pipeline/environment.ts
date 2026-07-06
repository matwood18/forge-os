import type { CuriosityEngine } from "../curiosity";
import type { MemoryService, RelationshipMemoryProducer } from "../memory";
import type { ObservationRepository } from "../observation";
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
  observationRepository?: ObservationRepository;
};