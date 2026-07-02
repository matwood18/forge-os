import type {
  RelationshipCreateInput,
  RelationshipRecord,
} from "./types";

export function getRelationshipIdentity(
  relationship: RelationshipCreateInput | RelationshipRecord,
): string {
  return [
    relationship.subjectEntityId,
    relationship.predicate,
    relationship.objectEntityId,
  ].join("::");
}