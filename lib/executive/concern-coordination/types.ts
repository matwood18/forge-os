import type { ExecutiveConcern } from "@/lib/executive/concern";
import type { ExecutiveConcernProjectionResult } from "@/lib/executive/concern-projection";
import type { ExecutiveConcernReconciliationDecision } from "@/lib/executive/concern-reconciliation";

export type ExecutiveConcernCoordinationInput = {
  projection: ExecutiveConcernProjectionResult;
};

export type ExecutiveConcernCoordinationRecord = {
  decision: ExecutiveConcernReconciliationDecision;
  concern: ExecutiveConcern;
};

export type ExecutiveConcernCoordinationResult = {
  records: ExecutiveConcernCoordinationRecord[];
  createdCount: number;
  updatedCount: number;
  unchangedCount: number;
  generatedAt: Date;
};

