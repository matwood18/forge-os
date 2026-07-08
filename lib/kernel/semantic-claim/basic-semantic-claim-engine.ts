// lib/kernel/semantic-claim/basic-semantic-claim-engine.ts
import type { SemanticClaimEngine } from "./semantic-claim-engine";
import type { SemanticClaimRepository } from "./semantic-claim-repository";
import type {
  SemanticClaim,
  SemanticClaimEngineInput,
  SemanticClaimEngineResult,
} from "./types";

export class BasicSemanticClaimEngine implements SemanticClaimEngine {
  constructor(private readonly repository: SemanticClaimRepository) {}

  async generateClaims(
    input: SemanticClaimEngineInput
  ): Promise<SemanticClaimEngineResult> {
    const claims = input.entityMentionExtraction.mentions
      .filter((mention) => mention.kind === "task_or_obligation")
      .map((mention, index) => {
        return {
          id: `${input.entityMentionExtraction.id}:semantic-claim:${index + 1}`,
          subject: "current_operator",
          predicate: "has_possible_obligation",
          object: mention.normalizedText,
          confidence: mention.confidence,
          provenance: {
            sourceType: "entity_mention",
            sourceId: mention.id,
          },
          createdAt: new Date(),
        } satisfies SemanticClaim;
      });

    const persistedClaims = await Promise.all(
      claims.map((claim) => this.repository.save(claim))
    );

    return {
      claims: persistedClaims,
    };
  }
}