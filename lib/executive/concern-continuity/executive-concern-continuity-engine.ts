import type {
  ExecutiveConcernContinuityInput,
  ExecutiveConcernContinuityResult,
} from "./types";

export interface ExecutiveConcernContinuityEngine {
  correlate(
    input: ExecutiveConcernContinuityInput
  ): ExecutiveConcernContinuityResult;
}
