// lib/kernel/semantic-claim/types.ts

export type SemanticClaimProvenance = {
  sourceType: string;
  sourceId: string;
};

export type SemanticClaim = {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  provenance: SemanticClaimProvenance;
  createdAt: Date;
};