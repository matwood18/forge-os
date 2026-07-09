import type {
  ExecutiveAttentionReconciliationEngine,
} from "./executive-attention-reconciliation-engine";

import type {
  ExecutiveAttentionReconciliationInput,
  ExecutiveAttentionReconciliationResult,
} from "./types";

export class BasicExecutiveAttentionReconciliationEngine
  implements ExecutiveAttentionReconciliationEngine
{
  reconcile(
    input: ExecutiveAttentionReconciliationInput
  ): ExecutiveAttentionReconciliationResult {
    if (!input.previousState) {
      return {
        currentState: input.currentState,
        transition: "no_previous_state",
        changed: false,
      };
    }

    if (
      input.previousState === "surfaced" &&
      input.currentState === "quiet"
    ) {
      return {
        previousState: input.previousState,
        currentState: input.currentState,
        transition: "surfaced_to_quiet",
        changed: true,
      };
    }

    if (
      input.previousState === "quiet" &&
      input.currentState === "surfaced"
    ) {
      return {
        previousState: input.previousState,
        currentState: input.currentState,
        transition: "quiet_to_surfaced",
        changed: true,
      };
    }

    return {
      previousState: input.previousState,
      currentState: input.currentState,
      transition: "unchanged",
      changed: false,
    };
  }
}
