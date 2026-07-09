import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "@/lib/executive/reasoning";

import type {
  ExecutiveBrief,
  ExecutivePriority,
} from "./types";

export type ExecutiveBriefBuilderInput = {
  reasoningInput: ExecutiveReasoningInput;
  reasoningResult: ExecutiveReasoningResult;
};

export interface ExecutiveBriefBuilder {
  build(
    input: ExecutiveBriefBuilderInput
  ): ExecutiveBrief;
}

export class BasicExecutiveBriefBuilder
  implements ExecutiveBriefBuilder
{
  build(
    input: ExecutiveBriefBuilderInput
  ): ExecutiveBrief {
    const evidenceById = new Map(
      input.reasoningInput.evidence.map((evidence) => [
        evidence.id,
        evidence,
      ])
    );

    const priorities: ExecutivePriority[] =
      input.reasoningResult.priorities.map((priority) => ({
        title: priority.title,
        whyItMatters: priority.rationale,
        suggestedNextStep: priority.suggestedNextStep,
        evidence: priority.evidenceIds.flatMap((evidenceId) => {
          const evidence = evidenceById.get(evidenceId);

          return evidence
            ? [evidence.summary]
            : [];
        }),
      }));

    return {
      title: "Forge Executive Brief",

      summary:
        priorities.length > 0
          ? "Forge identified areas that may deserve your attention."
          : "Forge did not identify major attention areas from this input.",

      priorities,

      createdAt: input.reasoningResult.generatedAt,
    };
  }
}
