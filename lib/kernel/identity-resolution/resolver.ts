import type {
  IdentityEvidence,
  IdentityResolutionResult,
} from "./types";

export interface IdentityResolver {
  resolve(evidence: IdentityEvidence[]): Promise<IdentityResolutionResult>;
}