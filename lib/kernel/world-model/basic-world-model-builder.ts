import type { MemoryRepository } from "../memory";
import type { ObservationRepository } from "../observation";
import type { QuestionStore } from "../question-store";
import type { RelationshipRepository } from "../relationship";

import type { WorldModelBuilder } from "./world-model-builder";
import type { WorldModel } from "./types";

export type BasicWorldModelBuilderDependencies = {
  observationRepository: ObservationRepository;
  relationshipRepository: RelationshipRepository;
  memoryRepository: MemoryRepository;
  questionStore: QuestionStore;
};

export class BasicWorldModelBuilder implements WorldModelBuilder {
  constructor(
    private readonly dependencies: BasicWorldModelBuilderDependencies
  ) {}

  async build(): Promise<WorldModel> {
    const [observations, relationships, memories, openQuestions] =
      await Promise.all([
        this.dependencies.observationRepository.all(),
        this.dependencies.relationshipRepository.all(),
        this.dependencies.memoryRepository.all(),
        this.dependencies.questionStore.listOpen(),
      ]);

    return {
      id: "kernel-current-world-model",
      generatedAt: new Date(),
      observations,
      relationships,
      memories,
      openQuestions,
    };
  }
}