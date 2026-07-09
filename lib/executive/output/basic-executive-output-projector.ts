import type {
  ExecutiveOutputProjectionInput,
  ExecutiveOutputProjector,
} from "./executive-output-projector";
import type { ExecutiveOutput } from "./types";

function newestDate(dates: Date[]): Date {
  const timestamps = dates.map((date) => date.getTime());

  if (timestamps.length === 0) {
    return new Date();
  }

  return new Date(Math.max(...timestamps));
}

export class BasicExecutiveOutputProjector
  implements ExecutiveOutputProjector
{
  project(input: ExecutiveOutputProjectionInput): ExecutiveOutput {
    const generatedAt =
      input.generatedAt ??
      newestDate([
        ...input.suggestions.map((suggestion) => suggestion.createdAt),
        ...input.clarifications.map(
          (clarification) => clarification.createdAt
        ),
      ]);

    return {
      suggestions: input.suggestions,
      clarifications: input.clarifications,
      summary: {
        suggestionCount: input.suggestions.length,
        clarificationCount: input.clarifications.length,
        hasActionableSuggestions: input.suggestions.some(
          (suggestion) => suggestion.status === "pending"
        ),
        hasPendingClarifications: input.clarifications.some(
          (clarification) => clarification.status === "pending"
        ),
      },
      generatedAt,
    };
  }
}
