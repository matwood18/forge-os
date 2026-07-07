// lib/demo/action/types.ts
import type { ActionRecord } from "@/lib/kernel/action";

export type ActionInspectorItem = {
  id: string;
  executionId: string;
  recommendationId: string;
  authorizationDecisionId: string;
  kind: ActionRecord["kind"];
  status: ActionRecord["status"];
  title: string;
  rationale: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ActionInspector = {
  id: string;
  items: ActionInspectorItem[];
};