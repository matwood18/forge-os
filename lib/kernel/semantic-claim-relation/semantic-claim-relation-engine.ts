// lib/kernel/semantic-claim-relation/semantic-claim-relation-engine.ts
import type {
  SemanticClaimRelationEngineInput,
  SemanticClaimRelationEngineResult,
} from "./types";

export interface SemanticClaimRelationEngine {
  relateClaims(
    input: SemanticClaimRelationEngineInput
  ): Promise<SemanticClaimRelationEngineResult>;
}