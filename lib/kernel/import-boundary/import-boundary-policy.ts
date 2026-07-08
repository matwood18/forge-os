import type {
  ImportBoundaryDecision,
  ImportBoundaryRequest,
} from "./types";

export interface ImportBoundaryPolicy {
  evaluate(
    request: ImportBoundaryRequest
  ): ImportBoundaryDecision;
}
