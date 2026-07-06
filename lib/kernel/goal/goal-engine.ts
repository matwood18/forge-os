import type {
  GoalCreateInput,
  GoalRecord,
  GoalStatus,
  GoalUpdateInput,
} from "./types";

export interface GoalEngine {
  create(goal: GoalCreateInput): Promise<GoalRecord>;

  update(goalId: string, goal: GoalUpdateInput): Promise<GoalRecord>;

  updateStatus(
    goalId: string,
    status: GoalStatus
  ): Promise<GoalRecord>;

  list(): Promise<GoalRecord[]>;

  active(): Promise<GoalRecord[]>;
}