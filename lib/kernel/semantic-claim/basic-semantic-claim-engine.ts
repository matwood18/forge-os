// lib/kernel/semantic-claim/basic-semantic-claim-engine.ts
import type { SemanticClaimEngine } from "./semantic-claim-engine";
import type {
  SemanticClaim,
  SemanticClaimEngineInput,
  SemanticClaimEngineResult,
} from "./types";

export class BasicSemanticClaimEngine implements SemanticClaimEngine {
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

    return { claims };
  }
}