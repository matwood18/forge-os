import { BasicRelationshipEngine } from "./basic-relationship-engine";
import { InMemoryRelationshipRepository } from "./in-memory-relationship-repository";
import { createDefaultRelationshipRules } from "./rules";

export function createRelationshipEngine(): BasicRelationshipEngine {
  return new BasicRelationshipEngine(
    new InMemoryRelationshipRepository(),
    createDefaultRelationshipRules(),
  );
}