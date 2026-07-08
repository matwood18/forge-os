// lib/kernel/semantic-claim/basic-semantic-claim-engine.ts
import type { EntityMention } from "@/lib/kernel/entity-mention";

import type { SemanticClaimEngine } from "./semantic-claim-engine";
import type { SemanticClaimRepository } from "./semantic-claim-repository";
import type {
  SemanticClaim,
  SemanticClaimEngineInput,
  SemanticClaimEngineResult,
} from "./types";

const PERSON_LIKE_KINDS = new Set([
  "person_name",
  "current_operator",
  "pronoun",
]);

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
          confidence: mention.confidence,
        })
      );
  }

  private buildEmotionClaims(
    input: SemanticClaimEngineInput
  ): SemanticClaim[] {
    const mentions = input.entityMentionExtraction.mentions;

    return mentions
      .filter((mention) => mention.kind === "emotion_expression")
      .map((emotionMention, index) => {
        const subjectMention = this.findNearestPrecedingPersonLikeMention(
          mentions,
          emotionMention
        );

        if (!subjectMention) {
          return this.createClaim({
            input,
            mention: emotionMention,
            index,
            subject: "current_input",
            predicate: "contains_possible_emotion_expression",
            object: emotionMention.normalizedText,
            confidence: emotionMention.confidence,
          });
        }

        return this.createClaim({
          input,
          mention: emotionMention,
          index,
          subject: this.subjectFor(subjectMention),
          predicate: "expresses_possible_emotion",
          object: emotionMention.normalizedText,
          confidence: Math.min(
            emotionMention.confidence,
            subjectMention.confidence
          ),
        });
      });
  }

  private findNearestPrecedingPersonLikeMention(
    mentions: EntityMention[],
    emotionMention: EntityMention
  ): EntityMention | null {
    const candidates = mentions
      .filter(
        (mention) =>
          PERSON_LIKE_KINDS.has(mention.kind) &&
          mention.endOffset <= emotionMention.startOffset
      )
      .sort((left, right) => right.endOffset - left.endOffset);

    return candidates[0] ?? null;
  }

  private subjectFor(mention: EntityMention): string {
    if (mention.kind === "current_operator") {
      return "current_operator";
    }

    return mention.normalizedText;
  }

  private createClaim(input: {
    input: SemanticClaimEngineInput;
    mention: EntityMention;
    index: number;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
  }): SemanticClaim {
    return {
      id: `${input.input.entityMentionExtraction.id}:semantic-claim:${input.index + 1}:${input.predicate}`,
      subject: input.subject,
      predicate: input.predicate,
      object: input.object,
      confidence: input.confidence,
      provenance: {
        sourceType: "entity_mention",
        sourceId: input.mention.id,
      },
      createdAt: new Date(),
    };
  }
}