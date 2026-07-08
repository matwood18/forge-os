// lib/kernel/semantic-claim-relation/basic-semantic-claim-relation-engine.ts
import type {
  EntityMention,
  EntityMentionExtractionRecord,
} from "@/lib/kernel/entity-mention";
import type { SemanticClaim } from "@/lib/kernel/semantic-claim";

import type { SemanticClaimRelationEngine } from "./semantic-claim-relation-engine";
import type { SemanticClaimRelationRepository } from "./semantic-claim-relation-repository";
import type {
  SemanticClaimRelation,
  SemanticClaimRelationEngineInput,
  SemanticClaimRelationEngineResult,
} from "./types";

const MAX_SOURCE_MENTION_GAP = 80;

export class BasicSemanticClaimRelationEngine
  implements SemanticClaimRelationEngine
{
  constructor(private readonly repository: SemanticClaimRelationRepository) {}

  async relateClaims(
    input: SemanticClaimRelationEngineInput
  ): Promise<SemanticClaimRelationEngineResult> {
    const relations = this.buildPossibleEmotionObligationRelations(input);

    const persistedRelations = await Promise.all(
      relations.map((relation) => this.repository.save(relation))
    );

    return {
      relations: persistedRelations,
    };
  }

  private buildPossibleEmotionObligationRelations(
    input: SemanticClaimRelationEngineInput
  ): SemanticClaimRelation[] {
    const emotionClaims = input.claims.filter(
      (claim) => claim.predicate === "expresses_possible_emotion"
    );

    const obligationClaims = input.claims.filter(
      (claim) => claim.predicate === "has_possible_obligation"
    );

    return emotionClaims.flatMap((emotionClaim) =>
      obligationClaims.flatMap((obligationClaim) => {
        const emotionMention = this.findSourceMention(
          emotionClaim,
          input.entityMentionExtraction
        );
        const obligationMention = this.findSourceMention(
          obligationClaim,
          input.entityMentionExtraction
        );

        if (!emotionMention || !obligationMention) {
          return [];
        }

        const gap = this.sourceMentionGap(emotionMention, obligationMention);

        if (gap > MAX_SOURCE_MENTION_GAP) {
          return [];
        }

        return [
          this.createRelation({
            fromClaim: emotionClaim,
            toClaim: obligationClaim,
            emotionMention,
            obligationMention,
            gap,
          }),
        ];
      })
    );
  }

  private findSourceMention(
    claim: SemanticClaim,
    extraction: EntityMentionExtractionRecord
  ): EntityMention | null {
    if (claim.provenance.sourceType !== "entity_mention") {
      return null;
    }

    return (
      extraction.mentions.find(
        (mention) => mention.id === claim.provenance.sourceId
      ) ?? null
    );
  }

  private sourceMentionGap(
    left: EntityMention,
    right: EntityMention
  ): number {
    if (left.endOffset <= right.startOffset) {
      return right.startOffset - left.endOffset;
    }

    if (right.endOffset <= left.startOffset) {
      return left.startOffset - right.endOffset;
    }

    return 0;
  }

  private createRelation(input: {
    fromClaim: SemanticClaim;
    toClaim: SemanticClaim;
    emotionMention: EntityMention;
    obligationMention: EntityMention;
    gap: number;
  }): SemanticClaimRelation {
    return {
      id: `${input.fromClaim.id}:relation:may_be_related_to:${input.toClaim.id}`,
      fromClaimId: input.fromClaim.id,
      toClaimId: input.toClaim.id,
      kind: "may_be_related_to",
      confidence: Math.min(
        input.fromClaim.confidence,
        input.toClaim.confidence,
        0.45
      ),
      evidence: [
        {
          kind: "shared_claim_set",
          sourceIds: [input.fromClaim.id, input.toClaim.id],
          rationale:
            "Both claims were generated from the same semantic claim engine input.",
        },
        {
          kind: "source_mention_proximity",
          sourceIds: [
            input.emotionMention.id,
            input.obligationMention.id,
          ],
          rationale: `The source mentions are separated by ${input.gap} character(s), within the ${MAX_SOURCE_MENTION_GAP}-character relation threshold.`,
        },
      ],
      provenance: {
        sourceType: "semantic_claim_set",
        sourceId: input.fromClaim.provenance.sourceId,
      },
      createdAt: new Date(),
    };
  }
}