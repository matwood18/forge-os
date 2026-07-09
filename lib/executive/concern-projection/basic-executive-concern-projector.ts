import type { ExecutiveAttentionRecord } from "@/lib/executive/attention";
import type { ExecutiveConcernImportance } from "@/lib/executive/concern";
import type { ExecutiveConcernObservation } from "@/lib/executive/concern-reconciliation";
import type { ClarificationRequest } from "@/lib/executive/clarification";
import type { Suggestion } from "@/lib/executive/suggestion";

import type { ExecutiveConcernProjector } from "./executive-concern-projector";
import type {
  ExecutiveConcernProjectionInput,
  ExecutiveConcernProjectionResult,
} from "./types";

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function concernIdForTitle(title: string): string {
  return ["concern", slug(title)].filter(Boolean).join(":");
}

function importanceForAttention(
  attention: ExecutiveAttentionRecord
): ExecutiveConcernImportance {
  if (attention.state === "surfaced") {
    return "high";
  }

  if (
    attention.selectionSignals.some(
      (signal) =>
        signal.kind === "highConsequence" ||
        signal.kind === "relationshipRisk" ||
        signal.kind === "requiresUserAttention"
    )
  ) {
    return "medium";
  }

  return "low";
}

function findSuggestionForTitle(
  suggestions: Suggestion[],
  title: string
): Suggestion | undefined {
  return suggestions.find((suggestion) => suggestion.title === title);
}

function findClarificationForTitle(
  clarifications: ClarificationRequest[],
  title: string
): ClarificationRequest | undefined {
  return clarifications.find((clarification) =>
    clarification.situations.some((situation) => situation.title === title)
  );
}

export class BasicExecutiveConcernProjector implements ExecutiveConcernProjector {
  project(input: ExecutiveConcernProjectionInput): ExecutiveConcernProjectionResult {
    const observations: ExecutiveConcernObservation[] = input.attention.attention.map(
      (attention) => {
        const title = attention.priority.priority.title;
        const suggestion = findSuggestionForTitle(input.output.suggestions, title);
        const clarification = findClarificationForTitle(
          input.output.clarifications,
          title
        );

        const evidence = [
          {
            id: `concern-evidence:attention:${slug(title)}`,
            kind: "executiveAttention" as const,
            summary:
              attention.state === "surfaced"
                ? "Forge surfaced this priority as executive attention."
                : "Forge is quietly tracking this priority as possible executive attention.",
            observedAt: attention.createdAt,
            sourceId: title,
          },
          ...(suggestion
            ? [
                {
                  id: `concern-evidence:suggestion:${suggestion.id}`,
                  kind: "suggestion" as const,
                  summary: suggestion.whyItMatters,
                  observedAt: suggestion.createdAt,
                  sourceId: suggestion.id,
                },
              ]
            : []),
          ...(clarification
            ? [
                {
                  id: `concern-evidence:clarification:${clarification.id}`,
                  kind: "clarification" as const,
                  summary: clarification.uncertainty,
                  observedAt: clarification.createdAt,
                  sourceId: clarification.id,
                },
              ]
            : []),
        ];

        return {
          concernId: concernIdForTitle(title),
          title,
          importance: importanceForAttention(attention),
          confidence: attention.priority.priority.confidence,
          observedAt: attention.createdAt,
          evidence,
          latestRecommendation: suggestion
            ? {
                id: suggestion.id,
                summary: suggestion.whyItMatters,
                suggestedNextStep: suggestion.suggestedNextStep,
                createdAt: suggestion.createdAt,
                evidenceIds: suggestion.evidence.map((item) => item.id),
              }
            : undefined,
          clarificationNeeded: clarification
            ? {
                id: clarification.id,
                question: clarification.question,
                reason: clarification.whyForgeIsAsking,
                createdAt: clarification.createdAt,
                evidenceIds: clarification.evidence.map((item) => item.id),
              }
            : undefined,
        };
      }
    );

    return {
      observations,
      generatedAt: input.attention.generatedAt,
    };
  }
}

