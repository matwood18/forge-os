import type {
  ExecutiveConcernIdentityEvidenceProjectionInput,
  ExecutiveConcernIdentityEvidenceProjectionResult,
} from "./types";

export interface ExecutiveConcernIdentityEvidenceProjector {
  project(
    input: ExecutiveConcernIdentityEvidenceProjectionInput
  ): ExecutiveConcernIdentityEvidenceProjectionResult;
}
