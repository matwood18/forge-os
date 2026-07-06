import type { GoalRepository } from "./goal-repository";
import type {
  GoalCreateInput,
  GoalRecord,
  GoalStatus,
  GoalUpdateInput,
} from "./types";

export class InMemoryGoalRepository implements GoalRepository {
  private readonly goals = new Map<string, GoalRecord>();

  async remember(goal: GoalCreateInput): Promise<GoalRecord> {
    const now = new Date();

    const record: GoalRecord = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.goals.set(record.id, record);

    return record;
  }

  async update(
    goalId: string,
    goal: GoalUpdateInput
  ): Promise<GoalRecord> {
    const existingGoal = this.requireGoal(goalId);

    const updatedGoal: GoalRecord = {
      ...existingGoal,
      ...goal,
      completedAt:
        goal.status === "completed"
          ? new Date()
          : goal.status === undefined
            ? existingGoal.completedAt
            : undefined,
      updatedAt: new Date(),
    };

    this.goals.set(updatedGoal.id, updatedGoal);

    return updatedGoal;
  }

  async updateStatus(
    goalId: string,
    status: GoalStatus
  ): Promise<GoalRecord> {
    return this.update(goalId, { status });
  }

  async findById(goalId: string): Promise<GoalRecord | null> {
    return this.goals.get(goalId) ?? null;
  }

  async byStatus(status: GoalStatus): Promise<GoalRecord[]> {
    return this.all().then((goals) =>
      goals.filter((goal) => goal.status === status)
    );
  }

  async all(): Promise<GoalRecord[]> {
    return Array.from(this.goals.values());
  }

  private requireGoal(goalId: string): GoalRecord {
    const goal = this.goals.get(goalId);

    if (!goal) {
      throw new Error(`Goal not found: ${goalId}`);
    }

    return goal;
  }
}