import type {
  ExecutiveAttentionInput,
  ExecutiveAttentionResult,
} from "./types";

export interface ExecutiveAttentionEngine {
  evaluate(
    input: ExecutiveAttentionInput
  ): ExecutiveAttentionResult;
}
