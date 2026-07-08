// lib/kernel/semantic-claim-relation/types.ts

export type SemanticClaimRelationKind =
  | "may_be_related_to"
  | "supports"
  | "contradicts";

export type SemanticClaimRelationProvenance = {
  sourceType: string;
  sourceId: string;
};

export type SemanticClaimRelation = {
  id: string;
  fromClaimId: string;
  toClaimId: string;
  kind: SemanticClaimRelationKind;
  confidence: number;
  provenance: SemanticClaimRelationProvenance;
  createdAt: Date;
};