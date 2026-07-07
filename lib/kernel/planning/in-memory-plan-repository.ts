// lib/kernel/planning/in-memory-plan-repository.ts
import type {
  PlanCreateInput,
  PlanRepository,
  PlanUpdateInput,
} from "./plan-repository";
import type { Plan } from "./types";

export class InMemoryPlanRepository implements PlanRepository {
  private readonly plans = new Map<string, Plan>();

  async remember(input: PlanCreateInput): Promise<Plan> {
    const now = new Date();

    const plan: Plan = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(plan.id, plan);

    return plan;
  }

  async update(id: string, input: PlanUpdateInput): Promise<Plan | null> {
    const existing = this.plans.get(id);

    if (!existing) {
      return null;
    }

    const updated: Plan = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };

    this.plans.set(updated.id, updated);

    return updated;
  }

  async findById(id: string): Promise<Plan | null> {
    return this.plans.get(id) ?? null;
  }

  async forGoal(goalId: string): Promise<Plan[]> {
    return Array.from(this.plans.values()).filter(
      (plan) => plan.goalId === goalId
    );
  }

  async all(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }
}