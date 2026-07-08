// lib/kernel/semantic-claim/types.ts
import type { EntityMentionExtractionRecord } from "@/lib/kernel/entity-mention";

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

export type SemanticClaimEngineInput = {
  entityMentionExtraction: EntityMentionExtractionRecord;
};

export type SemanticClaimEngineResult = {
  claims: SemanticClaim[];
};