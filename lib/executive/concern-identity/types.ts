import type { ExecutiveConcern } from "@/lib/executive/concern";
import type { ExecutiveConcernObservation } from "@/lib/executive/concern-reconciliation";

export type ExecutiveConcernIdentityCandidate = {
  concernId: string;
  title: string;
  confidence: number;
  reason: string;
  supportingEvidenceIds: string[];
};

export type ExecutiveConcernIdentityInput = {
  observation: ExecutiveConcernObservation;
  candidates: ExecutiveConcern[];
};

export type ExecutiveConcernIdentityResult =
  | {
      kind: "resolved";
      observation: ExecutiveConcernObservation;
      candidate: ExecutiveConcernIdentityCandidate;
      reason: string;
    }
  | {
      kind: "unresolved";
      observation: ExecutiveConcernObservation;
      reason: string;
    }
  | {
      kind: "ambiguous";
      observation: ExecutiveConcernObservation;
      candidates: ExecutiveConcernIdentityCandidate[];
      reason: string;
    };
