import type {
  ExecutiveAttentionReconciliationInput,
  ExecutiveAttentionReconciliationResult,
} from "./types";

export interface ExecutiveAttentionReconciliationEngine {
  reconcile(
    input: ExecutiveAttentionReconciliationInput
  ): ExecutiveAttentionReconciliationResult;
}
