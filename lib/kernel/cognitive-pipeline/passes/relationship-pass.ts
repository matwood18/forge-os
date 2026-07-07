// lib/kernel/cognitive-pipeline/passes/relationship-pass.ts
import type { CognitiveEnvironment } from "../environment";
import type { CognitiveContext, CognitivePass } from "../types";

export class RelationshipPass implements CognitivePass {
  readonly name = "relationship";

  async run(
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void> {
    const observations = context.artifacts.observations;

    if (observations.length === 0) {
      context.artifacts.relationships = [];
      return;
    }

    const relationships =
      await environment.relationshipEngine.inferRelationships(observations);

    context.artifacts.relationships = relationships;
  }
}