// lib/kernel/semantic-claim/semantic-claim-repository.ts
import type { SemanticClaim } from "./types";

export interface SemanticClaimRepository {
  save(claim: SemanticClaim): Promise<SemanticClaim>;
  list(): Promise<SemanticClaim[]>;
}