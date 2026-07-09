import type {
  ExecutiveReasoningResult,
} from "@/lib/executive/reasoning";

import type {
  ExecutiveBrief,
  ExecutivePriority,
} from "./types";

export interface ExecutiveBriefBuilder {
  build(
    reasoning: ExecutiveReasoningResult
  ): ExecutiveBrief;
}

export class BasicExecutiveBriefBuilder
  implements ExecutiveBriefBuilder
{
  build(
    reasoning: ExecutiveReasoningResult
  ): ExecutiveBrief {
    const priorities: ExecutivePriority[] =
      reasoning.priorities.map((priority) => ({
        title: priority.title,
        whyItMatters: priority.rationale,
        suggestedNextStep: priority.suggestedNextStep,
        evidence: priority.evidenceIds,
      }));

    return {
      title: "Forge Executive Brief",

      summary:
        priorities.length > 0
          ? "Forge identified areas that may deserve your attention."
          : "Forge did not identify major attention areas from this input.",

      priorities,

      createdAt: reasoning.generatedAt,
    };
  }
}
