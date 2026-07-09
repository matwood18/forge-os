import type {
  ExecutiveConcernReconciliationEngine,
} from "./executive-concern-reconciliation-engine";

import type {
  ExecutiveConcernReconciliationDecision,
  ExecutiveConcernReconciliationInput,
} from "./types";

export class BasicExecutiveConcernReconciliationEngine
  implements ExecutiveConcernReconciliationEngine
{
  reconcile(
    input: ExecutiveConcernReconciliationInput
  ): ExecutiveConcernReconciliationDecision {
    const { existingConcern, observation } = input;

    if (
      existingConcern &&
      existingConcern.id !== observation.concernId
    ) {
      throw new Error(
        "Executive concern reconciliation requires matching concern identity."
      );
    }

    if (!existingConcern) {
      return {
        kind: "create",
        concernId: observation.concernId,
        createInput: {
          id: observation.concernId,
          title: observation.title,
          importance: observation.importance,
          confidence: observation.confidence,
          observedAt: observation.observedAt,
          evidence: observation.evidence,
          latestRecommendation: observation.latestRecommendation,
          clarificationNeeded: observation.clarificationNeeded,
        },
        reason: "No durable executive concern exists for this observation.",
      };
    }

    const existingEvidenceIds = new Set(
      existingConcern.supportingEvidence.map((evidence) => evidence.id)
    );

    const novelEvidence = observation.evidence.filter(
      (evidence) => !existingEvidenceIds.has(evidence.id)
    );

    const importanceChanged =
      existingConcern.importance !== observation.importance;

    const confidenceChanged =
      existingConcern.confidence !== observation.confidence;

    const recommendationChanged =
      observation.latestRecommendation !== undefined &&
      observation.latestRecommendation.id !==
        existingConcern.latestRecommendation?.id;

    const clarificationChanged =
      observation.clarificationNeeded !== undefined &&
      observation.clarificationNeeded.id !==
        existingConcern.clarificationNeeded?.id;

    if (
      novelEvidence.length === 0 &&
      !importanceChanged &&
      !confidenceChanged &&
      !recommendationChanged &&
      !clarificationChanged
    ) {
      return {
        kind: "no_change",
        concernId: existingConcern.id,
        reason:
          "The observation adds no new evidence or executive state change.",
      };
    }

    return {
      kind: "update",
      concernId: existingConcern.id,
      updateInput: {
        id: existingConcern.id,
        importance: importanceChanged
          ? observation.importance
          : undefined,
        confidence: confidenceChanged
          ? observation.confidence
          : undefined,
        observedAt: observation.observedAt,
        evidence:
          novelEvidence.length > 0
            ? novelEvidence
            : undefined,
        latestRecommendation: recommendationChanged
          ? observation.latestRecommendation
          : undefined,
        clarificationNeeded: clarificationChanged
          ? observation.clarificationNeeded
          : undefined,
      },
      reason:
        "The observation adds new evidence or changes executive concern state.",
    };
  }
}

