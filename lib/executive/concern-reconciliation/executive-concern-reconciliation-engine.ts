import type {
  ExecutiveConcernReconciliationDecision,
  ExecutiveConcernReconciliationInput,
} from "./types";

export interface ExecutiveConcernReconciliationEngine {
  reconcile(
    input: ExecutiveConcernReconciliationInput
  ): ExecutiveConcernReconciliationDecision;
}

