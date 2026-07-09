import type {
  ExecutiveAttentionMemoryState,
} from "@/lib/executive/attention-memory";

export type ExecutiveAttentionReconciliationTransition =
  | "surfaced_to_quiet"
  | "quiet_to_surfaced"
  | "unchanged"
  | "no_previous_state";

export type ExecutiveAttentionReconciliationInput = {
  previousState?: ExecutiveAttentionMemoryState;
  currentState: ExecutiveAttentionMemoryState;
};

export type ExecutiveAttentionReconciliationResult = {
  previousState?: ExecutiveAttentionMemoryState;
  currentState: ExecutiveAttentionMemoryState;
  transition: ExecutiveAttentionReconciliationTransition;
  changed: boolean;
};
