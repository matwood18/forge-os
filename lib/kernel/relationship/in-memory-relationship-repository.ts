import { mergeRelationshipConfidence } from "./relationship-confidence";
import { mergeSupportingObservationIds } from "./relationship-evidence";
import { getRelationshipIdentity } from "./relationship-identity";
import type { RelationshipRepository } from "./relationship-repository";
import type {
  RelationshipCreateInput,
  RelationshipRecord,
} from "./types";

export class InMemoryRelationshipRepository
  implements RelationshipRepository
{
  private relationships: RelationshipRecord[] = [];

  async remember(
    relationship: RelationshipCreateInput,
  ): Promise<RelationshipRecord> {
    const existingRelationship = this.relationships.find(
      (storedRelationship) =>
        getRelationshipIdentity(storedRelationship) ===
        getRelationshipIdentity(relationship),
    );

    if (existingRelationship) {
      const now = new Date();

      existingRelationship.confidence = mergeRelationshipConfidence(
        existingRelationship.confidence,
        relationship.confidence,
      );

      existingRelationship.supportingObservationIds =
        mergeSupportingObservationIds(
          existingRelationship.supportingObservationIds,
          relationship.supportingObservationIds,
        );

      existingRelationship.updatedAt = now;

      return existingRelationship;
    }

    const now = new Date();

    const record: RelationshipRecord = {
      ...relationship,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.relationships.push(record);

    return record;
  }

  async forSubject(
    subjectEntityId: string,
  ): Promise<RelationshipRecord[]> {
    return this.relationships.filter(
      (relationship) =>
        relationship.subjectEntityId === subjectEntityId,
    );
  }

  async all(): Promise<RelationshipRecord[]> {
    return [...this.relationships];
  }
}