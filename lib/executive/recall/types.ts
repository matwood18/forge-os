import type { ExecutiveConcern } from "../concern";

export type ExecutiveRecallStatus = "included" | "excluded";

export type ExecutiveRecallInput = {
  maxConcerns: number;
  asOf: Date;
  identityEvidenceIds?: string[];
};

export type ExecutiveRecalledConcern = {
  concern: ExecutiveConcern;
  reason: string;
  evidenceIds: string[];
};

export type ExecutiveRecallResult = {
  generatedAt: Date;
  maxConcerns: number;
  recalledConcerns: ExecutiveRecalledConcern[];
  excludedConcernCount: number;
  totalConcernCount: number;
};
