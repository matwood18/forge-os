import type {
  GoalCreateInput,
  GoalRecord,
  GoalStatus,
  GoalUpdateInput,
} from "./types";

export interface GoalRepository {
  remember(goal: GoalCreateInput): Promise<GoalRecord>;

  update(
    goalId: string,
    goal: GoalUpdateInput
  ): Promise<GoalRecord>;

  updateStatus(
    goalId: string,
    status: GoalStatus
  ): Promise<GoalRecord>;

  findById(goalId: string): Promise<GoalRecord | null>;

  byStatus(status: GoalStatus): Promise<GoalRecord[]>;

  all(): Promise<GoalRecord[]>;
}