import type { ObservationRecord } from "@/lib/kernel/observation";
import {
  createRelationshipEngine,
  type RelationshipRecord,
} from "@/lib/kernel/relationship";

export async function runRelationshipDemo(): Promise<
  RelationshipRecord[]
> {
  const relationshipEngine = createRelationshipEngine();

  const observations: ObservationRecord[] = [
    {
      id: "observation-1",
      subjectEntityId: "person:madison",
      predicate: "works_for",
      objectEntityId: "company:sun-star-electric",
      objectValue: null,
      confidence: 0.9,
      sourceEventId: "event-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "observation-2",
      subjectEntityId: "person:madison",
      predicate: "works_for",
      objectEntityId: "company:sun-star-electric",
      objectValue: null,
      confidence: 0.95,
      sourceEventId: "event-2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "observation-3",
      subjectEntityId: "person:madison",
      predicate: "owns",
      objectEntityId: "company:riot-manufacturing",
      objectValue: null,
      confidence: 0.95,
      sourceEventId: "event-3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "observation-4",
      subjectEntityId: "person:madison",
      predicate: "collaborates_with",
      objectEntityId: "person:test-collaborator",
      objectValue: null,
      confidence: 0.75,
      sourceEventId: "event-4",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return relationshipEngine.inferRelationships(observations);
}