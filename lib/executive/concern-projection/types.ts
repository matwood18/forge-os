import type { ExecutiveAttentionResult } from "@/lib/executive/attention";
import type { ExecutiveOutput } from "@/lib/executive/output";
import type { ExecutiveConcernObservation } from "@/lib/executive/concern-reconciliation";

export type ExecutiveConcernProjectionInput = {
  attention: ExecutiveAttentionResult;
  output: ExecutiveOutput;
};

export type ExecutiveConcernProjectionResult = {
  observations: ExecutiveConcernObservation[];
  generatedAt: Date;
};

