import type { CognitiveEnvironment } from "../environment";
import type { CognitiveContext, CognitivePass } from "../types";

export class ReasoningPass implements CognitivePass {
  readonly name = "reasoning";

  async run(
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void> {
    context.artifacts.reasoningSession =
      await environment.reasoningEngine.reason({
        worldviewId: "kernel-current-worldview",
        worldview: {
          generatedAt: new Date(),
          beliefs: [],
        },
        objective: context.input.text,
      });
  }
}