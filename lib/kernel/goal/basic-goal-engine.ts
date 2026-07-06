import type { GoalRepository } from "./goal-repository";
import type { GoalEngine } from "./goal-engine";
import type {
  GoalCreateInput,
  GoalRecord,
  GoalStatus,
  GoalUpdateInput,
} from "./types";

export class BasicGoalEngine implements GoalEngine {
  constructor(private readonly goalRepository: GoalRepository) {}

  async create(goal: GoalCreateInput): Promise<GoalRecord> {
    return this.goalRepository.remember(goal);
  }

  async update(
    goalId: string,
    goal: GoalUpdateInput
  ): Promise<GoalRecord> {
    return this.goalRepository.update(goalId, goal);
  }

  async updateStatus(
    goalId: string,
    status: GoalStatus
  ): Promise<GoalRecord> {
    return this.goalRepository.updateStatus(goalId, status);
  }

  async list(): Promise<GoalRecord[]> {
    return this.goalRepository.all();
  }

  async active(): Promise<GoalRecord[]> {
    return this.goalRepository.byStatus("active");
  }
}