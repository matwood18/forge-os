// lib/kernel/semantic-claim/in-memory-semantic-claim-repository.ts
import type { SemanticClaimRepository } from "./semantic-claim-repository";
import type { SemanticClaim } from "./types";

export class InMemorySemanticClaimRepository
  implements SemanticClaimRepository
{
  private readonly claims: SemanticClaim[] = [];

  async save(claim: SemanticClaim): Promise<SemanticClaim> {
    this.claims.push(claim);

    return claim;
  }

  async list(): Promise<SemanticClaim[]> {
    return [...this.claims];
  }
}