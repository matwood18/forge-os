// lib/kernel/semantic-claim-relation/types.ts
import type { EntityMentionExtractionRecord } from "@/lib/kernel/entity-mention";
import type { SemanticClaim } from "@/lib/kernel/semantic-claim";

export type SemanticClaimRelationKind =
  | "may_be_related_to"
  | "supports"
  | "contradicts";

export type SemanticClaimRelationProvenance = {
  sourceType: string;
  sourceId: string;
};

export type SemanticClaimRelationEvidenceKind =
  | "shared_claim_set"
  | "source_mention_proximity";

export type SemanticClaimRelationEvidence = {
  kind: SemanticClaimRelationEvidenceKind;
  sourceIds: string[];
  rationale: string;
};

export type SemanticClaimRelation = {
  id: string;
  fromClaimId: string;
  toClaimId: string;
  kind: SemanticClaimRelationKind;
  confidence: number;
  evidence: SemanticClaimRelationEvidence[];
  provenance: SemanticClaimRelationProvenance;
  createdAt: Date;
};

export type SemanticClaimRelationEngineInput = {
  claims: SemanticClaim[];
  entityMentionExtraction: EntityMentionExtractionRecord;
};

export type SemanticClaimRelationEngineResult = {
  relations: SemanticClaimRelation[];
};