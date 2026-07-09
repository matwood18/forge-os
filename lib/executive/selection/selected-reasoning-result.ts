import type {
  ExecutiveReasoningResult,
} from "@/lib/executive/reasoning";

import type {
  ExecutiveSelectionResult,
} from "./types";

export function projectSelectedReasoningResult(
  selection: ExecutiveSelectionResult,
  original: ExecutiveReasoningResult
): ExecutiveReasoningResult {
  const selectedPriorities = selection.decisions
    .filter((decision) => decision.decision === "surface")
    .map((decision) => decision.priority.priority);

  return {
    ...original,
    priorities: selectedPriorities,
  };
}
