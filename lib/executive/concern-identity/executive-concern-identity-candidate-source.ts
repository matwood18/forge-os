import type { ExecutiveConcern } from "@/lib/executive/concern";
import type { ExecutiveConcernObservation } from "@/lib/executive/concern-reconciliation";

export type ExecutiveConcernIdentityCandidateSourceInput = {
  observation: ExecutiveConcernObservation;
  maxCandidates: number;
};

export interface ExecutiveConcernIdentityCandidateSource {
  findCandidates(
    input: ExecutiveConcernIdentityCandidateSourceInput
  ): Promise<ExecutiveConcern[]>;
}
