import type { ReasoningInput, ReasoningResult } from "./types";

export interface ReasoningEngine {
  reason(input: ReasoningInput): Promise<ReasoningResult>;
}