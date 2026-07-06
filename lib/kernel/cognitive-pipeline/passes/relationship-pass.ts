import type { CognitiveEnvironment } from "../environment";
import type { CognitiveContext, CognitivePass } from "../types";

export class RelationshipPass implements CognitivePass {
  readonly name = "relationship";

  async run(
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void> {
    if (!environment.observationRepository) {
      context.artifacts.observations = [];
      context.artifacts.relationships = [];
      return;
    }

    const observations = await environment.observationRepository.all();
    const relationships =
      await environment.relationshipEngine.inferRelationships(observations);

    context.artifacts.observations = observations;
    context.artifacts.relationships = relationships;
  }
}