import { WorldModelReasoningAdapter } from "../../world-model";
import type { CognitiveEnvironment } from "../environment";
import type { CognitiveContext, CognitivePass } from "../types";

export class ReasoningPass implements CognitivePass {
  readonly name = "reasoning";

  private readonly worldModelReasoningAdapter =
    new WorldModelReasoningAdapter();

  async run(
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void> {
    if (!context.state.worldModel) {
      throw new Error("Reasoning pass requires an initialized world model.");
    }

    const worldview = this.worldModelReasoningAdapter.toWorldview(
      context.state.worldModel
    );

    context.artifacts.reasoningSession =
      await environment.reasoningEngine.reason({
        worldviewId: context.state.worldModel.id,
        worldview,
        objective: context.input.text,
      });
  }
}