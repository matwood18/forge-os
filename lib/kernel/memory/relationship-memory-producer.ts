import type { RelationshipRecord } from "../relationship";
import type { MemoryProducer } from "./memory-producer";
import type { MemoryAssertion } from "./types";

export class RelationshipMemoryProducer
  implements MemoryProducer<RelationshipRecord[]>
{
  produce(relationships: RelationshipRecord[]): MemoryAssertion[] {
    return relationships.map((relationship) => ({
      belief: {
        kind: "semantic",
        subjectEntityId: relationship.subjectEntityId,
        predicate: relationship.predicate,
        objectEntityId: relationship.objectEntityId,
        objectValue: null,
        confidence: relationship.confidence,
      },
      evidence: {
        evidenceKind: "relationship",
        evidenceId: relationship.id,
        supportsMemory: true,
        confidenceImpact: relationship.confidence,
      },
    }));
  }
}