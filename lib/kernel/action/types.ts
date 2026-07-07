// lib/kernel/action/types.ts
export type ActionKind = "investigation";

export type ActionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type ActionRecord = {
  id: string;

  executionId: string;
  recommendationId: string;
  authorizationDecisionId: string;

  kind: ActionKind;
  status: ActionStatus;

  title: string;
  rationale: string;

  createdAt: Date;
  updatedAt: Date;
};

export type ActionCreateInput = Omit<
  ActionRecord,
  "id" | "createdAt" | "updatedAt"
>;