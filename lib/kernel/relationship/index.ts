export type {
  RelationshipCreateInput,
  RelationshipPredicate,
  RelationshipRecord,
} from "./types";

export { BasicRelationshipEngine } from "./basic-relationship-engine";
export { createRelationshipEngine } from "./create-relationship-engine";
export { InMemoryRelationshipRepository } from "./in-memory-relationship-repository";
export { mergeRelationshipConfidence } from "./relationship-confidence";
export { mergeSupportingObservationIds } from "./relationship-evidence";
export { getRelationshipIdentity } from "./relationship-identity";

export type { RelationshipEngine } from "./relationship-engine";
export type { RelationshipRepository } from "./relationship-repository";

export {
  CollaboratesWithRule,
  createDefaultRelationshipRules,
  inferRelationshipsByPredicate,
  LivesInRule,
  MarriedToRule,
  OwnsRule,
  ReportsToRule,
  WorksForRule,
} from "./rules";

export type { RelationshipRule } from "./rules";