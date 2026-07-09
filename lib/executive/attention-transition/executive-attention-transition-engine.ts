import type {
  ExecutiveAttentionTransitionInput,
  ExecutiveAttentionTransitionExplanation,
} from "./types";

export interface ExecutiveAttentionTransitionEngine {
  explain(
    input: ExecutiveAttentionTransitionInput
  ): ExecutiveAttentionTransitionExplanation;
}
