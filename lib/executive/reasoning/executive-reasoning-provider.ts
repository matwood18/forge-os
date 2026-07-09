import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "./types";

export interface ExecutiveReasoningProvider {
  reason(
    input: ExecutiveReasoningInput
  ): Promise<ExecutiveReasoningResult>;
}
