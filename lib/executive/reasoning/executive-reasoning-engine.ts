import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "./types";

export interface ExecutiveReasoningEngine {
  reason(
    input: ExecutiveReasoningInput
  ): Promise<ExecutiveReasoningResult>;
}
