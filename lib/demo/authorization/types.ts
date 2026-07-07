// lib/demo/authorization/types.ts
import type { AuthorizationDecision } from "@/lib/kernel/authorization";

export type AuthorizationDecisionInspectorItem = {
  id: string;
  executionId: string;
  recommendationId: string;
  outcome: AuthorizationDecision["outcome"];
  authority: AuthorizationDecision["authority"];
  rationale: string;
  appliedPolicyIds: string[];
  createdAt: Date;
};

export type AuthorizationDecisionInspector = {
  id: string;
  items: AuthorizationDecisionInspectorItem[];
};