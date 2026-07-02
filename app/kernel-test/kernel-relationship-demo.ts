import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import { InMemoryObservationRepository } from "@/lib/kernel/observation";
import {
  InMemoryRelationshipRepository,
  type RelationshipRecord,
} from "@/lib/kernel/relationship";

export async function runKernelRelationshipDemo(): Promise<
  RelationshipRecord[]
> {
  const observationRepository = new InMemoryObservationRepository();
  const relationshipRepository = new InMemoryRelationshipRepository();

  const kernel = new ForgeKernel({
    observationRepository,
    relationshipRepository,
  });

  await observationRepository.remember({
    subjectEntityId: "person:madison",
    predicate: "works_for",
    objectEntityId: "company:sun-star-electric",
    objectValue: null,
    confidence: 0.9,
    sourceEventId: "event-1",
  });

  await observationRepository.remember({
    subjectEntityId: "person:madison",
    predicate: "works_for",
    objectEntityId: "company:sun-star-electric",
    objectValue: null,
    confidence: 0.95,
    sourceEventId: "event-2",
  });

  await kernel.capture("Run kernel relationship inference test.");

  return kernel.relationships();
}