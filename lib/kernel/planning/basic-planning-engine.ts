import type {
  Plan,
  PlanningEngine,
  PlanningEngineInput,
  PlanningResult,
} from "./types";

export class BasicPlanningEngine implements PlanningEngine {
  async plan(input: PlanningEngineInput): Promise<PlanningResult> {
    const plans = input.goals
      .filter((goal) => goal.status === "active" || goal.status === "open")
      .map((goal): Plan => {
        const now = new Date();

        return {
          id: crypto.randomUUID(),
          goalId: goal.id,
          status: "draft",
          createdAt: now,
          updatedAt: now,
          steps: [
            {
              id: crypto.randomUUID(),
              title: `Clarify goal: ${goal.title}`,
              description:
                goal.description ??
                "Clarify the desired outcome before selecting an action.",
              status: "ready",
              order: 1,
              actionCandidates: [
                {
                  id: crypto.randomUUID(),
                  title: "Review current world model",
                  description:
                    "Use the current world model to identify known facts, missing context, and blockers for this goal.",
                  confidence: 0.7,
                },
              ],
            },
          ],
        };
      });

    return { plans };
  }
}