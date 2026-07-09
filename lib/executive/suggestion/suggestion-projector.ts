import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "@/lib/executive/reasoning";

import type { Suggestion } from "./types";

export type SuggestionProjectionInput = {
  reasoningInput: ExecutiveReasoningInput;
  reasoningResult: ExecutiveReasoningResult;
};

export interface SuggestionProjector {
  project(input: SuggestionProjectionInput): Suggestion[];
}
