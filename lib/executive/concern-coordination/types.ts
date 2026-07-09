import type { ExecutiveConcern } from "@/lib/executive/concern";
import type { ExecutiveConcernIdentityResult } from "@/lib/executive/concern-identity";
import type { ExecutiveConcernProjectionResult } from "@/lib/executive/concern-projection";
import type { ExecutiveConcernReconciliationDecision } from "@/lib/executive/concern-reconciliation";

export type ExecutiveConcernCoordinationInput = {
  projection: ExecutiveConcernProjectionResult;
};

export type ExecutiveConcernCoordinationRecord =
  | {
      kind: "reconciled";
      decision: ExecutiveConcernReconciliationDecision;
      concern: ExecutiveConcern;
      identityResult?: ExecutiveConcernIdentityResult;
    }
  | {
      kind: "identity_ambiguous";
      identityResult: Extract<
        ExecutiveConcernIdentityResult,
        { kind: "ambiguous" }
      >;
    };

export type ExecutiveConcernCoordinationResult = {
  records: ExecutiveConcernCoordinationRecord[];
  createdCount: number;
  updatedCount: number;
  unchangedCount: number;
  ambiguousCount: number;
  generatedAt: Date;
};

