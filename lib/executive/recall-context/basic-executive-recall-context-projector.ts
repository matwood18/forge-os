import type { ExecutiveRecallResult } from "../recall";
import type { ExecutiveRecallContextProjector } from "./executive-recall-context-projector";
import type {
  ExecutiveRecallContext,
  ExecutiveRecallContextConcern,
} from "./types";

export class BasicExecutiveRecallContextProjector
  implements ExecutiveRecallContextProjector
{
  project(input: ExecutiveRecallResult): ExecutiveRecallContext {
    const concerns: ExecutiveRecallContextConcern[] =
      input.recalledConcerns.map((recalled) => ({
        id: recalled.concern.id,
        title: recalled.concern.title,
        status: recalled.concern.status,
        importance: recalled.concern.importance,
        confidence: recalled.concern.confidence,
        reason: recalled.reason,
        firstObserved: recalled.concern.firstObserved,
        lastObserved: recalled.concern.lastObserved,
        evidence: recalled.concern.supportingEvidence.map((evidence) => ({
          id: evidence.id,
          summary: evidence.summary,
          sourceId: evidence.sourceId,
        })),
        latestRecommendation: recalled.concern.latestRecommendation
          ? {
              summary: recalled.concern.latestRecommendation.summary,
              suggestedNextStep:
                recalled.concern.latestRecommendation.suggestedNextStep,
              evidenceIds:
                recalled.concern.latestRecommendation.evidenceIds,
            }
          : undefined,
        clarificationNeeded: recalled.concern.clarificationNeeded
          ? {
              question: recalled.concern.clarificationNeeded.question,
              reason: recalled.concern.clarificationNeeded.reason,
              evidenceIds:
                recalled.concern.clarificationNeeded.evidenceIds,
            }
          : undefined,
      }));

    return {
      generatedAt: input.generatedAt,
      recalledConcernCount: concerns.length,
      totalConcernCount: input.totalConcernCount,
      excludedConcernCount: input.excludedConcernCount,
      concerns,
    };
  }
}
