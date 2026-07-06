import type { GoalRecord } from "../goal";
import type { WorldModel } from "../world-model";

export type PlanStatus =
  | "draft"
  | "active"
  | "completed"
  | "abandoned";

export type ActionCandidate = {
  id: string;

  title: string;
  description?: string;

  confidence: number;
};

export type PlanStepStatus =
  | "pending"
  | "ready"
  | "in-progress"
  | "completed"
  | "blocked";

export type PlanStep = {
  id: string;

  title: string;
  description?: string;

  status: PlanStepStatus;

  order: number;

  actionCandidates: ActionCandidate[];
};

export type Plan = {
  id: string;

  goalId: string;

  status: PlanStatus;

  steps: PlanStep[];

  createdAt: Date;
  updatedAt: Date;
};

export type PlanningEngineInput = {
  worldModel: WorldModel;
  goals: GoalRecord[];
};

export type PlanningResult = {
  plans: Plan[];
};

export interface PlanningEngine {
  plan(input: PlanningEngineInput): Promise<PlanningResult>;
}