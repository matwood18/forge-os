// lib/kernel/semantic-claim/basic-semantic-claim-engine.ts
import type { EntityMention } from "@/lib/kernel/entity-mention";

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
    const obligationClaims = this.buildObligationClaims(input);
    const emotionClaims = this.buildEmotionClaims(input);

    const persistedClaims = await Promise.all(
      [...obligationClaims, ...emotionClaims].map((claim) =>
        this.repository.save(claim)
      )
    );

    return {
      claims: persistedClaims,
    };
  }

  private buildObligationClaims(
    input: SemanticClaimEngineInput
  ): SemanticClaim[] {
    return input.entityMentionExtraction.mentions
      .filter((mention) => mention.kind === "task_or_obligation")
      .map((mention, index) =>
        this.createClaim({
          input,
          mention,
          index,
          subject: "current_operator",
          predicate: "has_possible_obligation",
          object: mention.normalizedText,
        })
      );
  }

  private buildEmotionClaims(
    input: SemanticClaimEngineInput
  ): SemanticClaim[] {
    return input.entityMentionExtraction.mentions
      .filter((mention) => mention.kind === "emotion_expression")
      .map((mention, index) =>
        this.createClaim({
          input,
          mention,
          index,
          subject: "current_input",
          predicate: "contains_possible_emotion_expression",
          object: mention.normalizedText,
        })
      );
  }

  private createClaim(input: {
    input: SemanticClaimEngineInput;
    mention: EntityMention;
    index: number;
    subject: string;
    predicate: string;
    object: string;
  }): SemanticClaim {
    return {
      id: `${input.input.entityMentionExtraction.id}:semantic-claim:${input.index + 1}:${input.predicate}`,
      subject: input.subject,
      predicate: input.predicate,
      object: input.object,
      confidence: input.mention.confidence,
      provenance: {
        sourceType: "entity_mention",
        sourceId: input.mention.id,
      },
      createdAt: new Date(),
    };
  }
}