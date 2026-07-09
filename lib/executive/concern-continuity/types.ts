import type {
  ExecutiveReasonedPriority,
  ExecutiveReasoningResult,
} from "../reasoning";

export type ExecutiveConcernContinuityStatus =
  | "unchanged"
  | "converged"
  | "ambiguous";

export type ExecutiveConcernContinuityInput = {
  reasoning: ExecutiveReasoningResult;
};

export type ExecutiveConcernContinuityRecord = {
  status: ExecutiveConcernContinuityStatus;
  priority: ExecutiveReasonedPriority;
  contributingPriorities: ExecutiveReasonedPriority[];
  sharedIdentityEvidenceIds: string[];
  contributingEvidenceIds: string[];
};

export type ExecutiveConcernContinuityResult = {
  priorities: ExecutiveReasonedPriority[];
  records: ExecutiveConcernContinuityRecord[];
  generatedAt: Date;
  provider: ExecutiveReasoningResult["provider"];
};
