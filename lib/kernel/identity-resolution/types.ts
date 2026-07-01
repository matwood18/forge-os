export type IdentityKind = "person" | "organization" | "unknown";

export type IdentityResolutionStatus =
  | "resolved"
  | "question-required"
  | "unresolved";

export interface IdentityEvidence {
  type: string;
  value: string;
}

export interface IdentityResolutionResult {
  status: IdentityResolutionStatus;
  kind: IdentityKind;
  identityId?: string;
  confidence: number;
  questionId?: string;
}