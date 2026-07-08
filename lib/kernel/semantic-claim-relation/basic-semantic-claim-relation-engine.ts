// lib/kernel/semantic-claim-relation/basic-semantic-claim-relation-engine.ts
import type { SemanticClaim } from "@/lib/kernel/semantic-claim";

import type { SemanticClaimRelationEngine } from "./semantic-claim-relation-engine";
import type { SemanticClaimRelationRepository } from "./semantic-claim-relation-repository";
import type {
  SemanticClaimRelation,
  SemanticClaimRelationEngineInput,
  SemanticClaimRelationEngineResult,
} from "./types";

export class BasicSemanticClaimRelationEngine
  implements SemanticClaimRelationEngine
{
  constructor(private readonly repository: SemanticClaimRelationRepository) {}

  async relateClaims(
    input: SemanticClaimRelationEngineInput
  ): Promise<SemanticClaimRelationEngineResult> {
    const relations = this.buildPossibleEmotionObligationRelations(
      input.claims
    );

    const persistedRelations = await Promise.all(
      relations.map((relation) => this.repository.save(relation))
    );

    return {
      relations: persistedRelations,
    };
  }

  private buildPossibleEmotionObligationRelations(
    claims: SemanticClaim[]
  ): SemanticClaimRelation[] {
    const emotionClaims = claims.filter(
      (claim) => claim.predicate === "expresses_possible_emotion"
    );

    const obligationClaims = claims.filter(
      (claim) => claim.predicate === "has_possible_obligation"
    );

    return emotionClaims.flatMap((emotionClaim) =>
      obligationClaims.map((obligationClaim) =>
        this.createRelation({
          fromClaim: emotionClaim,
          toClaim: obligationClaim,
        })
      )
    );
  }

  private createRelation(input: {
    fromClaim: SemanticClaim;
    toClaim: SemanticClaim;
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
      provenance: {
        sourceType: "semantic_claim_set",
        sourceId: input.fromClaim.provenance.sourceId,
      },
      createdAt: new Date(),
    };
  }
}