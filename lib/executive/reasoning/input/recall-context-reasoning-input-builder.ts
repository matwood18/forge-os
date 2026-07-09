import type { ExecutiveRecallContext } from "@/lib/executive/recall-context";

import type {
  ExecutiveReasoningEvidence,
  ExecutiveReasoningInput,
} from "../types";

export type RecallContextReasoningInputBuilderInput = {
  sourceText: string;
  recallContext: ExecutiveRecallContext;
};

export interface RecallContextReasoningInputBuilder {
  build(input: RecallContextReasoningInputBuilderInput): ExecutiveReasoningInput;
}

export class BasicRecallContextReasoningInputBuilder
  implements RecallContextReasoningInputBuilder
{
  build(input: RecallContextReasoningInputBuilderInput): ExecutiveReasoningInput {
    const evidence: ExecutiveReasoningEvidence[] =
      input.recallContext.concerns.flatMap((concern) => {
        const concernEvidence: ExecutiveReasoningEvidence[] = [
          {
            id: `${concern.id}:recall`,
            label: `Recalled executive concern: ${concern.title}`,
            summary: concern.reason,
            confidence: concern.confidence,
            source: concern.id,
          },
        ];

        for (const evidenceItem of concern.evidence) {
          concernEvidence.push({
            id: `${concern.id}:evidence:${evidenceItem.id}`,
            label: `Recalled concern evidence: ${concern.title}`,
            summary: evidenceItem.summary,
            confidence: concern.confidence,
            source: evidenceItem.sourceId ?? concern.id,
            identityEvidenceIds:
              evidenceItem.sourceId?.startsWith("concern-identity:")
                ? [evidenceItem.sourceId]
                : undefined,
          });
        }

        if (concern.latestRecommendation) {
          concernEvidence.push({
            id: `${concern.id}:latest-recommendation`,
            label: `Latest recalled recommendation: ${concern.title}`,
            summary: `${concern.latestRecommendation.summary} Suggested next step: ${concern.latestRecommendation.suggestedNextStep}`,
            confidence: concern.confidence,
            source: concern.id,
          });
        }

        if (concern.clarificationNeeded) {
          concernEvidence.push({
            id: `${concern.id}:clarification-needed`,
            label: `Recalled clarification need: ${concern.title}`,
            summary: `${concern.clarificationNeeded.question} Reason: ${concern.clarificationNeeded.reason}`,
            confidence: concern.confidence,
            source: concern.id,
          });
        }

        return concernEvidence;
      });

    return {
      input: input.sourceText,
      evidence,
    };
  }
}
