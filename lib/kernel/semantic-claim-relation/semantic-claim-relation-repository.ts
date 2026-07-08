// lib/kernel/semantic-claim-relation/semantic-claim-relation-repository.ts
import type { SemanticClaimRelation } from "./types";

export interface SemanticClaimRelationRepository {
  save(relation: SemanticClaimRelation): Promise<SemanticClaimRelation>;
  list(): Promise<SemanticClaimRelation[]>;
}