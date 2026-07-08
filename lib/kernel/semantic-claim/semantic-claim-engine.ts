// lib/kernel/semantic-claim/semantic-claim-engine.ts
import type {
  SemanticClaimEngineInput,
  SemanticClaimEngineResult,
} from "./types";

export interface SemanticClaimEngine {
  generateClaims(
    input: SemanticClaimEngineInput
  ): Promise<SemanticClaimEngineResult>;
}