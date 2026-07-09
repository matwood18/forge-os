import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "@/lib/executive/reasoning";

import type {
  ExecutiveSituationInput,
  ExecutiveSituationResult,
} from "@/lib/executive/situation";

import type {
  ClarificationRequest,
  ClarificationRequestCandidate,
} from "./types";

export type ClarificationProjectionInput = {
  situationInput: ExecutiveSituationInput;
  situationResult: ExecutiveSituationResult;
  reasoningInput: ExecutiveReasoningInput;
  reasoningResult: ExecutiveReasoningResult;
  candidates: ClarificationRequestCandidate[];
  createdAt?: Date;
};

export interface ClarificationProjector {
  project(input: ClarificationProjectionInput): ClarificationRequest[];
}
