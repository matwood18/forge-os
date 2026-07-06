import type { CognitiveEnvironment } from "../environment";
import type { CognitiveContext, CognitivePass } from "../types";

export class MemoryPass implements CognitivePass {
  readonly name = "memory";

  async run(
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void> {
    const assertions = environment.relationshipMemoryProducer.produce(
      context.artifacts.relationships
    );

    for (const assertion of assertions) {
      await environment.memoryService.rememberAssertion(assertion);
    }

    context.artifacts.memories = await environment.memoryService.all();
  }
}