// lib/kernel/cognitive-pipeline/context-initializer.ts
import type { WorldModelBuilder } from "../world-model";

import type {
  CognitiveContext,
  CognitivePipelineInput,
} from "./types";

export interface CognitiveContextInitializer {
  initialize(input: CognitivePipelineInput): Promise<CognitiveContext>;
}

export type DefaultCognitiveContextInitializerDependencies = {
  worldModelBuilder: WorldModelBuilder;
};

export class DefaultCognitiveContextInitializer
  implements CognitiveContextInitializer
{
  constructor(
    private readonly dependencies: DefaultCognitiveContextInitializerDependencies
  ) {}

  async initialize(
    input: CognitivePipelineInput
  ): Promise<CognitiveContext> {
    const worldModel = await this.dependencies.worldModelBuilder.build();

    return {
      input,
      state: {
        worldModel,
      },
      artifacts: {
        observations: [],
        relationships: [],
        memories: [],
        questions: [],
        plans: [],
      },
      metadata: {
        startedAt: new Date(),
      },
    };
  }
}