import type { ExecutiveSelectionDecision } from "@/lib/executive/selection";

export type ExecutiveAttentionState =
  | "surfaced"
  | "quiet"
  | "reconsider";

export type ExecutiveAttentionRecord = {
  priority: ExecutiveSelectionDecision["priority"];
  state: ExecutiveAttentionState;
  selectionDecision: ExecutiveSelectionDecision["decision"];
  selectionSignals: ExecutiveSelectionDecision["selectionSignals"];
  createdAt: Date;
};

export type ExecutiveAttentionInput = {
  decisions: ExecutiveSelectionDecision[];
  generatedAt: Date;
};

export type ExecutiveAttentionResult = {
  attention: ExecutiveAttentionRecord[];
  generatedAt: Date;
};
