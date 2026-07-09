import type { ExecutiveReasoningProvider } from "../executive-reasoning-provider";
import type {
  ExecutiveReasonedPriority,
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "../types";

export class BasicExecutiveReasoningProvider
  implements ExecutiveReasoningProvider
{
  async reason(
    input: ExecutiveReasoningInput
  ): Promise<ExecutiveReasoningResult> {
    const priorities: ExecutiveReasonedPriority[] = [];

    const obligationEvidence = input.evidence.filter((item) =>
      item.label.toLowerCase().includes("obligation")
    );

    const relationshipEvidence = input.evidence.filter((item) =>
      item.label.toLowerCase().includes("relationship") ||
      item.label.toLowerCase().includes("emotion")
    );

    if (obligationEvidence.length > 0) {
      priorities.push({
        title: "Resolve unresolved obligation",
        rationale:
          "The available evidence suggests there is unfinished work that may need attention.",
        suggestedNextStep:
          "Review the obligation and decide the smallest concrete next step.",
        evidenceIds: obligationEvidence.map((item) => item.id),
        confidence: 0.72,
      });
    }

    if (relationshipEvidence.length > 0) {
      priorities.push({
        title: "Address possible relationship impact",
        rationale:
          "The available evidence suggests another person may be affected by the situation.",
        suggestedNextStep:
          "Consider whether a short update or clarification would reduce friction.",
        evidenceIds: relationshipEvidence.map((item) => item.id),
        confidence: 0.68,
      });
    }

    return {
      priorities,
      generatedAt: new Date(),
      provider: "basic",
    };
  }
}
