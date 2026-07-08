// lib/kernel/semantic-claim-relation/index.ts
export type {
  SemanticClaimRelation,
  SemanticClaimRelationEngineInput,
  SemanticClaimRelationEngineResult,
  SemanticClaimRelationEvidence,
  SemanticClaimRelationEvidenceKind,
  SemanticClaimRelationKind,
  SemanticClaimRelationProvenance,
} from "./types";

export type { SemanticClaimRelationRepository } from "./semantic-claim-relation-repository";
export type { SemanticClaimRelationEngine } from "./semantic-claim-relation-engine";

export { InMemorySemanticClaimRelationRepository } from "./in-memory-semantic-claim-relation-repository";
export { BasicSemanticClaimRelationEngine } from "./basic-semantic-claim-relation-engine";