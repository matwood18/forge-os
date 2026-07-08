// lib/kernel/semantic-claim-relation/in-memory-semantic-claim-relation-repository.ts
import type { SemanticClaimRelationRepository } from "./semantic-claim-relation-repository";
import type { SemanticClaimRelation } from "./types";

export class InMemorySemanticClaimRelationRepository
  implements SemanticClaimRelationRepository
{
  private readonly relations: SemanticClaimRelation[] = [];

  async save(
    relation: SemanticClaimRelation
  ): Promise<SemanticClaimRelation> {
    this.relations.push(relation);

    return relation;
  }

  async list(): Promise<SemanticClaimRelation[]> {
    return [...this.relations];
  }
}