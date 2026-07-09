import type {
  ExecutiveAttentionReconciliationTransition,
} from "@/lib/executive/attention-reconciliation";

export type ExecutiveAttentionTransitionExplanation = {
  transition: ExecutiveAttentionReconciliationTransition;
  summary: string;
  changed: boolean;
};

export type ExecutiveAttentionTransitionInput = {
  transition: ExecutiveAttentionReconciliationTransition;
};
