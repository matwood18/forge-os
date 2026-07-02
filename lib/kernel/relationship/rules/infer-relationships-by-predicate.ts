import type { ObservationRecord } from "@/lib/kernel/observation";
import type {
  RelationshipCreateInput,
  RelationshipPredicate,
} from "../types";

export function inferRelationshipsByPredicate(
  observations: ObservationRecord[],
  predicate: RelationshipPredicate,
): RelationshipCreateInput[] {
  return observations
    .filter((observation) => observation.predicate === predicate)
    .filter(
      (observation) =>
        typeof observation.objectEntityId === "string" &&
        observation.objectEntityId.length > 0,
    )
    .map((observation) => ({
      subjectEntityId: observation.subjectEntityId,
      predicate,
      objectEntityId: observation.objectEntityId as string,
      confidence: observation.confidence,
      supportingObservationIds: [observation.id],
    }));
}