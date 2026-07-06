export type GoalStatus =
  | "open"
  | "active"
  | "blocked"
  | "completed"
  | "abandoned";

export type GoalPriority = "low" | "medium" | "high" | "critical";

export type GoalSource =
  | "user"
  | "system"
  | "curiosity"
  | "reflection"
  | "planning";

export type GoalType =
  | "learn"
  | "decide"
  | "create"
  | "maintain"
  | "resolve"
  | "coordinate";

export type GoalProgress = {
  current: number;
  target: number;
};

export type GoalRecord = {
  id: string;

  title: string;
  description?: string;

  status: GoalStatus;
  priority: GoalPriority;
  source: GoalSource;
  type: GoalType;

  progress?: GoalProgress;

  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};

export type GoalCreateInput = Omit<
  GoalRecord,
  "id" | "createdAt" | "updatedAt" | "completedAt"
>;

export type GoalUpdateInput = Partial<
  Pick<
    GoalRecord,
    "title" | "description" | "status" | "priority" | "type" | "progress"
  >
>;