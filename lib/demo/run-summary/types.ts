// lib/demo/run-summary/types.ts
export type RunSummaryChainItemStatus = "completed" | "empty";

export type RunSummaryChainItem = {
  id:
    | "input"
    | "execution"
    | "reflection"
    | "recommendation"
    | "authorization"
    | "action";
  label: string;
  description: string;
  count: number;
  status: RunSummaryChainItemStatus;
};

export type RunSummary = {
  id: string;
  input: string;
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
  passCount: number;
  reflectionCount: number;
  recommendationCount: number;
  authorizationDecisionCount: number;
  actionCount: number;
  headline: string;
  summary: string;
  chainItems: RunSummaryChainItem[];
};