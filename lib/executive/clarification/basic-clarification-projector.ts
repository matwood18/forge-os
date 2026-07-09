import type {
  ClarificationProjector,
  ClarificationProjectionInput,
} from "./clarification-projector";
import type { ClarificationRequest } from "./types";

function stableClarificationId(index: number, question: string): string {
  return [
    "clarification",
    index + 1,
    question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 56),
  ].filter(Boolean).join(":");
}

export class BasicClarificationProjector implements ClarificationProjector {
  project(input: ClarificationProjectionInput): ClarificationRequest[] {
    const createdAt = input.createdAt ?? input.reasoningResult.generatedAt;

    const reasoningEvidenceById = new Map(
      input.reasoningInput.evidence.map((evidence) => [
        evidence.id,
        evidence,
      ])
    );

    const situationEvidenceById = new Map(
      input.situationInput.evidence.map((evidence) => [
        evidence.id,
        evidence,
      ])
    );

    const situationsById = new Map(
      input.situationResult.situations.map((situation) => [
        situation.id,
        situation,
      ])
    );

    return input.candidates.flatMap((candidate, index) => {
      const evidence = candidate.evidenceIds.flatMap((evidenceId) => {
        const resolved =
          reasoningEvidenceById.get(evidenceId) ??
          situationEvidenceById.get(evidenceId);

        return resolved ? [resolved] : [];
      });

      const situations = candidate.situationIds.flatMap((situationId) => {
        const situation = situationsById.get(situationId);

        return situation ? [situation] : [];
      });

      if (
        evidence.length !== candidate.evidenceIds.length ||
        situations.length !== candidate.situationIds.length
      ) {
        return [];
      }

      return [
        {
          id: stableClarificationId(index, candidate.question),
          question: candidate.question,
          whyForgeIsAsking: candidate.whyForgeIsAsking,
          uncertainty: candidate.uncertainty,
          evidence,
          situations,
          answerChoices: candidate.answerChoices ?? [],
          allowsFreeFormAnswer: candidate.allowsFreeFormAnswer,
          confidence: candidate.confidence,
          status: "pending",
          createdAt,
        },
      ];
    });
  }
}
