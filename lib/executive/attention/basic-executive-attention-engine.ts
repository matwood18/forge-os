import type { ExecutiveAttentionEngine } from "./executive-attention-engine";
import type {
  ExecutiveAttentionInput,
  ExecutiveAttentionResult,
} from "./types";

export class BasicExecutiveAttentionEngine
  implements ExecutiveAttentionEngine
{
  evaluate(
    input: ExecutiveAttentionInput
  ): ExecutiveAttentionResult {
    return {
      attention: input.decisions.map((decision) => ({
        priority: decision.priority,
        state:
          decision.decision === "surface"
            ? "surfaced"
            : "quiet",
        selectionDecision: decision.decision,
        selectionSignals: decision.selectionSignals,
        createdAt: input.generatedAt,
      })),
      generatedAt: input.generatedAt,
    };
  }
}
