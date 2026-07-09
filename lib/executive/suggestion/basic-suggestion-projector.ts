import type { SuggestionProjector, SuggestionProjectionInput } from "./suggestion-projector";
import type { Suggestion } from "./types";

function stableSuggestionId(index: number, title: string): string {
  return [
    "suggestion",
    index + 1,
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48),
  ].filter(Boolean).join(":");
}

export class BasicSuggestionProjector implements SuggestionProjector {
  project(input: SuggestionProjectionInput): Suggestion[] {
    const evidenceById = new Map(
      input.reasoningInput.evidence.map((evidence) => [
        evidence.id,
        evidence,
      ])
    );

    return input.reasoningResult.priorities.map((priority, index) => ({
      id: stableSuggestionId(index, priority.title),
      title: priority.title,
      whyItMatters: priority.rationale,
      suggestedNextStep: priority.suggestedNextStep,
      evidence: priority.evidenceIds.flatMap((evidenceId) => {
        const evidence = evidenceById.get(evidenceId);

        return evidence ? [evidence] : [];
      }),
      confidence: priority.confidence,
      status: "pending",
      createdAt: input.reasoningResult.generatedAt,
    }));
  }
}
