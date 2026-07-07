// lib/kernel/planning/basic-planning-engine.ts
import type {
  PlanRepository,
} from "./plan-repository";
import type {
  Plan,
  PlanningEngine,
  PlanningEngineInput,
  PlanningResult,
} from "./types";

export class BasicPlanningEngine implements PlanningEngine {
  constructor(private readonly planRepository: PlanRepository) {}

  async plan(input: PlanningEngineInput): Promise<PlanningResult> {
    const plans: Plan[] = [];

    for (const goal of input.goals) {
      if (goal.status !== "active" && goal.status !== "open") {
        continue;
      }

      const existingPlans = await this.planRepository.forGoal(goal.id);

      if (existingPlans.length > 0) {
        plans.push(...existingPlans);
        continue;
      }

      const plan = await this.planRepository.remember({
        goalId: goal.id,
        status: "draft",
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
      });

      plans.push(plan);
    }

    return { plans };
  }
}