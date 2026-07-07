// lib/kernel/cognitive-pipeline/passes/planning-pass.ts
import type { CognitiveEnvironment } from "../environment";
import type { CognitiveContext, CognitivePass } from "../types";

export class PlanningPass implements CognitivePass {
  readonly name = "planning";

  async run(
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void> {
    const goals = await environment.goalEngine.active();

    const planning = await environment.planningEngine.plan({
      worldModel: context.state.worldModel,
      goals,
    });

    context.artifacts.plans = planning.plans;
  }
}