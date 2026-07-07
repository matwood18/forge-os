// lib/kernel/planning/plan-repository.ts
import type { Plan } from "./types";

export type PlanCreateInput = Omit<Plan, "id" | "createdAt" | "updatedAt">;

export type PlanUpdateInput = Partial<
  Omit<Plan, "id" | "goalId" | "createdAt" | "updatedAt">
>;

export interface PlanRepository {
  remember(plan: PlanCreateInput): Promise<Plan>;

  update(id: string, input: PlanUpdateInput): Promise<Plan | null>;

  findById(id: string): Promise<Plan | null>;

  forGoal(goalId: string): Promise<Plan[]>;

  all(): Promise<Plan[]>;
}