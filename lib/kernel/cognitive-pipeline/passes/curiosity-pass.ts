import type { CognitiveEnvironment } from "../environment";
import type { CognitiveContext, CognitivePass } from "../types";

export class CuriosityPass implements CognitivePass {
  readonly name = "curiosity";

  async run(
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void> {
    const curiosity = await environment.curiosityEngine.generate({
      observations: context.artifacts.observations,
    });

    for (const question of curiosity.questions) {
      await environment.questionStore.add(question);
    }

    context.artifacts.questions = await environment.questionStore.listOpen();
  }
}